from fastapi import APIRouter, UploadFile
from fastapi.params import File
from image.image_upload.image_uploading import upload_to_gcs
from uuid import uuid4

router = APIRouter(prefix="/image")


@router.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    """
    Simple image upload endpoint that uploads to GCS and returns the URI.
    """
    try:
        # Upload to GCS
        gcs_uri = await upload_to_gcs(
            project_id="artisan-image-gen",
            bucket_name="artisans-text-gen",
            image=image,
            destination_blob=f"uploads/{uuid4()}_{image.filename}"
        )
        
        return {
            "status": "success",
            "message": "Image uploaded successfully",
            "gcs_uri": gcs_uri
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Upload failed: {str(e)}"
        }    

