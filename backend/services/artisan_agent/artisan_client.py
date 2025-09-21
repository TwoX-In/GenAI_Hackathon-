"""Orchestrator for the complete artisan workflow."""

import logging
from fastapi import UploadFile
from .translation import TranslationService
from .image_upload import ImageUploadService
import httpx

logger = logging.getLogger(__name__)


class ArtisanClient:
    """
    Orchestrates the complete artisan workflow by coordinating multiple services.
    This is the main class that the router should use.
    """
    
    def __init__(self,
                 gcs_bucket: str,
                 gcs_folder: str,
                 project_id: str,
                 agent_url: str,
                 timeout: float):
        """
        Initialize with service dependencies.
        
        Args:
            gcs_bucket: GCS bucket name
            gcs_folder: GCS folder name
            project_id: GCP project ID
            agent_url: Base Agent API URL
            timeout: Request timeout in seconds
        """
        self.gcs_bucket = gcs_bucket
        self.gcs_folder = gcs_folder
        self.translation_service = TranslationService()
        self.image_service = ImageUploadService(project_id)
        # Base URL of the artisan-agent service
        self.agent_url = agent_url
        self.timeout = timeout
        print("agent url is", agent_url)
    
    async def generate_content(self, 
                             product_description: str, 
                             language: str, 
                             image: UploadFile, 
                             **additional_data) -> dict:
        """
        Main method to orchestrate the complete artisan workflow.
        
        This method coordinates all services:
        1. Translate product description if needed
        2. Upload image to GCS and get the GCS URI
        3. Call artisan-agent API with the product description and the GCS URI
        4. Return comprehensive response
        
        Args:
            product_description: Product description from frontend
            language: Language code from frontend (e.g., "en", "es", "fr")
            image: Uploaded image file
            **additional_data: Additional form data (artist_name, state, etc.)
        
        Returns:
            Complete response with all processing details
        """
        try:
            # Step 1: Handle translation if needed
            final_description = product_description
            translation_result = None
            
            if self.translation_service.should_translate(language):
                logger.info(f"Translation needed from {language} to English")
                translation_result = await self.translation_service.translate_text(
                    text=product_description,
                    source_language=language
                )
                final_description = translation_result["translated_text"]
            else:
                logger.info(f"No translation needed, language is {language}")
            
            # Step 2: Upload image to GCS
            logger.info("Uploading image to GCS...")
            gcs_image_uri = await self.image_service.upload_image(
                image=image,
                bucket_name=self.gcs_bucket,
                folder=self.gcs_folder
            )
            
            # Step 3: Call artisan-agent API directly
            endpoint = f"{self.agent_url.rstrip('/')}/generate"
            payload = {
                "product_description": final_description,
                "gcs_image_uri": gcs_image_uri,
            }
            logger.info(f"Calling artisan-agent API with payload: {payload}")
            logger.info(f"Using timeout: {self.timeout} seconds")

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                logger.info(f"Making POST request to: {endpoint}")
                resp = await client.post(
                    endpoint,
                    json=payload,
                    headers={"Content-Type": "application/json"},
                )
                logger.info(f"Request completed! Artisan-agent API response status: {resp.status_code}")
                logger.info(f"Artisan-agent API response headers: {dict(resp.headers)}")
                
                if resp.status_code != 200:
                    logger.error(f"Artisan-agent API error: {resp.status_code} - {resp.text}")
                    raise Exception(f"Artisan-agent API error: {resp.status_code} - {resp.text}")
                
                artisan_response = resp.json()
            
            logger.info(f"Artisan-agent API response: {artisan_response}")
            # Step 4: Prepare comprehensive response
            response = {
                "status": "success",
                "message": "Content generated successfully",
                "data": {
                    "input": {
                        "original_description": product_description,
                        "language": language,
                        "final_description": final_description,
                        **additional_data
                    },
                    "processing": {
                        "translation": translation_result,
                        "gcs_image_uri": gcs_image_uri
                    },
                    "result": artisan_response
                }
            }
            
            return response
            
        except Exception as e:
            logger.error(f"Error in generate_content: {str(e)}")
            raise e
