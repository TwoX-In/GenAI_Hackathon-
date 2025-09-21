from logging import log
from uuid import uuid4
from fastapi import APIRouter, File, UploadFile, logger
from fastapi.responses import JSONResponse

from services.storage.storage import (
    store_product_style,
    store_product_origin,
    store_product_predicted_artist,
    store_product_medium,
    store_product_themes,  
    store_product_colors,
    store_recommended_prices# you may or may not have title in classifier result
)

router = APIRouter(prefix="/classifier")



@router.options("/trial_classify")
async def trial_classify_options():
    """Handle preflight OPTIONS request for trial_classify endpoint"""
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Private-Network": "true",
        }
    )

import httpx
from dotenv import load_dotenv
load_dotenv()
import os
@router.post("/trial_classify")
async def trial_classify_image(
    image: UploadFile = File(...)
) -> dict[str, str]:
    # Run classification that is hosted on the cloud 
    url = os.getenv("GCP_CLASSIFIER_URL") + "/classifier/trial_classify"
    logger.logger.info(f"CLASSIFIER URL: {url}")
    file_bytes=await image.read()
    # Reset file stream position for subsequent reads
    await image.seek(0)
    payload = {"image": (image.filename, file_bytes, image.content_type)}
    # Make async HTTP request
    async with httpx.AsyncClient(timeout=600) as client:
        resp = await client.post(url, files=payload)    
    
    return resp.json()
@router.post("/classify")
async def classify_image(
    uid: int = uuid4().int & ((1 << 32) - 1), image: UploadFile = File(...)
) -> dict[str, str]:
    # Run classification that is hosted on the cloud
    resp = await trial_classify_image(image)
    image.file.seek(0)
    print("RESPONSE:", resp)
    # Insert into DB
    try:
        if "style" in resp:
            store_product_style(uid, resp["style"])
        if "artist" in resp:
            store_product_predicted_artist(uid, resp["artist"])
        if "origin" in resp:
            store_product_origin(uid, resp["origin"])
        if "medium" in resp:
            store_product_medium(uid, resp["medium"])
        if "price" in resp:
            store_recommended_prices(uid, int(resp["price"]))
        if "themes" in resp:
            store_product_themes(uid, resp["themes"])
        if "color" in resp:
            store_product_colors(uid, resp["color"])

    except Exception as e:
        return {"status": "error", "message": str(e)}

    return resp
@router.options("/classify")
async def classify_options():
    """Handle preflight OPTIONS request for classify endpoint"""
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Private-Network": "true",
        },
    )
