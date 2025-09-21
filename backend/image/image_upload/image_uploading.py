from google.cloud import storage
from fastapi import UploadFile
from typing import Optional
import uuid
import os

async def upload_to_gcs(
    project_id: str,
    bucket_name: str,
    image: UploadFile,
    folder: str = "",
    destination_blob: Optional[str] = None,
) -> str:
    """
    Uploads an UploadFile to GCS using the Python client library and returns the gs:// URI.

    Args:
        project_id (str): Your GCP project ID (for client initialization).
        bucket_name (str): Name of the GCS bucket.
        image (UploadFile): File uploaded via FastAPI.
        folder (str): Optional folder path inside the bucket.

    Returns:
        str: gs:// URI of the uploaded file.
    """
    try:
        # Initialize GCS client
        # Get the service account key - could be a file path or JSON content
        service_account_key = os.getenv("GCP_SA_KEY")
        
        if service_account_key and service_account_key.startswith('{'):
            # It's JSON content, parse it directly
            import json
            credentials_info = json.loads(service_account_key)
            client = storage.Client.from_service_account_info(credentials_info, project=project_id)
        else:
            # Use default credentials or file path
            client = storage.Client(project=project_id)
        
        bucket = client.bucket(bucket_name)
        
        # Determine blob path
        if destination_blob:
            # Backward compatibility: allow callers to provide exact blob path
            blob_path = destination_blob.lstrip("/")
        else:
            # Generate unique filename with optional folder
            unique_id = str(uuid.uuid4())
            unique_filename = f"{unique_id}_{image.filename}"
            blob_path = f"{folder.rstrip('/')}/{unique_filename}" if folder else unique_filename
        blob = bucket.blob(blob_path)
        
        # Read image content asynchronously
        image_content = await image.read()
        
        # Reset image file position for subsequent reads
        await image.seek(0)

        # Log image details
        print(f"Image details - Filename: {image.filename}")
        print(f"Image details - Content Type: {image.content_type}")
        print(f"Image details - Byte size: {len(image_content)} bytes")
        print(f"Image details - Size in MB: {len(image_content) / (1024 * 1024):.2f} MB")
        
        # Determine content type based on file extension if not provided
        content_type = image.content_type
        if not content_type and image.filename:
            if image.filename.lower().endswith('.webp'):
                content_type = 'image/webp'
            elif image.filename.lower().endswith('.png'):
                content_type = 'image/png'
            elif image.filename.lower().endswith('.jpg') or image.filename.lower().endswith('.jpeg'):
                content_type = 'image/jpeg'
            else:
                content_type = 'image/jpeg'  # Default fallback
        
        print(f"Using content type: {content_type}")
        
        # Upload to GCS
        blob.upload_from_string(
            image_content,
            content_type=content_type
        )
        
        # Return GCS URI
        gcs_uri = f"gs://{bucket_name}/{blob_path}"
        print(f"Image uploaded successfully: {gcs_uri}")
        
        return gcs_uri
        
    except Exception as e:
        print(f"Error uploading image to GCS: {str(e)}")
        raise RuntimeError(f"Upload failed: {e}")
