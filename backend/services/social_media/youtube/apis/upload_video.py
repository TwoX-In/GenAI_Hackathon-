#!/usr/bin/python

import os
import random
import time
import httplib2

import google_auth_oauthlib.flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
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

# Update path as needed (relative to this file)
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
def resumable_upload(request):
    """Perform a resumable upload with exponential backoff."""
    response = None
    error = None
    retry = 0
    while response is None:
        try:
            print("Uploading file...")
            status, response = request.next_chunk()
            if response is not None:
                if "id" in response:
                    print(f'Video id "{response["id"]}" was successfully uploaded.')
                    return response["id"]
                else:
                    raise RuntimeError(f"Unexpected upload response: {response}")
        except HttpError as e:
            if e.resp.status in RETRIABLE_STATUS_CODES:
                error = f"A retriable HTTP error {e.resp.status} occurred:\n{e.content}"
            else:
                raise
        except RETRIABLE_EXCEPTIONS as e:
            error = f"A retriable error occurred: {e}"

        if error is not None:
            print(error)
            retry += 1
            if retry > MAX_RETRIES:
                raise RuntimeError("Max retries exceeded during upload.")

            max_sleep = 2**retry
            sleep_seconds = random.random() * max_sleep
            print(f"Sleeping {sleep_seconds:.2f} seconds before retrying...")
            time.sleep(sleep_seconds)


def upload_video(file, title="Test Title", 
    description="Test Description",
    category="22", 
    keywords="", 
    privacy_status="private"):
    """
    Upload a video to YouTube.

    Args:
        file (str): Path to video file.
        title (str): Title of video.
        description (str): Description of video.
        category (str): Numeric video category (default "22" = People & Blogs).
        keywords (str): Comma-separated keywords.
        privacy_status (str): One of "public", "private", "unlisted".

    Returns:
        str: The uploaded video ID.
    """
    youtube = get_authenticated_service()

    tags = keywords if keywords else None

    body = dict(
        snippet=dict(
            title=title,
            description=description,
            tags=tags,
            categoryId=category,
        ),
        status=dict(
            privacyStatus=privacy_status,
        ),
    )

    insert_request = youtube.videos().insert(
        part=",".join(body.keys()),
        body=body,
        media_body=MediaFileUpload(file, chunksize=-1, resumable=True),
    )

    return resumable_upload(insert_request)
