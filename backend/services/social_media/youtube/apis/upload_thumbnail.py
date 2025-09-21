#!/usr/bin/python

import os
import httplib2
from dotenv import load_dotenv
import os

load_dotenv()
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
# from oauth2client.client import flow_from_clientsecrets
# from oauth2client.file import Storage
# from oauth2client.tools import run_flow
# from googleapiclient.discovery import build
# from googleapiclient.errors import HttpError
# from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
# from google_auth_oauthlib.flow import InstalledAppFlow
# Explicitly tell the underlying HTTP transport library not to retry
httplib2.RETRIES = 1
from dotenv import load_dotenv
import os

load_dotenv()
MAX_RETRIES = 10
RETRIABLE_EXCEPTIONS = (
    httplib2.HttpLib2Error, IOError,
)
RETRIABLE_STATUS_CODES = [500, 502, 503, 504]

CLIENT_SECRETS_FILE = os.getenv("YOUTUBE_CLIENT_SECRET")
SCOPES = ["https://www.googleapis.com/auth/youtube.upload"]
API_SERVICE_NAME = "youtube"
API_VERSION = "v3"

VALID_PRIVACY_STATUSES = ("public", "private", "unlisted")


TOKEN_FILE = os.getenv("YOUTUBE_TOKEN")


def get_authenticated_service():
    """Authenticate with YouTube API, reusing token.json if available."""
    creds = None

    # Load existing token if it exists
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # If no valid credentials, do OAuth flow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, SCOPES
            )
            creds = flow.run_local_server(port=0)

        # Save the new token for future runs
        with open(TOKEN_FILE, "w") as token:
            token.write(creds.to_json())

    return build(API_SERVICE_NAME, API_VERSION, credentials=creds)

def upload_thumbnail(video_id: str, file_path: str):
    """
    Upload a custom thumbnail for a given YouTube video.

    Args:
        video_id (str): ID of the YouTube video.
        file_path (str): Path to the thumbnail image file.

    Returns:
        dict: API response from YouTube.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Thumbnail file not found: {file_path}")

    youtube = get_authenticated_service()

    try:
        response = youtube.thumbnails().set(
            videoId=video_id,
            media_body=file_path,
        ).execute()

        print("✅ Thumbnail successfully set.")
        return response
    except HttpError as e:
        raise RuntimeError(
            f"❌ An HTTP error {e.resp.status} occurred:\n{e.content}"
        )
