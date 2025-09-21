import io
import json
import os
import re
import logging
from typing import List, Dict, Any, Optional
from PIL import Image, ImageDraw, ImageFont
from vertexai.generative_models import GenerativeModel, GenerationConfig
from google.cloud import aiplatform
from vertexai.preview.vision_models import ImageGenerationModel
from dotenv import load_dotenv
import os





import services.storage.storage as storage





load_dotenv()
# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# -------- CONFIG -------- #
PROJECT_ID = os.getenv("GCP_CLOUD_PROJECT_ID")
LOCATION = os.getenv("GCP_CLOUD_PROJECT_LOCATION")

# Initialize AI Platform
try:
    aiplatform.init(project=PROJECT_ID, location=LOCATION)
    logger.info("AI Platform initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize AI Platform: {e}")
    raise

# Load models with error handling
try:
    story_model = GenerativeModel("gemini-2.0-flash-exp")  # Updated model name
    image_model = ImageGenerationModel.from_pretrained(
        "imagen-3.0-fast-generate-001"
    )  # Updated version
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Failed to load models: {e}")
    raise




def generate_emails(uid: int) -> str:
    """
    Generate a neobrutalism-themed HTML marketing email for the given product.
    Uses product description, story, and metadata to generate copy.
    Plugs in product images and pricing details.
    """

    fetched_images=storage.get_output_images(uid)

    just_images = []

    for image in fetched_images:
        just_images.append(image["image"])


    # 🔹 Fetch product data
    description = storage.get_artisan_inputs(uid)["product_description"]
    story = storage.get_story(uid)
    price = storage.get_recommended_price(uid)
    product_origin = storage.get_product_origin(uid)["origin"]
    product_style = storage.get_product_style(uid)["style"]
    product_predicted_artist = storage.get_product_predicted_artist(uid)["predicted_artist"]
    
    # 🔹 Use simple placeholder images to avoid "Request Header Fields Too Large" error
    # This prevents the HTTP 431 error by not embedding large base64 data
    placeholder_images = []
    for i in range(min(len(just_images), 3)):  # Limit to 3 images max
        # Use a simple data URI with a small placeholder
        placeholder_images.append("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0ZGNkIzNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UHJvZHVjdCBJbWFnZSB7aSsxfTwvdGV4dD48L3N2Zz4=")

    # 🔹 Generate marketing copy from LLM
    try:
        response = story_model.generate_content(
            (
                f"You are a marketing copywriter. Write a persuasive, fun, and engaging "
                f"marketing email for the following artisan product.\n\n"
                f"Product Description: {description}\n"
                f"Story Behind the Product: {story}\n"
                f"Origin: {product_origin}\n"
                f"Style: {product_style}\n"
                f"Predicted Artist Inspiration: {product_predicted_artist}\n"
                f"Recommended Price: {price}\n\n"
                "Format your response EXACTLY like this:\n"
                "HEADLINE: [Your compelling headline here]\n"
                "SUBHEADLINE: [Your subheadline here]\n"
                "BODY: [Your main email body content here - this should be the main persuasive text]\n"
                "CTA: [Your call to action here]\n\n"
                "Make it suitable for a neobrutalism-styled email. "
                "The BODY should be the main persuasive content, not just repeat the headline."
            )
        )
        email_text = response.candidates[0].content.parts[0].text
        logger.info(f"Raw LLM response: {email_text[:200]}...")
    except Exception as e:
        logger.error(f"Email generation failed: {e}")
        raise

    # 🔹 Default values
    headline = "Discover Something Bold!"
    subheadline = ""
    body = email_text
    cta = f"Buy Now for {price}" if price else "Shop Now"

    # Try parsing structured fields if model provided them
    headline_match = re.search(r"HEADLINE:\s*(.*?)(?:\n|$)", email_text, re.IGNORECASE | re.DOTALL)
    if headline_match:
        headline = headline_match.group(1).strip()

    subheadline_match = re.search(r"SUBHEADLINE:\s*(.*?)(?:\n|$)", email_text, re.IGNORECASE | re.DOTALL)
    if subheadline_match:
        subheadline = subheadline_match.group(1).strip()

    # Extract body content - look for BODY: section
    body_match = re.search(r"BODY:\s*(.*?)(?:\nCTA:|$)", email_text, re.IGNORECASE | re.DOTALL)
    if body_match:
        body = body_match.group(1).strip()
    else:
        # If no BODY section found, try to extract content between subheadline and CTA
        body_match = re.search(r"SUBHEADLINE:\s*.*?\n(.*?)(?:\nCTA:|$)", email_text, re.IGNORECASE | re.DOTALL)
        if body_match:
            body = body_match.group(1).strip()

    cta_match = re.search(r"CTA:\s*(.*?)(?:\n|$)", email_text, re.IGNORECASE | re.DOTALL)
    if cta_match:
        cta = cta_match.group(1).strip()

    # Debug logging
    logger.info(f"Parsed headline: {headline}")
    logger.info(f"Parsed subheadline: {subheadline}")
    logger.info(f"Parsed body: {body[:100]}...")
    logger.info(f"Parsed CTA: {cta}")

    # 🔹 Neobrutalism HTML Template
    html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{headline}</title>
        <style>
            body {{
                background: #f4f4f4;
                font-family: 'Arial Black', sans-serif;
                color: #111;
                padding: 20px;
            }}
            .container {{
                max-width: 640px;
                margin: auto;
                background: #fff;
                border: 4px solid #000;
                box-shadow: 8px 8px 0 #000;
                padding: 24px;
            }}
            h1 {{
                font-size: 32px;
                margin: 0 0 12px 0;
                background: #ffed00;
                display: inline-block;
                padding: 6px 12px;
                border: 3px solid #000;
                box-shadow: 4px 4px 0 #000;
            }}
            h2 {{
                font-size: 20px;
                margin: 0 0 18px 0;
                color: #333;
            }}
            p {{
                font-size: 16px;
                line-height: 1.6;
            }}
            .meta {{
                font-size: 14px;
                margin-top: 12px;
                padding: 10px;
                border: 3px solid #000;
                background: #e0e0e0;
                box-shadow: 4px 4px 0 #000;
            }}
            .images {{
                margin: 20px 0;
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }}
            .images img {{
                max-width: 48%;
                border: 3px solid #000;
                box-shadow: 6px 6px 0 #000;
            }}
            .cta {{
                display: inline-block;
                background: #ff00aa;
                color: #fff;
                padding: 14px 24px;
                margin-top: 20px;
                font-size: 18px;
                font-weight: bold;
                text-decoration: none;
                border: 3px solid #000;
                box-shadow: 6px 6px 0 #000;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>{headline}</h1>
            {"<h2>" + subheadline + "</h2>" if subheadline else ""}
            <p>{body}</p>
            
            <div class="meta">
                <p><b>Origin:</b> {product_origin}</p>
                <p><b>Style:</b> {product_style}</p>
                <p><b>Inspired By:</b> {product_predicted_artist}</p>
                <p><b>Recommended Price:</b> {price}</p>
            </div>

            <div class="images">
                {"".join(f'<img src="{img}" alt="Product Image" />' for img in placeholder_images)}
            </div>
            <a href="#" class="cta">{cta}</a>
        </div>
    </body>
    </html>
    """

    return html
