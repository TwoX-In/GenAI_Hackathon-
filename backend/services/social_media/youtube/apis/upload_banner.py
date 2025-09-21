#!/usr/bin/python3
"""
YouTube Banner Uploader (function-based version).

Functions:
- get_authenticated_service() → returns YouTube API client
- upload_banner(youtube, file_path) → uploads banner and sets it for the channel
"""

import os
import random
import sys
import time
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow

# OAuth configuration
CLIENT_SECRETS_FILE = os.getenv(
    "YOUTUBE_CLIENT_SECRET"
)
SCOPES = ["https://www.googleapis.com/auth/youtube"]
API_SERVICE_NAME = "youtube"
API_VERSION = "v3"

# Retry config
MAX_RETRIES = 10
RETRIABLE_STATUS_CODES = [500, 502, 503, 504]


def get_authenticated_service():
    """Authenticate and return a YouTube API client."""
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
    credentials = flow.run_console()
    return build(API_SERVICE_NAME, API_VERSION, credentials=credentials)


def resumable_upload(insert_request):
    """Helper to upload the banner with retries."""
    response = None
    error = None
    retry = 0

    while response is None:
        try:
            print("Uploading file...")
            status, response = insert_request.next_chunk()
            if response and "url" in response:
                print(f"Banner was successfully uploaded to: {response['url']}")
            else:
                sys.exit(f"Unexpected response: {response}")
        except HttpError as e:
            if e.resp.status in RETRIABLE_STATUS_CODES:
                error = f"Retriable HTTP error {e.resp.status}: {e.content}"
            else:
                raise
        except Exception as e:
            error = f"Retriable error: {e}"

        if error is not None:
            print(error)
            retry += 1
            if retry > MAX_RETRIES:
                sys.exit("No longer attempting to retry upload.")
            sleep_seconds = random.random() * (2 ** retry)
            print(f"Sleeping {sleep_seconds:.2f} seconds before retry...")
            time.sleep(sleep_seconds)

    return response["url"]


def upload_banner(youtube, file_path: str):
    """Upload banner and set it for the channel."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    insert_request = youtube.channelBanners().insert(
        media_body=MediaFileUpload(file_path, chunksize=-1, resumable=True)
    )

    image_url = resumable_upload(insert_request)

    # Fetch current channel info
    channels_response = youtube.channels().list(
        mine=True,
        part="brandingSettings"
    ).execute()

    channel = channels_response["items"][0]
    channel_id = channel["id"]
    branding_settings = channel["brandingSettings"]

    # Update banner URL
    branding_settings.setdefault("image", {})
    branding_settings["image"]["bannerExternalUrl"] = image_url

    update_response = youtube.channels().update(
        part="brandingSettings",
        body={
            "id": channel_id,
            "brandingSettings": branding_settings
        }
    ).execute()

    banner_url = update_response["brandingSettings"]["image"].get("bannerMobileImageUrl")
    print(f"Banner successfully set: {banner_url}")
    return banner_url
