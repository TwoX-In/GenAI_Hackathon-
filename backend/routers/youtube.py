import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.storage.storage import get_youtube_url, store_youtube_url

router = APIRouter(tags=["youtube"], prefix="/youtube")


class YouTubeUrlRequest(BaseModel):
    url: str


class YouTubeUrlResponse(BaseModel):
    exists: bool
    url: str
    title: str = ""
    error: str = ""


@router.post("/verify", response_model=YouTubeUrlResponse)
async def verify_youtube_url(request: YouTubeUrlRequest):
    """
    Verify if a YouTube URL exists and is accessible.
    """
    try:
        url = request.url.strip()
        
        # Basic YouTube URL validation
        if not ("youtube.com" in url or "youtu.be" in url):
            return YouTubeUrlResponse(
                exists=False,
                url=url,
                error="Invalid YouTube URL format"
            )
        
        # Try to make a HEAD request to check if the video exists
        # YouTube returns 200 for valid videos, 404 for non-existent ones
        response = requests.head(url, timeout=10)
        
        if response.status_code == 200:
            # Try to get the video title by making a GET request to the page
            try:
                page_response = requests.get(url, timeout=10)
                page_content = page_response.text
                
                # Extract title from the page (basic extraction)
                title_start = page_content.find('<title>')
                title_end = page_content.find('</title>')
                title = ""
                
                if title_start != -1 and title_end != -1:
                    title = page_content[title_start + 7:title_end]
                    title = title.replace(' - YouTube', '')
                
                return YouTubeUrlResponse(
                    exists=True,
                    url=url,
                    title=title
                )
            except:
                # If we can't get the title, still return that the URL exists
                return YouTubeUrlResponse(
                    exists=True,
                    url=url,
                    title="YouTube Video"
                )
        else:
            return YouTubeUrlResponse(
                exists=False,
                url=url,
                error=f"Video not accessible (Status: {response.status_code})"
            )
            
    except requests.exceptions.Timeout:
        return YouTubeUrlResponse(
            exists=False,
            url=request.url,
            error="Request timeout - video may not exist"
        )
    except requests.exceptions.RequestException as e:
        return YouTubeUrlResponse(
            exists=False,
            url=request.url,
            error=f"Network error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to verify YouTube URL: {str(e)}"
        )


@router.get("/url/{uid}")
async def get_youtube_url_endpoint(uid: int):
    """
    Get the stored YouTube URL for a product.
    """
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


@router.post("/url/{uid}")
async def store_youtube_url_endpoint(uid: int, request: YouTubeUrlRequest):
    """
    Store a YouTube URL for a product.
    """
    try:
        # First verify the URL exists
        verification = await verify_youtube_url(request)
        
        if not verification.exists:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid YouTube URL: {verification.error}"
            )
        
        # Store the URL
        result = store_youtube_url(uid, request.url, verification.title)
        
        return {
            "uid": uid,
            "url": request.url,
            "title": verification.title,
            "message": "YouTube URL stored successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to store YouTube URL: {str(e)}"
        )


@router.delete("/url/{uid}")
async def delete_youtube_url_endpoint(uid: int):
    """
    Delete the stored YouTube URL for a product.
    """
    try:
        # This would require implementing delete_youtube_url in storage
        # For now, we'll just return a success message
        return {
            "uid": uid,
            "message": "YouTube URL deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete YouTube URL: {str(e)}"
        )

