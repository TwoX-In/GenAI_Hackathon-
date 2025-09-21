import base64
import os
import sqlite3
import traceback
from contextlib import contextmanager
from init import db
from google.cloud import storage
from dotenv import load_dotenv
import threading

load_dotenv()

def parse_response(id:int, response: dict):
    """
    Parse the JSON response and call appropriate storage functions.
    """
    print(f"=== PARSING RESPONSE FOR UID {id} ===")
    print(f"Response status: {response.get('status')}")
    print(f"Response keys: {list(response.keys())}")
    
    if response.get("status") != "success":
        raise ValueError("Response indicates failure")

    try:
        result = response["data"]["result"]["data"]
        uid = id  # TODO: Generate or extract dynamically
    except (KeyError, TypeError) as e:
        print(f"Error accessing response data: {e}")
        print(f"Response structure: {response}")
        raise ValueError(f"Invalid response structure: {e}")
    
    print(f"Result keys: {list(result.keys())}")
    print(f"Video data: {result.get('video', 'NO VIDEO DATA')}")
    print(f"Images data: {result.get('images', 'NO IMAGES DATA')}")
    print(f"Story data: {result.get('story', 'NO STORY DATA')}")
    print(f"=== END PARSING DEBUG ===")

    # --- Input images ---
    input_images = []
    gcs_input_uri = response["data"]["processing"].get("gcs_image_uri")
    if gcs_input_uri:
        input_images.append(gcs_input_uri)
    if input_images:
        store_input_images(uid, input_images)

    # --- Output images ---
    output_images = [img["image_uri"] for img in result.get("images", [])]
    if output_images:
        store_output_images(uid, output_images)

    # --- Video ---
    video_uri = result.get("video", {}).get("gcs_uri")
    if video_uri:
        print(f"Storing video for uid={uid}: {video_uri}")
        try:
            store_videos(uid, [video_uri])
            print(f"Successfully stored video for uid={uid}")
        except Exception as e:
            print(f"Error storing video for uid={uid}: {e}")
            import traceback
            print(f"Video storage traceback: {traceback.format_exc()}")
    else:
        print(f"No video URI found in result for uid={uid}")
        print(f"Video data: {result.get('video', 'NO VIDEO DATA')}")

    # --- FAQs ---
    faqs = result.get("faqs", [])
    if faqs:
        questions = [f["question"] for f in faqs]
        answers = [f["answer"] for f in faqs]
        store_faqs(uid, questions, answers)

    # --- Story ---
    story = result.get("story")
    if story:
        store_story(uid, story)  # implement this later

    # --- History ---
    history = result.get("history", {})
    loc_info = history.get("location_specific_info")
    desc_history = history.get("descriptive_history")
    store_history(uid, loc_info, desc_history)

    # --- Processing time ---
    store_processing_metadata(uid, response)

    # --- Price (if present in response in future) ---
    # Example:
    # store_recommended_prices(uid, result.get("price", 0.0))
# ---------------------------
# DB CONNECTION
# ---------------------------
# Thread-local storage to track if we've downloaded the database in this request
_local = threading.local()

def ensure_db_downloaded():
    """Ensure database is downloaded from GCS (only once per request)"""
    if not hasattr(_local, 'db_downloaded') or not _local.db_downloaded:
        print("[DEBUG] Downloading database from GCS...")
        db.get_db_path()  # This downloads from GCS
        _local.db_downloaded = True
        print("[DEBUG] Database downloaded from GCS")
    else:
        print("[DEBUG] Database already downloaded, skipping download")

@contextmanager
def get_connection():
    """Get a connection for write operations - downloads DB, makes changes, uploads back to GCS"""
    db_path = ensure_db_downloaded()
    # Use the database path returned by ensure_db_downloaded()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
        # Ensure the commit is flushed to disk
        conn.execute("PRAGMA synchronous = FULL")
        # Force a checkpoint to ensure data is written to disk
        conn.execute("PRAGMA wal_checkpoint(FULL)")
        
        # Upload the database back to GCS after each write operation
        try:
            from init.db import upload_db_to_gcs
            upload_db_to_gcs()
            print("[DEBUG] Database uploaded to GCS after write operation")
        except Exception as upload_error:
            print(f"[WARNING] Failed to upload database to GCS: {upload_error}")
            
    except sqlite3.Error as e:
        print(f"[DB ERROR] {e}")
        traceback.print_exc()
        raise
    finally:
        conn.close()

@contextmanager
def get_connection_readonly():
    """Get a read-only connection - uses already downloaded DB"""
    db_path = ensure_db_downloaded()
    # Use the database path returned by ensure_db_downloaded()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        # No commit, no upload - just read
    except sqlite3.Error as e:
        print(f"[DB ERROR] {e}")
        traceback.print_exc()
        raise
    finally:
        conn.close()

def upload_db_to_gcs():
    """Upload the local database to GCS - call this at the end of each request"""
    if hasattr(_local, 'db_downloaded') and _local.db_downloaded:
        print("[DEBUG] Uploading database to GCS...")
        db.upload_db_to_gcs()
        print("[DEBUG] Database uploaded to GCS")
        _local.db_downloaded = False  # Reset for next request


# ---------------------------
# HELPERS
# ---------------------------
def get_bytes_from_gcs_url(gcs_url: str):
    if not gcs_url.startswith("gs://"):
        raise ValueError("URL must start with gs://")
    parts = gcs_url[5:].split("/", 1)
    bucket_name = parts[0]
    blob_name = parts[1]

    try:
        # Get the service account key - could be a file path or JSON content
        service_account_key = os.getenv("GCP_SA_KEY")
        
        # Check if it's a file path or JSON content
        if service_account_key.startswith('{'):
            # It's JSON content, parse it directly
            import json
            credentials_info = json.loads(service_account_key)
            client = storage.Client.from_service_account_info(credentials_info)
        else:
            # It's a file path
            client = storage.Client.from_service_account_json(service_account_key)
        
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(blob_name)
        return blob.download_as_bytes()
    except Exception as e:
        print(f"[GCS ERROR] Failed to fetch {gcs_url}: {e}")
        traceback.print_exc()
        raise

def _blob_to_base64(blob: any) -> str | None:
    """Return a base64 string for bytes/memoryview, pass-through for str, or None."""
    if blob is None:
        return None
    # bytes or memoryview -> base64
    if isinstance(blob, memoryview):
        blob = blob.tobytes()
    if isinstance(blob, (bytes, bytearray)):
        return base64.b64encode(blob).decode("ascii")  # ascii is fine for base64
    # if it's already a string (maybe URL or already-base64), return as-is
    if isinstance(blob, str):
        return blob
    # unknown type
    return None


# ---------------------------
# STORE FUNCTIONS
# ---------------------------
def store_input_images(uid: int, images: list[str]):
    with get_connection() as conn:
        try:
            for i, image in enumerate(images, start=1):
                image_bytes = get_bytes_from_gcs_url(image)
                conn.execute(
                    "INSERT INTO input_image (id, tag, data) VALUES (?,?,?)",
                    (uid, i, image_bytes),
                )
                
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert input_image for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def store_output_images(uid: int, images: list[str]):
    with get_connection() as conn:
        try:
            for i, image in enumerate(images, start=1):
                image_bytes = get_bytes_from_gcs_url(image)
                conn.execute(
                    "INSERT INTO output_image (id, tag, data) VALUES (?,?,?)",
                    (uid, i, image_bytes),
                )
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert output_image for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def store_videos(uid: int, video_uris: list[str]):
    with get_connection() as conn:
        try:
            for i, uri in enumerate(video_uris, start=1):
                print(f"Downloading video from GCS: {uri}")
                video_bytes = get_bytes_from_gcs_url(uri)
                print(f"Downloaded {len(video_bytes)} bytes for video {i}")
                conn.execute(
                    "INSERT INTO output_videos (id, tag, data) VALUES (?,?,?)",
                    (uid, i, video_bytes),
                )
                print(f"Stored video {i} in database for uid={uid}")
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert videos for uid={uid} with error={e}")
            traceback.print_exc()
            raise
        except Exception as e:
            print(f"[GCS ERROR] Failed to download video for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def store_recommended_prices(uid: int, price: float):
    with get_connection() as conn:
        try:
            conn.execute("INSERT INTO pricing (id, price) VALUES (?,?)", (uid, price))
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert price for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def store_processing_metadata(uid: int, response: dict):
    status = response.get("status")
    message = response.get("message")
    error = response["data"]["result"].get("error")
    processing_time = response["data"]["result"].get("processing_time_seconds")
    with get_connection() as conn:
        try:
            conn.execute(
                """
                INSERT INTO processing_metadata
                (id, status, message, error, processing_time)
                VALUES (?,?,?,?,?)
                """,
                (uid, status, message, error, processing_time),
            )
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert processing_metadata for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def store_faqs(uid: int, questions: list[str], answers: list[str]):
    with get_connection() as conn:
        try:
            for i in range(len(questions)):
                conn.execute(
                    "INSERT INTO faqs (id, question, answer) VALUES (?,?,?)",
                    (uid, questions[i], answers[i]),
                )
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert faqs for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def store_story(uid: int, story: str):
    with get_connection() as conn:
        try:
            conn.execute("INSERT INTO story (id, story) VALUES (?,?)", (uid, story))
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert story for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def store_history(uid: int, location_specific_info: str, descriptive_history: str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_history (id, location_specific_info, descriptive_history) VALUES (?,?,?)",
                (uid, location_specific_info, descriptive_history),
            )
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert history for uid={uid} with error={e}")
            traceback.print_exc()
            raise

def store_product_title(uid: int, product_title: str):
    with get_connection() as conn:
        try:
            conn.execute("INSERT INTO product_title (id, product_title) VALUES (?,?)", (uid, product_title))
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert product_title for uid={uid} with error={e}")
            traceback.print_exc()
            raise

def store_product_title(uid: int, title: str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_title (id, title) VALUES (?, ?)", (uid, title)
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert product_title for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def store_product_artist(uid: int, artist: str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_artist (id, artist) VALUES (?, ?)", (uid, artist)
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert product_artist for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def store_product_style(uid: int, style: str):
    print(f"[DEBUG] Attempting to store product_style: uid={uid}, style={style}")
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_style (id, style) VALUES (?, ?)", (uid, style)
            )
            print(f"[DEBUG] Successfully stored product_style for uid={uid}")
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert product_style for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def store_product_origin(uid: int, origin: str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_origin (id, origin) VALUES (?, ?)", (uid, origin)
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert product_origin for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def store_product_predicted_artist(uid: int, predicted_artist: str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_predicted_artist (id, predicted_artist) VALUES (?, ?)",
                (uid, predicted_artist),
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert product_predicted_artist for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def store_product_medium(uid: int, medium: str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_medium (id, medium) VALUES (?, ?)", (uid, medium)
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert product_medium for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise

def store_product_themes(uid: int, themes: str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_themes (id, themes) VALUES (?, ?)",
                (uid, themes),
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert product_themes for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise
def store_product_colors(uid: int, colors: str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_colors (id, colors) VALUES (?, ?)",
                (uid, colors),
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert product_colors for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def store_product_youtube_url(uid: int, url:str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO youtube_url (id, url) VALUES (?, ?)",
                (uid, url),
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert youtube_url for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise



def store_youtube_thumbnail_image(uid: int, data: bytes):
    with get_connection() as conn:
        try:
            conn.execute(
                """
                INSERT OR REPLACE INTO youtube_thumbnail (id, data)
                VALUES (?, ?)
                """,
                (uid, data),
            )
            conn.commit()
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert/replace youtube_thumbnail for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise
def store_ad_image(uid: int, data: bytes):
    with get_connection() as conn:
        try:
            tag=0
            conn.execute(
                "INSERT INTO ad_banners (id, tag, data) VALUES (?, ?, ?)",
                (uid, tag, data),
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert ad_banners for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise

def store_product_description(uid: int, description: str):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO product_description (id, description) VALUES (?, ?)",
                (uid, description),
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert product_description for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def store_product_comics(uid: int, data: bytes):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT OR REPLACE INTO comics (id, data) VALUES (?, ?)",
                (uid, data),
            )
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to insert/replace comics for uid={uid}: {e}")
            traceback.print_exc()
            raise


def store_artisan_inputs(uid:int, user_id:int, product_name:str="", product_description:str="", target_audience:str="", 
    tone:str="marketing", keywords:str ="Authentic, Handmade", additional_info:str=""):
    with get_connection() as conn:
        try:
            conn.execute(
                "INSERT INTO ArtisanInputs (id, user_id, product_name, product_description, target_audience, tone, keywords, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (uid, user_id, product_name, product_description, target_audience, tone, keywords, additional_info),
            )
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to insert artiasn_inputs for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


# ---------------------------
# GET FUNCTIONS
# ---------------------------
def get_input_images(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT tag, data FROM input_image WHERE id = ? ORDER BY tag", (uid,)
            )
            rows = cursor.fetchall()
            # Convert binary data to base64 strings for JSON
            print("Rows: ", rows)
            result = []
            for tag, blob in rows:
                image = base64.b64encode(blob).decode("utf-8")

                result.append({"tag": tag, "image": image})
            return result

        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch input_image for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_output_images(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT tag, data FROM output_image WHERE id = ? ORDER BY tag", (uid,)
            )
            rows = cursor.fetchall()
            # Convert binary data to base64 strings for JSON
            print("Rows: ", rows)
            result = []
            for tag, blob in rows:
                image = base64.b64encode(blob).decode("utf-8")

                result.append({"tag": tag, "image": image})
            return result
        
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch output_image for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise
def get_recommended_price(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT price FROM pricing WHERE id = ?", (uid,))
            row = cursor.fetchone()
            return row[0] if row else None
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to fetch price for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def get_processing_metadata(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                """
                SELECT status, message, error, processing_time, created_at
                FROM processing_metadata WHERE id = ?
                """,
                (uid,),
            )
            return cursor.fetchone()
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to fetch processing_metadata for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def get_faqs(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT question, answer FROM faqs WHERE id = ?", (uid,)
            )
            return cursor.fetchall()
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to fetch faqs for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def get_story(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT story FROM story WHERE id = ?", (uid,))
            row = cursor.fetchone()
            return row[0] if row else None
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to fetch story for uid={uid} with error={e}")
            traceback.print_exc()
            raise


def get_history(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT location_specific_info, descriptive_history FROM product_history WHERE id = ?",
                (uid,),
            )
            return cursor.fetchone()
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to fetch history for uid={uid} with error={e}")
            traceback.print_exc()
            raise
def get_product_title(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT title FROM product_title WHERE id=?", (uid,))
            row = cursor.fetchone()
            if row:
                return {"id": uid, "title": row[0]}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch product_title for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_product_artist(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT artist FROM product_artist WHERE id=?", (uid,)
            )
            row = cursor.fetchone()
            if row:
                return {"id": uid, "artist": row[0]}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch product_artist for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_product_style(uid: int):
    print(f"[DEBUG] Attempting to fetch product_style for uid={uid}")
    # Use get_connection() but only for reads (no upload to GCS)
    with get_connection_readonly() as conn:
        try:
            cursor = conn.execute("SELECT style FROM product_style WHERE id=?", (uid,))
            row = cursor.fetchone()
            print(f"[DEBUG] Query result for uid={uid}: {row}")
            if row:
                result = {"id": uid, "style": row[0]}
                print(f"[DEBUG] Returning product_style: {result}")
                return result
            print(f"[DEBUG] No product_style found for uid={uid}")
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch product_style for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_product_origin(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT origin FROM product_origin WHERE id=?", (uid,)
            )
            row = cursor.fetchone()
            if row:
                return {"id": uid, "origin": row[0].strip("[]'")}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch product_origin for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_product_predicted_artist(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT predicted_artist FROM product_predicted_artist WHERE id=?",
                (uid,),
            )
            row = cursor.fetchone()
            if row:
                return {"id": uid, "predicted_artist": row[0]}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch product_predicted_artist for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_product_medium(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT medium FROM product_medium WHERE id=?", (uid,)
            )
            row = cursor.fetchone()
            if row:
                return {"id": uid, "medium": row[0]}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch product_medium for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise

def get_product_themes(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT themes FROM product_themes WHERE id=?", (uid,)
            )
            row = cursor.fetchone()
            if row:
                return {"id": uid, "themes": row[0]}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch product_themes for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise
def get_product_colors(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT colors FROM product_colors WHERE id = ?", (uid,)
            )
            row = cursor.fetchone()
            if row:
                return {"id": uid, "colors": row[0]}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch product_colors for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_video(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT tag,data FROM output_videos WHERE id = ?", (uid, ))
            rows = cursor.fetchall()
            result=[]
            
            for tag, blob in rows:
                video_base64=base64.b64encode(blob).decode("utf-8")
                result.append({"tag": tag, "video": video_base64})
            return result
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch video for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise

def get_all_products():
    """
    Get all products with basic information for listing.
    Returns a list of products with id, title, first output image, price, and rating.
    """
    with get_connection() as conn:
        try:
            # Get all product IDs from results table
            cursor = conn.execute("SELECT DISTINCT id FROM product_origin ORDER BY id DESC")
            product_ids = [row[0] for row in cursor.fetchall()]
            print("product_ids", product_ids)
            products = []
            for product_id in product_ids:
                product = {"id": product_id}
                
                # Get product title (fallback to default if not found)
                try:
                    cursor = conn.execute("SELECT style FROM product_style WHERE id = ?", (product_id,))
                    title_row = cursor.fetchone()
                    product["title"] = title_row[0] if title_row else f"Artisan Product #{product_id}"
                except sqlite3.Error:
                    product["title"] = f"Artisan Product #{product_id}"
                
                # Get first output image as header image
                try:
                    cursor = conn.execute(
                        "SELECT data FROM output_image WHERE id = ? ORDER BY tag LIMIT 1", 
                        (product_id,)
                    )
                    image_row = cursor.fetchone()
                    if image_row:
                        product["header_image"] = base64.b64encode(image_row[0]).decode("utf-8")
                    else:
                        product["header_image"] = None
                except sqlite3.Error:
                    product["header_image"] = None
                
                # Get recommended price
                try:
                    cursor = conn.execute("SELECT price FROM pricing WHERE id = ?", (product_id,))
                    price_row = cursor.fetchone()
                    product["price"] = price_row[0] if price_row else 0
                except sqlite3.Error:
                    product["price"] = 0
                
                # Set default rating
                product["rating"] = 4.8
                
                # Get additional metadata for filtering/display
                try:
                    cursor = conn.execute("SELECT predicted_artist FROM product_predicted_artist WHERE id = ?", (product_id,))
                    artist_row = cursor.fetchone()
                    product["predicted_artist"] = artist_row[0] if artist_row else None
                except sqlite3.Error:
                    product["predicted_artist"] = None
                
                try:
                    cursor = conn.execute("SELECT origin FROM product_origin WHERE id = ?", (product_id,))
                    origin_row = cursor.fetchone()
                    product["origin"] = origin_row[0] if origin_row else None
                except sqlite3.Error:
                    product["origin"] = None
                
                try:
                    cursor = conn.execute("SELECT style FROM product_style WHERE id = ?", (product_id,))
                    style_row = cursor.fetchone()
                    product["style"] = style_row[0] if style_row else None
                except sqlite3.Error:
                    product["style"] = None
                
                products.append(product)
            
            return products
            
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to fetch all products with error={e}")
            traceback.print_exc()
            raise


def get_product_youtube_url(uid:int):
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT url FROM youtube_url WHERE id=?", (uid,))
            row = cursor.fetchone()
            return row[0] if row else None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch youtube_url for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_edited_video(uid: int):
    """
    Get edited video blob from edited_videos table by UID.
    Returns the video as base64 encoded string for API consumption.
    """
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT data FROM edited_videos WHERE id = ?", (uid,))
            row = cursor.fetchone()
            if row:
                # Convert binary data to base64 string for JSON response
                video_base64 = base64.b64encode(row[0]).decode("utf-8")
                return {"id": uid, "video": video_base64}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch edited_video for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_edited_video_raw(uid: int):
    """
    Get edited video blob from edited_videos table by UID.
    Returns raw bytes for direct download/streaming.
    """
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT data FROM edited_videos WHERE id = ?", (uid,))
            row = cursor.fetchone()
            return row[0] if row else None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch edited_video_raw for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise




def get_youtube_thumbnail_image(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT data FROM youtube_thumbnail WHERE id = ?", (uid,))
            row = cursor.fetchone()
            if row:
                # Convert binary data to base64 string for JSON response
                image_base64 = base64.b64encode(row[0]).decode("utf-8")
                return {"id": uid, "image": image_base64}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch youtube_thumbnail for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_ad_banner(uid: int):
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT data FROM ad_banners WHERE id = ?", (uid,))
            row = cursor.fetchone()
            if row:
                # Convert binary data to base64 string for JSON response
                image_base64 = base64.b64encode(row[0]).decode("utf-8")
                return {"id": uid, "image": image_base64}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch ad_banners for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise

def get_comics(uid:int):
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT data FROM comics WHERE id = ?", (uid,))
            row = cursor.fetchone()
            if row:
                # Convert binary data to base64 string for JSON response
                image_base64 = base64.b64encode(row[0]).decode("utf-8")
                return {"id": uid, "image": image_base64}
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch comics for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise

def get_artisan_inputs(uid:int):
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT * FROM ArtisanInputs WHERE id = ?", (uid,))
            row = cursor.fetchone()
            if row:
                return row
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch artisan_inputs for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def get_youtube_url(uid: int):
    """Get YouTube URL for a product"""
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                "SELECT url, title, created_at FROM youtube_urls WHERE uid = ?", 
                (uid,)
            )
            row = cursor.fetchone()
            if row:
                return {
                    "url": row[0],
                    "title": row[1],
                    "created_at": row[2]
                }
            return None
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to fetch YouTube URL for uid={uid} with error={e}")
            traceback.print_exc()
            return None


def store_youtube_url(uid: int, url: str, title: str = ""):
    """Store YouTube URL for a product"""
    with get_connection() as conn:
        try:
            cursor = conn.execute(
                """INSERT OR REPLACE INTO youtube_urls (uid, url, title, created_at) 
                   VALUES (?, ?, ?, datetime('now'))""",
                (uid, url, title)
            )
            conn.commit()
            return {
                "uid": uid,
                "url": url,
                "title": title,
                "created_at": "now"
            }
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to store YouTube URL for uid={uid} with error={e}")
            traceback.print_exc()
            raise

def get_inventory(uid: int):
    """Get inventory recommendations for a product"""
    with get_connection() as conn:
        try:
            cursor = conn.execute("SELECT * FROM inventory WHERE id = ?", (uid,))
            row = cursor.fetchone()
            if row:
                import json
                
                # Parse JSON fields back to lists
                row_dict = dict(row)
                try:
                    row_dict['holidays'] = json.loads(row_dict.get('holidays', '[]'))
                    row_dict['items'] = json.loads(row_dict.get('items', '[]'))
                    row_dict['reasons'] = json.loads(row_dict.get('reasons', '[]'))
                except json.JSONDecodeError as e:
                    print(f"JSON decode error for uid={uid}: {e}")
                    # Return raw data if JSON parsing fails
                    pass
                
                return row_dict
            return None
        except sqlite3.Error as e:
            print(
                f"[DB ERROR] Failed to fetch inventory for uid={uid} with error={e}"
            )
            traceback.print_exc()
            raise


def store_inventory_recommendations(uid: int, recommendations: dict, art_forms: list[str]):
    """
    Store inventory recommendations in the database according to the new schema.
    
    Args:
        uid: Product/result ID
        recommendations: Dictionary containing recommendations from the AI model
        art_forms: List of art forms for this artisan
    """
    with get_connection() as conn:
        try:
            # Clear existing inventory recommendations for this uid
            conn.execute("DELETE FROM inventory WHERE id = ?", (uid,))
            conn.commit()
            # Prepare data for storage
            art_forms_str = ", ".join(art_forms)
            
            # Extract all holidays, items, and reasons from recommendations
            holidays = []
            all_items = []
            reasons = []
            
            for recommendation in recommendations.get("recommendations", []):
                holiday = recommendation.get("holiday", "")
                reason = recommendation.get("reason", "")
                items = recommendation.get("items", [])
                
                holidays.append(holiday)
                all_items.extend(items)
                reasons.append(reason)
            
            # Convert lists to JSON strings for storage
            import json
            holidays_json = json.dumps(holidays)
            items_json = json.dumps(all_items)
            reasons_json = json.dumps(reasons)
            
            # Store as a single row
            conn.execute(
                """INSERT INTO inventory 
                   (id, art_forms, holidays, items, reasons, style_hints) 
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (uid, art_forms_str, holidays_json, items_json, reasons_json, "")
            )
            
            conn.commit()
            
            return {
                "uid": uid,
                "stored_items": len(all_items),
                "stored_holidays": len(holidays),
                "message": "Inventory recommendations stored successfully"
            }
            
        except sqlite3.Error as e:
            print(f"[DB ERROR] Failed to store inventory recommendations for uid={uid} with error={e}")
            traceback.print_exc()
            raise