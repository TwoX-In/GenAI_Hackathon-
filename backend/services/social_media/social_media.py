import os
import base64
import tempfile
from fastapi import UploadFile
from starlette.datastructures import UploadFile as StarletteUploadFile

from services.social_media.youtube.apis import upload_video, upload_thumbnail
from services.storage.storage import (
    get_product_artist,
    get_product_title,
    get_product_style,
    get_product_colors,
    get_product_origin,
    get_product_medium,
    get_video,
    get_story,
    get_product_youtube_url,
    store_product_youtube_url,
    get_input_images,
    get_edited_video,
    get_product_predicted_artist
)
from services.social_media.youtube.editor import thumbnail_maker


class YoutubeClient:
    def __init__(self, api_key=None):
        self.api_key = api_key

    def get_video_info(self, video_id):
        pass  # TODO: implement later

    async def upload_video(self, uid: int = 123):
        # Already uploaded?
        existing_url = get_product_youtube_url(uid)
        if existing_url:
            return existing_url

        # --- Metadata ---
        
        description = get_story(uid)
        category = 22
        keywords = [
            get_product_medium(uid).get("medium")
            if get_product_medium(uid)
            else "Unknown",
            get_product_colors(uid).get("colors")
            if get_product_colors(uid)
            else "Unknown",
            get_product_origin(uid).get("origin")
            if get_product_origin(uid)
            else "Unknown",
            get_product_predicted_artist(uid).get("predicted_artist")
            if get_product_artist(uid)
            else "Unknown",
        ]
        title = (
            get_product_medium(uid).get("medium")
            + "by "
            + get_product_predicted_artist(uid).get("predicted_artist")
        )
        keywords_str = ", ".join(keywords)
        privacy_status = "public"

        # --- Fetch base64 video ---
        file = get_edited_video(uid)
        if not file:
            raise RuntimeError(f"No video found for uid={uid}")
        video_base64 = file["video"]
        video_bytes = base64.b64decode(video_base64)

        # --- Write video to temp file ---
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp4") as tmp_video:
            tmp_video.write(video_bytes)
            tmp_video_path = tmp_video.name

        try:
            # --- Upload to YouTube ---
            video_id = upload_video.upload_video(
                file=tmp_video_path,
                title=title,
                description=description,
                category=category,
                keywords=keywords_str,
                privacy_status=privacy_status,
            )
        finally:
            # Always clean up video file
            if os.path.exists(tmp_video_path):
                os.remove(tmp_video_path)

        youtube_url = f"https://www.youtube.com/watch?v={video_id}"
        store_product_youtube_url(uid, youtube_url)

        # --- Make thumbnail ---
        image_bytes = base64.b64decode(get_input_images(uid)[0]["image"])
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_img:
            tmp_img.write(image_bytes)
            tmp_img_path = tmp_img.name

        try:
            # Wrap as UploadFile (so editor can process it)
            with open(tmp_img_path, "rb") as f:
                upload_file = StarletteUploadFile(filename="from_base64.png", file=f)
                thumbnail_path = await thumbnail_maker.generate_thumbnail_file(
                    upload_file, description
                )
            
            # --- Upload thumbnail ---
            upload_thumbnail.upload_thumbnail(video_id, thumbnail_path)

        finally:
            # Clean up temp input image
            if os.path.exists(tmp_img_path):
                os.remove(tmp_img_path)

            # Clean up generated thumbnail
            if thumbnail_path and os.path.exists(thumbnail_path):
                os.remove(thumbnail_path)

        return youtube_url
