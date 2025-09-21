"""Image upload service for Google Cloud Storage."""

import logging
from fastapi import UploadFile
from image.image_upload.image_uploading import upload_to_gcs

logger = logging.getLogger(__name__)


class ImageUploadService:
    """Service for handling image uploads to Google Cloud Storage."""
    
    def __init__(self, project_id: str):
        self.project_id = project_id
    
    async def upload_image(self, image: UploadFile, bucket_name: str, folder: str) -> str:
        """
        Upload image to GCS using existing upload function.
        
        Args:
            image: FastAPI UploadFile object
            bucket_name: GCS bucket name
            folder: Folder within the bucket
        
        Returns:
            GCS URI string
        """
        try:
            logger.info(f"Uploading image to GCS: {image.filename}")
            
            gcs_uri = await upload_to_gcs(
                project_id=self.project_id,
                bucket_name=bucket_name,
                image=image,
                folder=folder
            )
            
            logger.info(f"Image uploaded successfully: {gcs_uri}")
            return gcs_uri
            
        except Exception as e:
            logger.error(f"Error uploading image to GCS: {str(e)}")
            raise e
