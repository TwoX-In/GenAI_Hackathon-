"""Artisan Agent package for handling the complete artisan workflow."""
from .artisan_client import ArtisanClient
import os
from dotenv import load_dotenv
load_dotenv()

# Create a default orchestrator instance for easy import
artisan_client = ArtisanClient(
    gcs_bucket="phankar",
    gcs_folder="artisan_input",
    project_id=os.getenv("GCP_CLOUD_PROJECT_ID"),
    agent_url=os.getenv("AGENT_URL"),
    timeout=600.0
)

__all__ = [
    'artisan_client'
]
