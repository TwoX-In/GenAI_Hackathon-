from uuid import uuid4
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import io
from services.storage.storage import (
    get_comics,
    get_input_images,
    get_output_images,
    get_recommended_price,
    get_processing_metadata,
    get_faqs,
    get_story,
    get_history,
    parse_response,
    store_recommended_prices,
    get_product_title,
    get_product_artist,
    get_product_style,
    get_product_origin,
    get_product_predicted_artist,
    get_product_medium,
    get_product_themes,
    get_product_colors,
    get_all_products, 
    get_video,
    get_edited_video,
    get_edited_video_raw,
    get_ad_banner,
    get_youtube_thumbnail_image,
    get_youtube_url,
    store_youtube_url,
    store_videos,
    get_inventory,
    store_inventory_recommendations
)

router = APIRouter(tags=["storage"], prefix="/storage")


# --- Existing ---
@router.post("/parse_response")
async def parse_response_endpoint(id:int, response: dict):
    return parse_response(id, response)


@router.post("/post/price")
async def post_price_endpoint(uid: int = uuid4().int & ((1 << 32) - 1), price: float=0.0):
    store_recommended_prices(uid, price)
    return {"uid": uid, "price": price}

# --- Input Images ---
@router.get("/input_images/{uid}")
async def get_input_images_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    rows = get_input_images(uid)
    if not rows:
        raise HTTPException(status_code=404, detail="No input images found")
    result=[]
    for row in rows:    
        result.append({"tag": row['tag'], "image": row['image']})
    return result

# --- Output Images ---
@router.get("/output_images/{uid}")
async def get_output_images_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    rows = get_output_images(uid)
    if not rows:
        raise HTTPException(status_code=404, detail="No output images found")
    result = []
    for row in rows:
        result.append({"tag": row["tag"], "image": row["image"]})
    return result


# --- Recommended Price ---
@router.get("/recommended_price/{uid}")
async def get_recommended_price_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    price = get_recommended_price(uid)
    if price is None:
        raise HTTPException(status_code=404, detail="Price not found")
    return {"uid": uid, "price": price}


# --- Processing Metadata ---
@router.get("/processing_metadata/{uid}")
async def get_processing_metadata_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_processing_metadata(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Metadata not found")

    status, message, error, processing_time, created_at = row
    return {
        "status": status,
        "message": message,
        "error": error,
        "processing_time": processing_time,
        "created_at": created_at,
    }


# --- FAQs ---
@router.get("/faqs/{uid}")
async def get_faqs_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    rows = get_faqs(uid)
    if not rows:
        raise HTTPException(status_code=404, detail="No FAQs found")
    return [{"question": q, "answer": a} for q, a in rows]


# --- Story ---
@router.get("/story/{uid}")
async def get_story_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    story = get_story(uid)
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    return {"uid": uid, "story": story}


# --- Product History ---
@router.get("/history/{uid}")
async def get_history_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_history(uid)
    if not row:
        raise HTTPException(status_code=404, detail="History not found")

    location_specific_info, descriptive_history = row
    return {
        "uid": uid,
        "location_specific_info": location_specific_info,
        "descriptive_history": descriptive_history,
    }


@router.get("/title/{uid}")
async def get_product_title_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_product_title(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Product title not found")
    return row


@router.get("/artist/{uid}")
async def get_product_artist_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_product_artist(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Product artist not found")
    return row


@router.get("/style/{uid}")
async def get_product_style_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_product_style(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Product style not found")
    return row


@router.get("/origin/{uid}")
async def get_product_origin_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_product_origin(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Product origin not found")
    return row


@router.get("/predicted_artist/{uid}")
async def get_product_predicted_artist_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_product_predicted_artist(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Predicted artist not found")
    return row


@router.get("/medium/{uid}")
async def get_product_medium_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_product_medium(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Product medium not found")
    return row


@router.get("/themes/{uid}")
async def get_product_themes_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_product_themes(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Product themes not found")
    return row

@router.get("/colors/{uid}")
async def get_product_colors_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_product_colors(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Product colors not found")
    return row

@router.get("/video/{uid}")
async def get_video_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_video(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Video not found")
    return row


@router.get("/products")
async def get_all_products_endpoint():
    """
    Get all products with basic information for product listing.
    Returns products with id, title, header image, price, rating, and metadata.
    """
    try:
        products = get_all_products()
        return {
            "status": "success",
            "count": len(products),
            "products": products
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch products: {str(e)}")




@router.post("/video")
async def store_video_endpoint(uid: int = uuid4().int & ((1 << 32) - 1), video_uris: list[str]=[]):
    row = store_videos(uid, video_uris)
    if not row:
        raise HTTPException(status_code=404, detail="Video not found")
    return row


@router.get("/edited_video/{uid}")
async def get_edited_video_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    """
    Get edited video by UID as base64 encoded JSON response.
    Suitable for web applications that need to embed video data.
    """
    try:
        video_data = get_edited_video(uid)
        if not video_data:
            raise HTTPException(status_code=404, detail="Edited video not found")
        return video_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch edited video: {str(e)}")


@router.get("/edited_video/{uid}/download")
async def download_edited_video_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    """
    Download edited video by UID as raw video file.
    Returns video as streaming response for direct download.
    """
    try:
        video_bytes = get_edited_video_raw(uid)
        if not video_bytes:
            raise HTTPException(status_code=404, detail="Edited video not found")
        
        # Create streaming response for video download
        video_stream = io.BytesIO(video_bytes)
        
        return StreamingResponse(
            video_stream,
            media_type="video/mp4",
            headers={
                "Content-Disposition": f"attachment; filename=edited_video_{uid}.mp4",
                "Content-Length": str(len(video_bytes))
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to download edited video: {str(e)}")
    

@router.get("/traditional_ad_banner/{uid}")
async def get_traditional_ad_banner_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_ad_banner(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Traditional ad banner not found")
    return row

@router.get("/youtube_thumbnail_banner/{uid}")
async def get_youtube_thumbnail_banner_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_youtube_thumbnail_image(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Youtube thumbnail banner not found")
    return row

@router.get("/comics/{uid}")
async def get_comics_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    row = get_comics(uid)
    if not row:
        raise HTTPException(status_code=404, detail="Comics not found")
    return row


@router.get("/youtube_url/{uid}")
async def get_youtube_url_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    """Get YouTube URL for a product"""
    try:
        url_data = get_youtube_url(uid)
        if not url_data:
            raise HTTPException(status_code=404, detail="YouTube URL not found")
        
        return {
            "uid": uid,
            "url": url_data["url"],
            "title": url_data.get("title", ""),
            "created_at": url_data.get("created_at")
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch YouTube URL: {str(e)}"
        )


@router.post("/youtube_url/{uid}")
async def store_youtube_url_endpoint(uid: int = uuid4().int & ((1 << 32) - 1), url: str="", title: str = ""):
    """Store YouTube URL for a product"""
    try:
        store_youtube_url(uid, url, title)
        return {
            "uid": uid,
            "url": url,
            "title": title,
            "message": "YouTube URL stored successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to store YouTube URL: {str(e)}"
        )


@router.get("/inventory/{uid}")
async def get_inventory_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    """Get stored inventory recommendations for a product"""
    try:
        inventory_data = get_inventory(uid)
        if not inventory_data:
            raise HTTPException(status_code=404, detail="No inventory recommendations found")
        
        return {
            "uid": uid,
            "inventory": inventory_data,
            "total_items": len(inventory_data.get('items', [])) if inventory_data else 0
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch inventory recommendations: {str(e)}"
        )


@router.post("/inventory/{uid}")
async def store_inventory_endpoint(uid: int = uuid4().int & ((1 << 32) - 1), recommendations: dict={}, art_forms: list[str]=[]):
    """Store inventory recommendations for a product"""
    try:
        result = store_inventory_recommendations(uid, recommendations, art_forms)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to store inventory recommendations: {str(e)}"
        )