import sqlite3
import os
import tempfile
from pathlib import Path
from google.cloud import storage
import json

# Use Cloud Storage for database persistence
BUCKET_NAME = "phankar"
DB_BLOB_NAME = "artisan_database/app.db"

def get_db_path():
    """Get the local database path, downloading from GCS if needed."""
    local_path = Path(tempfile.gettempdir()) / "app.db"
    
    # Download database from Cloud Storage if it exists
    try:
        service_account_key = os.getenv("GCP_SA_KEY")
        
        if service_account_key and service_account_key.startswith('{'):
            # It's JSON content, parse it directly
            credentials_info = json.loads(service_account_key)
            client = storage.Client.from_service_account_info(credentials_info)
        else:
            # Use default credentials
            client = storage.Client()
        
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(DB_BLOB_NAME)
        
        if blob.exists():
            print("Downloading database from Cloud Storage...")
            blob.download_to_filename(local_path)
            print(f"Database downloaded to {local_path}")
        else:
            print("No existing database found in Cloud Storage, creating new one...")
            
    except Exception as e:
        print(f"Could not download database from Cloud Storage: {e}")
        print("Creating new local database...")
    
    return local_path

def upload_db_to_gcs():
    """Upload the local database to Cloud Storage."""
    try:
        local_path = get_db_path()
        if not local_path.exists():
            return
            
        service_account_key = os.getenv("GCP_SA_KEY")
        
        if service_account_key and service_account_key.startswith('{'):
            credentials_info = json.loads(service_account_key)
            client = storage.Client.from_service_account_info(credentials_info)
        else:
            client = storage.Client()
        
        bucket = client.bucket(BUCKET_NAME)
        blob = bucket.blob(DB_BLOB_NAME)
        
        print("Uploading database to Cloud Storage...")
        blob.upload_from_filename(local_path)
        print("Database uploaded successfully")
        
    except Exception as e:
        print(f"Could not upload database to Cloud Storage: {e}")

def get_connection():
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row  # optional: return dict-like rows
    return conn


async def init_db():
    # Get the database path (downloads from GCS if exists)
    db_path = get_db_path()
    
    # Check if database needs initialization (doesn't exist or is empty)
    needs_init = False
    
    if not db_path.exists():
        needs_init = True
    else:
        # Check if database is empty or has no tables
        try:
            with get_connection() as conn:
                cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
                tables = cursor.fetchall()
                if len(tables) == 0:
                    needs_init = True
        except sqlite3.Error:
            needs_init = True
    
    if needs_init:
        with get_connection() as conn:
            with open(Path(__file__).parent / "schema.sql") as f:
                conn.executescript(f.read())
        print("Database initialized.")
        # Upload the newly created database to GCS
        upload_db_to_gcs()
    else:
        with get_connection() as conn:
            with open(Path(__file__).parent / "schema.sql") as f:
                conn.executescript(f.read())
        print("Database already exists with tables.")