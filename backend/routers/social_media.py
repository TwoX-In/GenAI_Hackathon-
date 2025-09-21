"""Social Media API router - Main entry point for all social media integrations."""

import base64
import io
import os
from uuid import uuid4
from fastapi import APIRouter, HTTPException, Form, UploadFile
from fastapi.responses import StreamingResponse
from typing import List, Optional
from services.social_media.social_media import YoutubeClient
from services.social_media.youtube.editor import thumbnail_maker
from services.social_media.youtube.editor.video_processor import process_video_with_marketing_audio
# from services.social_media.instagram.apis import posts as ig_posts, reels as ig_reels, stories as ig_stories, media as ig_media, utils as ig_utils
from pydantic import BaseModel
import logging
from services.social_media.comics import comic
from typing import List, Optional, Dict




from services.storage import storage



from services.social_media.advert_banners.BannerMaker import maker,ProductSpec,BannerSpec
from services.social_media.email import email


logger = logging.getLogger(__name__)

# Main social media router
router = APIRouter(prefix="/social_media", tags=["Social Media"])





@router.post("/generate-email/{uid}")
def generate_email(uid: int = uuid4().int & ((1 << 32) - 1)):
    return email.generate_emails(uid)

@router.get("/get-email/{uid}")
def get_email(uid: int):
    """Retrieve generated email HTML by UID"""
    try:
        email_html = email.generate_emails(uid)
        return {
            "success": True,
            "uid": uid,
            "email_html": email_html
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve email for UID {uid}: {str(e)}"
        )

@router.get("/get-email-images/{uid}")
def get_email_images(uid: int):
    """Get product images for email without causing header size issues"""
    try:
        from services.storage import storage
        fetched_images = storage.get_output_images(uid)
        just_images = []
        for image in fetched_images:
            just_images.append(image["image"])
        
        # Return only the first 3 images to keep response size manageable
        return {
            "success": True,
            "uid": uid,
            "images": just_images[:3]
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve images for UID {uid}: {str(e)}"
        )

# Email models
class SendEmailRequest(BaseModel):
    to_emails: List[str]
    subject: str
    body: str
    is_html: bool = False
    cc_emails: Optional[List[str]] = None
    bcc_emails: Optional[List[str]] = None
    template_vars: Optional[Dict[str, str]] = None

class EmailListRequest(BaseModel):
    emails: List[str]
import httpx
from dotenv import load_dotenv
load_dotenv()

@router.post("/send")
async def send_email(request: SendEmailRequest):
    """Send email using another service"""
    try:
        url = os.getenv("GCP_EMAIL_BOT_URL") + "/email/send"
        logger.info(f"Forwarding email request to: {url}")

        async with httpx.AsyncClient(timeout=600) as client:
            resp = await client.post(url, json=request.dict())

        # Handle non-200 response
        if resp.status_code != 200:
            raise HTTPException(
                status_code=resp.status_code,
                detail=f"Remote service error: {resp.text}",
            )

        result = resp.json()

        return {
            "success": True,
            "message": f"Email sent to {len(request.to_emails)} recipients",
            "recipients": request.to_emails,
            "subject": request.subject,
            "remote_result": result,  # include response from email service
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")



@router.get("/email-lists")
async def get_email_lists():
    """Get stored email lists"""
    try:
        # For now, return sample data - in production, fetch from database
        sample_emails = [
            "customer1@example.com",
            "customer2@example.com", 
            "customer3@example.com",
            "subscriber@example.com",
            "buyer@example.com"
        ]
        return {
            "success": True,
            "emails": sample_emails
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve email lists: {str(e)}"
        )

@router.post("/email-lists")
async def store_email_list(request: EmailListRequest):
    """Store email list"""
    try:
        # For now, just return success - in production, store in database
        return {
            "success": True,
            "message": f"Stored {len(request.emails)} emails",
            "emails": request.emails
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to store email list: {str(e)}"
        )








@router.post("/ad-banner-maker")
def ad_banner_maker(uid: int = uuid4().int & ((1 << 32) - 1)):
    if storage.get_ad_banner(uid) is not None:
        return storage.get_ad_banner(uid)["image"]
    title=storage.get_product_style(uid)["style"] + " by " + storage.get_product_predicted_artist(uid)["predicted_artist"]
    description=storage.get_history(uid)[1]

    if storage.get_artisan_inputs(uid) is not None:
        description+=storage.get_artisan_inputs(uid)["product_description"]

    price=storage.get_recommended_price(uid)
    if price is None:
        raise HTTPException(status_code=404, detail="Price not found")
    
    product_bytes = base64.b64decode(storage.get_input_images(uid)[0]["image"])
    if product_bytes is None:
        raise HTTPException(status_code=404, detail="Product image not found")
    
    
    
    product = ProductSpec(
        id=str(uid),
        title=title,
        description=description,
        price=str(price),
        currency="₹",
       product_image_bytes=product_bytes,
    )

    spec = BannerSpec(size=(1200, 628))

    # Generate with prompt + product image
    banner = maker.generate_banner_for_product(
        product,
        spec,
        )

    buf = io.BytesIO()
    banner.save(buf, format="PNG")
    buf.seek(0)
    storage.store_ad_image(uid,buf.getvalue())
    return StreamingResponse(buf, media_type="image/png")


@router.post(
    "/youtube/thumbnail-nanobananas-maker",
    responses={
        200: {
            "content": {"application/json": {}},
            "description": "Generated YouTube thumbnail as Base64 PNG (for Swagger inline view)",
        }
    },
)
def nanobananas_thumbnail_maker(uid: int = uuid4().int & ((1 << 32) - 1)):
    logger.info(f"[ThumbnailMaker] Starting thumbnail generation for uid={uid}")

    # title
    try:
        style = storage.get_product_style(uid)["style"]
        predicted_artist = storage.get_product_predicted_artist(uid)["predicted_artist"]
        title = style + " by " + predicted_artist
        logger.info(f"[ThumbnailMaker] Title built: {title}")
    except Exception as e:
        logger.error(
            f"[ThumbnailMaker] Failed to fetch style/artist for uid={uid}: {e}"
        )
        raise

    # description
    try:
        description = storage.get_history(uid)[1]
        artisan_inputs = storage.get_artisan_inputs(uid)
        if artisan_inputs:
            description += artisan_inputs["product_description"]
        logger.info(f"[ThumbnailMaker] Description built (len={len(description)}).")
    except Exception as e:
        logger.error(f"[ThumbnailMaker] Failed to build description for uid={uid}: {e}")
        raise

    # price
    price = storage.get_recommended_price(uid)
    if price is None:
        logger.error(f"[ThumbnailMaker] Price not found for uid={uid}")
        raise HTTPException(status_code=404, detail="Price not found")
    logger.info(f"[ThumbnailMaker] Price fetched: {price}")

    # product image
    try:
        image_entry = storage.get_input_images(uid)[0]
        product_bytes = base64.b64decode(image_entry["image"])
        if not product_bytes:
            logger.error(f"[ThumbnailMaker] Empty product image bytes for uid={uid}")
            raise HTTPException(status_code=404, detail="Product image not found")
        logger.info(
            f"[ThumbnailMaker] Product image decoded (size={len(product_bytes)} bytes)."
        )
    except Exception as e:
        logger.error(
            f"[ThumbnailMaker] Failed to fetch/decode product image for uid={uid}: {e}"
        )
        raise

    # build product spec
    product = ProductSpec(
        id=str(uid),
        title=title,
        description=description,
        price=str(price),
        currency="₹",
        product_image_bytes=product_bytes,
    )
    logger.info(f"[ThumbnailMaker] ProductSpec created: {product}")

    # generate thumbnail
    try:
        banner = maker.generate_thumbnail_for_product(product)
        logger.info(f"[ThumbnailMaker] Banner generated successfully.")
    except Exception as e:
        logger.error(f"[ThumbnailMaker] Thumbnail generation failed for uid={uid}: {e}")
        raise

    # save image to buffer
    try:
        buf = io.BytesIO()
        banner.save(buf, format="PNG")
        buf.seek(0)
        storage.store_youtube_thumbnail_image(uid, buf.getvalue())
        logger.info(
            f"[ThumbnailMaker] Thumbnail stored in storage for uid={uid}, size={buf.tell()} bytes."
        )
        buf.seek(0)
    except Exception as e:
        logger.error(
            f"[ThumbnailMaker] Failed to save/store thumbnail for uid={uid}: {e}"
        )
        raise

    return buf
@router.post("/comics")
def create_comic(uid: int = uuid4().int & ((1 << 32) - 1)):
    try:
        # if storage.get_comics(uid) is not None:
        #     return storage.get_comics(uid)
        title = (
            storage.get_product_style(uid)["style"]
            + " by "
            + storage.get_product_predicted_artist(uid)["predicted_artist"]
        )
        description = storage.get_history(uid)[1]
        if storage.get_artisan_inputs(uid) is not None:
            description+=storage.get_artisan_inputs(uid)["product_description"]
    
        # Generate the comic
        img_buffer = comic.create_product_comic(
            product_name=title, product_description=description
        )

        # Reset buffer position to beginning
        img_buffer.seek(0)
        storage.store_product_comics(uid,img_buffer.getvalue())

        img_buffer.seek(0)
        # Return as streaming response with proper headers
        return StreamingResponse(
            io.BytesIO(img_buffer.read()),
            media_type="image/png",
            headers={"Content-Disposition": f"inline; filename=comic_{uid}.png"},
        )

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate comic: {str(e)}"
        )


# YouTube client
ytClient = YoutubeClient("xyz")

# ===== YOUTUBE ENDPOINTS =====

@router.post("/upload_video")
async def upload_video(uid: int = uuid4().int & ((1 << 32) - 1)):
    """Upload video to YouTube"""
    

    return await ytClient.upload_video(uid)

@router.get("/youtube_status/{uid}")
async def get_youtube_status(uid: int = uuid4().int & ((1 << 32) - 1)):
    """Check if a video is already uploaded to YouTube"""
    from services.storage.storage import get_product_youtube_url
    url = get_product_youtube_url(uid)
    return {"uploaded": bool(url), "url": url}

@router.post("/video_thumbnail")
async def generate_thumbnail(file: UploadFile, description: str = Form(...)):
    """Generate video thumbnail"""
    return await thumbnail_maker.generate_thumbnail(file, description)

@router.post("/process_video_with_audio")
async def process_video_with_audio_endpoint(uid: int = uuid4().int & ((1 << 32) - 1)):
    """
    Process a video by:
    1. Removing existing audio
    2. Adding marketing narration based on product story
    3. Extending video to match audio length
    4. Saving final video to edited_videos table
    """
    try:
        logger.info(f"Starting video processing for uid: {uid}")
        
        success = await process_video_with_marketing_audio(uid)
        
        if success:
            return {
                "status": "success",
                "message": f"Video processed successfully for uid: {uid}",
                "uid": uid
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to process video. Check logs for details."
            )
            
    except Exception as e:
        logger.error(f"Error in video processing endpoint: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Video processing failed: {str(e)}"
        )

# Pydantic models for request bodies
class MediaItem(BaseModel):
    type: str  # "IMAGE" or "VIDEO"
    url: str

class CarouselRequest(BaseModel):
    media_items: List[MediaItem]
    caption: str = ""

class ImagePostRequest(BaseModel):
    image_url: str
    caption: str = ""

class VideoPostRequest(BaseModel):
    video_url: str
    caption: str = ""
    thumbnail_url: Optional[str] = None

class StoryRequest(BaseModel):
    media_url: str
    media_type: str = "IMAGE"  # "IMAGE" or "VIDEO"

class ReelRequest(BaseModel):
    video_url: str
    caption: str = ""
    cover_url: Optional[str] = None

# ===== MAIN SOCIAL MEDIA ENDPOINTS =====

@router.get("/")
async def get_supported_platforms():
    """Get list of supported social media platforms."""
    return {
        "supported_platforms": [
            {
                "name": "youtube",
                "prefix": "/social-media/youtube",
                "features": ["posts", "stories", "reels", "carousels"],
                "status": "active"
            }
        ]
    }

@router.get("/status")
async def get_social_media_status():
    """Get overall status of social media integrations."""
    return {
        "status": "operational",
        "platforms": {
            "youtube": "active",
            "facebook": "coming_soon",
            "twitter": "coming_soon",
            "tiktok": "coming_soon"
        },
        "total_platforms": 1,
        "active_platforms": 1
    }

# # ===== INSTAGRAM SERVICE ENDPOINTS =====

# @router.get("/instagram")
# async def get_instagram_service_status():
#     """Get Instagram service status and capabilities."""
#     try:
#         return {
#             "service": "Instagram API",
#             "status": "active",
#             "features": [
#                 "Image Posts",
#                 "Video Posts (as Reels)", 
#                 "Stories",
#                 "Reels",
#                 "Carousel Posts",
#                 "Media Retrieval"
#             ],
#             "endpoints": {
#                 "post_image": "/social-media/instagram/post/image",
#                 "post_video": "/social-media/instagram/post/video", 
#                 "create_story": "/social-media/instagram/story",
#                 "create_reel": "/social-media/instagram/reel",
#                 "create_carousel": "/social-media/instagram/post/carousel",
#                 "get_media": "/social-media/instagram/media"
#             },
#             "credentials_configured": bool(os.getenv("FB_PAGE_ACCESS_TOKEN") and os.getenv("IG_BUSINESS_ACCOUNT_ID"))
#         }
#     except Exception as e:
#         return {
#             "service": "Instagram API",
#             "status": "error", 
#             "error": str(e),
#             "credentials_configured": False
#         }

# # ===== INSTAGRAM POSTS =====

# @router.post("/instagram/post/image")
# async def create_image_post(request: ImagePostRequest):
#     """Create and publish an Instagram image post."""
#     try:
#         result = await ig_posts.create_image_post(
#             image_url=request.image_url,
#             caption=request.caption
#         )
        
#         if result["status"] == "success":
#             return {
#                 "success": True,
#                 "message": "Image post created successfully",
#                 "post_id": result["post_id"],
#                 "url": result.get("url")
#             }
#         else:
#             raise HTTPException(status_code=400, detail=result["error"])
            
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create image post: {str(e)}")

# @router.post("/instagram/post/video")
# async def create_video_post(request: VideoPostRequest):
#     """Create and publish an Instagram video post (as Reel)."""
#     try:
#         result = await ig_reels.create_reel(
#             video_url=request.video_url,
#             caption=request.caption,
#             cover_url=request.thumbnail_url
#         )
        
#         if result["status"] == "success":
#             return {
#                 "success": True,
#                 "message": "Video post created successfully (as Reel)",
#                 "post_id": result["post_id"],
#                 "url": result.get("url")
#             }
#         else:
#             raise HTTPException(status_code=400, detail=result["error"])
            
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create video post: {str(e)}")

# @router.post("/instagram/post/carousel")
# async def create_carousel_post(request: CarouselRequest):
#     """Create and publish an Instagram carousel post."""
#     try:
#         media_items = [
#             {"type": item.type, "url": item.url} 
#             for item in request.media_items
#         ]
#         result = await ig_posts.create_carousel_post(media_items=media_items, caption=request.caption)
        
#         if result["status"] == "success":
#             return {
#                 "success": True,
#                 "message": "Carousel post created successfully",
#                 "post_id": result["post_id"],
#                 "url": result.get("url")
#             }
#         else:
#             raise HTTPException(status_code=400, detail=result["error"])
            
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create carousel post: {str(e)}")

# # ===== INSTAGRAM STORIES =====

# @router.post("/instagram/story")
# async def create_story(request: StoryRequest):
#     """Create and publish an Instagram story."""
#     try:
#         result = await ig_stories.create_story(media_url=request.media_url, media_type=request.media_type)
        
#         if result["status"] == "success":
#             return {
#                 "success": True,
#                 "message": "Story created successfully",
#                 "story_id": result["post_id"]
#             }
#         else:
#             raise HTTPException(status_code=400, detail=result["error"])
            
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create story: {str(e)}")

# # ===== INSTAGRAM REELS =====

# @router.post("/instagram/reel")
# async def create_reel(request: ReelRequest):
#     """Create and publish an Instagram Reel."""
#     try:
#         result = await ig_reels.create_reel(video_url=request.video_url, caption=request.caption, cover_url=request.cover_url)
        
#         if result["status"] == "success":
#             return {
#                 "success": True,
#                 "message": "Reel created successfully",
#                 "reel_id": result["post_id"],
#                 "url": result.get("url")
#             }
#         else:
#             raise HTTPException(status_code=400, detail=result["error"])
            
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to create reel: {str(e)}")

# # ===== INSTAGRAM MEDIA MANAGEMENT =====

# @router.get("/instagram/media")
# async def get_instagram_media(limit: int = 25):
#     """Get recent Instagram media posts."""
#     try:
#         result = await ig_media.get_account_media(limit=limit)
        
#         if result["status"] == "success":
#             return {
#                 "success": True,
#                 "media_count": len(result["media"]),
#                 "media": result["media"]
#             }
#         else:
#             raise HTTPException(status_code=400, detail=result["error"])
            
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to get media: {str(e)}")

# @router.get("/instagram/media/{media_id}")
# async def get_media_info(media_id: str):
#     """Get information about a specific Instagram media."""
#     try:
#         result = await ig_media.get_media_info(media_id)
        
#         if result["status"] == "success":
#             return {
#                 "success": True,
#                 "media": result["media"]
#             }
#         else:
#             raise HTTPException(status_code=400, detail=result["error"])
            
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to get media info: {str(e)}")

# # ===== INSTAGRAM UTILITIES =====

# @router.post("/instagram/validate-url")
# async def validate_media_url(media_url: str = Form(...), media_type: str = Form(default="IMAGE")):
#     """Validate if a media URL is accessible and meets Instagram requirements."""
#     try:
#         result = await ig_utils.validate_media_url(media_url, media_type)
        
#         return {
#             "success": result["valid"],
#             "validation_result": result
#         }
            
#     except HTTPException as e:
#         raise e
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Failed to validate URL: {str(e)}")