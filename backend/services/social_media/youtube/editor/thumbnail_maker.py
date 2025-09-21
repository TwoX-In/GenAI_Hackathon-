import io
import os
import tempfile
import uuid
import time
import random
from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.responses import StreamingResponse
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
from google.cloud import vision
from vertexai.generative_models import GenerativeModel, Part
from google.api_core.exceptions import ResourceExhausted, GoogleAPIError
import logging

logger = logging.getLogger(__name__)

vision_client = vision.ImageAnnotatorClient()
text_model = GenerativeModel("gemini-2.5-flash")
image_model = GenerativeModel("imagen-3.0-generate-002")  # Vertex AI Imagen

# Rate limiting and retry configuration
MAX_RETRIES = 3
RETRY_DELAY = 2  # seconds

# Simple in-memory rate limiting (for production, use Redis)
last_ai_request_time = 0
MIN_REQUEST_INTERVAL = 1.0  # Minimum seconds between AI requests


# ---------- STEP 1: Analyze product image ----------
def analyze_image(image_bytes):
    img = vision.Image(content=image_bytes)
    response = vision_client.label_detection(image=img)
    labels = [label.description for label in response.label_annotations[:5]]
    return labels or ["product"]


# ---------- STEP 2: Generate thumbnail text ----------
def generate_text(description, labels):
    prompt = f"""
    
    You are a YouTube growth hacker.
    Generate a SHORT, viral, clickable title (max 4 words) 
    for a thumbnail about this product.
    Just Give the Thumbnail and no unneccesary other text
    Product Description: {description}
    """
    resp = text_model.generate_content(prompt)

    print("RESPONSE",resp)


    return resp.candidates[0].content.parts[0].text.strip()


# ---------- STEP 3: Generate background image with fallback ----------
def generate_background(labels):
    """Generate background with AI or fallback to programmatic generation"""
    global last_ai_request_time
    
    # Rate limiting check
    current_time = time.time()
    if current_time - last_ai_request_time < MIN_REQUEST_INTERVAL:
        sleep_time = MIN_REQUEST_INTERVAL - (current_time - last_ai_request_time)
        logger.info(f"Rate limiting: sleeping for {sleep_time:.2f} seconds")
        time.sleep(sleep_time)
    
    # Try AI generation with retries
    for attempt in range(MAX_RETRIES):
        try:
            last_ai_request_time = time.time()
            prompt = f"A vibrant, eye-catching YouTube thumbnail background featuring {', '.join(labels)}, neon gradients, cinematic style."
            result = image_model.generate_content([prompt])
            bg_bytes = result.candidates[0].content.parts[0].raw_image_bytes
            logger.info("Successfully generated AI background")
            return Image.open(io.BytesIO(bg_bytes)).convert("RGB").resize((1280, 720))
            
        except ResourceExhausted as e:
            logger.warning(f"Quota exceeded on attempt {attempt + 1}: {e}")
            if attempt < MAX_RETRIES - 1:
                # Exponential backoff
                delay = RETRY_DELAY * (2 ** attempt) + random.uniform(0, 1)
                logger.info(f"Retrying in {delay:.2f} seconds...")
                time.sleep(delay)
            else:
                logger.error("All AI generation attempts failed, using fallback")
                break
                
        except GoogleAPIError as e:
            logger.error(f"Google API error: {e}")
            break
        except Exception as e:
            logger.error(f"Unexpected error in AI generation: {e}")
            break
    
    # Fallback: Generate programmatic background
    return create_fallback_background(labels)


def create_fallback_background(labels):
    """Create a clean retro-themed background when AI fails"""
    # Clean retro color palette
    retro_colors = {
        'cream': (253, 251, 246),      # #fdfbf6 - your app's background
        'yellow': (255, 219, 51),      # #ffdb33 - primary accent
        'pink': (255, 182, 193),       # #ffb6c1 - soft pink
        'blue': (173, 216, 230),       # #add8e6 - light blue
        'green': (144, 238, 144),      # #90ee90 - light green
        'black': (0, 0, 0),            # #000000 - borders
        'white': (255, 255, 255),      # #ffffff - highlights
    }
    
    # Choose a random accent color for this thumbnail
    accent_colors = ['yellow', 'pink', 'blue', 'green']
    primary_accent = random.choice(accent_colors)
    secondary_accent = random.choice([c for c in accent_colors if c != primary_accent])
    
    # Start with cream background
    bg = Image.new("RGB", (1280, 720), color=retro_colors['cream'])
    draw = ImageDraw.Draw(bg)
    
    # Create subtle background elements that frame the centered product
    accent_color = retro_colors[primary_accent]
    secondary_color = retro_colors[secondary_accent]
    shadow_offset = 12
    
    # Left accent bar (vertical)
    left_bar_x, left_bar_y = 30, 150
    left_bar_w, left_bar_h = 80, 400
    
    # Shadow
    draw.rectangle([
        left_bar_x + shadow_offset, left_bar_y + shadow_offset,
        left_bar_x + left_bar_w + shadow_offset, left_bar_y + left_bar_h + shadow_offset
    ], fill=retro_colors['black'])
    
    # Main bar
    draw.rectangle([
        left_bar_x, left_bar_y,
        left_bar_x + left_bar_w, left_bar_y + left_bar_h
    ], fill=accent_color)
    
    # Border and highlight
    draw.rectangle([
        left_bar_x, left_bar_y,
        left_bar_x + left_bar_w, left_bar_y + left_bar_h
    ], outline=retro_colors['black'], width=6)
    
    draw.rectangle([
        left_bar_x + 6, left_bar_y + 6,
        left_bar_x + left_bar_w - 6, left_bar_y + left_bar_h - 6
    ], outline=retro_colors['white'], width=3)
    
    # Right accent bar (vertical)
    right_bar_x, right_bar_y = 1170, 150
    right_bar_w, right_bar_h = 80, 400
    
    # Shadow
    draw.rectangle([
        right_bar_x + shadow_offset, right_bar_y + shadow_offset,
        right_bar_x + right_bar_w + shadow_offset, right_bar_y + right_bar_h + shadow_offset
    ], fill=retro_colors['black'])
    
    # Main bar
    draw.rectangle([
        right_bar_x, right_bar_y,
        right_bar_x + right_bar_w, right_bar_y + right_bar_h
    ], fill=secondary_color)
    
    # Border and highlight
    draw.rectangle([
        right_bar_x, right_bar_y,
        right_bar_x + right_bar_w, right_bar_y + right_bar_h
    ], outline=retro_colors['black'], width=6)
    
    draw.rectangle([
        right_bar_x + 6, right_bar_y + 6,
        right_bar_x + right_bar_w - 6, right_bar_y + right_bar_h - 6
    ], outline=retro_colors['white'], width=3)
    
    # Top accent strip (horizontal)
    top_strip_x, top_strip_y = 200, 30
    top_strip_w, top_strip_h = 880, 60
    
    # Shadow
    draw.rectangle([
        top_strip_x + shadow_offset, top_strip_y + shadow_offset,
        top_strip_x + top_strip_w + shadow_offset, top_strip_y + top_strip_h + shadow_offset
    ], fill=retro_colors['black'])
    
    # Main strip
    draw.rectangle([
        top_strip_x, top_strip_y,
        top_strip_x + top_strip_w, top_strip_y + top_strip_h
    ], fill=accent_color)
    
    # Border and highlight
    draw.rectangle([
        top_strip_x, top_strip_y,
        top_strip_x + top_strip_w, top_strip_y + top_strip_h
    ], outline=retro_colors['black'], width=6)
    
    draw.rectangle([
        top_strip_x + 6, top_strip_y + 6,
        top_strip_x + top_strip_w - 6, top_strip_y + top_strip_h - 6
    ], outline=retro_colors['white'], width=3)
    
    # Add some minimal decorative elements
    # Simple dots in corners for brand consistency
    corner_positions = [(80, 80), (1200, 80), (80, 640), (1200, 640)]
    for i, (cx, cy) in enumerate(corner_positions):
        dot_color = retro_colors[accent_colors[i % len(accent_colors)]]
        # Shadow
        draw.ellipse([cx + 3, cy + 3, cx + 23, cy + 23], fill=retro_colors['black'])
        # Dot
        draw.ellipse([cx, cy, cx + 20, cy + 20], fill=dot_color)
        draw.ellipse([cx, cy, cx + 20, cy + 20], outline=retro_colors['black'], width=3)
        # Highlight
        draw.ellipse([cx + 3, cy + 3, cx + 17, cy + 17], outline=retro_colors['white'], width=2)
    
    return bg


# ---------- STEP 4: Compose thumbnail ----------
def compose_thumbnail(product_bytes, bg_img, text):
    # Load product
    product = Image.open(io.BytesIO(product_bytes)).convert("RGBA")
    
    # Make product larger and more prominent - center stage
    max_product_size = (800, 600)  # Increased from 600x600
    product.thumbnail(max_product_size, Image.Resampling.LANCZOS)
    product = ImageOps.contain(product, max_product_size)
    
    # Calculate center position for the product
    bg_img = bg_img.convert("RGBA")
    bg_width, bg_height = bg_img.size
    product_width, product_height = product.size
    
    # Center the product horizontally and position it slightly above center vertically
    product_x = (bg_width - product_width) // 2
    product_y = (bg_height - product_height) // 2 - 50  # Slightly above center to leave room for text
    
    # Paste product at calculated center position
    bg_img.paste(product, (product_x, product_y), product)

    # Add retro UI text styling
    draw = ImageDraw.Draw(bg_img)
    
    # Try to load fonts for retro look
    font_size = 100
    try:
        font_options = [
            "arialbd.ttf",  # Arial Bold
            "arial.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
            "C:/Windows/Fonts/arial.ttf",
            "/System/Library/Fonts/Arial Bold.ttf",  # macOS
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"  # Linux
        ]
        
        font = None
        for font_path in font_options:
            try:
                font = ImageFont.truetype(font_path, font_size)
                break
            except OSError:
                continue
                
        if font is None:
            font = ImageFont.load_default()
            
    except Exception:
        font = ImageFont.load_default()
    
    # Retro text styling - clean and bold
    text = text.upper()  # All caps for impact
    
    # Calculate text position to center it in a "panel"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Position text in a prominent location
    panel_x = 50
    panel_y = 500
    panel_w = text_width + 80
    panel_h = text_height + 40
    
    # Ensure panel fits on screen
    if panel_x + panel_w > 1280:
        panel_x = 1280 - panel_w - 20
    if panel_y + panel_h > 720:
        panel_y = 720 - panel_h - 20
    
    text_x = panel_x + 40
    text_y = panel_y + 20
    
    # Create text panel background (retro UI style)
    shadow_offset = 8
    
    # Draw panel shadow
    draw.rectangle([
        panel_x + shadow_offset, panel_y + shadow_offset,
        panel_x + panel_w + shadow_offset, panel_y + panel_h + shadow_offset
    ], fill=(0, 0, 0))
    
    # Draw panel background (yellow accent color)
    draw.rectangle([
        panel_x, panel_y,
        panel_x + panel_w, panel_y + panel_h
    ], fill=(255, 219, 51))  # Your app's yellow
    
    # Draw panel border
    draw.rectangle([
        panel_x, panel_y,
        panel_x + panel_w, panel_y + panel_h
    ], outline=(0, 0, 0), width=4)
    
    # Draw inner highlight
    draw.rectangle([
        panel_x + 4, panel_y + 4,
        panel_x + panel_w - 4, panel_y + panel_h - 4
    ], outline=(255, 255, 255), width=2)
    
    # Draw the text with retro styling
    # Text shadow first
    draw.text(
        (text_x + 3, text_y + 3),
        text,
        font=font,
        fill=(0, 0, 0)  # Black shadow
    )
    
    # Main text
    draw.text(
        (text_x, text_y),
        text,
        font=font,
        fill=(0, 0, 0),  # Black text for readability
        stroke_width=2,
        stroke_fill=(255, 255, 255)  # White outline for pop
    )

    output = io.BytesIO()
    bg_img.convert("RGB").save(output, format="JPEG", quality=95)
    output.seek(0)
    return output

from rembg import remove
async def generate_thumbnail(file: UploadFile, description: str = Form(...)):
    try:
        product_bytes = await file.read()
        # Reset file stream position for subsequent reads
        await file.seek(0)
        bg_removed = remove(product_bytes)
        
        # Analyze + text
        labels = analyze_image(bg_removed)
        catchy_text = generate_text(description, labels)

        # Generate bg with fallback handling
        bg_img = generate_background(labels)

        # Compose final
        thumbnail = compose_thumbnail(bg_removed, bg_img, catchy_text)

        return StreamingResponse(
            thumbnail,
            media_type="image/jpeg",
            headers={"Content-Disposition": f"attachment; filename=thumbnail_{uuid.uuid4().hex[:8]}.jpg"},
        )
        
    except Exception as e:
        logger.error(f"Error generating thumbnail: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to generate thumbnail: {str(e)}"
        )
    

# Core function: returns local file path
import os, tempfile, uuid, io
from rembg import remove


async def generate_thumbnail_file(file: UploadFile, description: str) -> str:
    # Read file fully into bytes
    product_bytes = await file.read()
    # Reset file stream position for subsequent reads
    await file.seek(0)

    # Background removal (likely returns bytes)
    bg_removed = remove(product_bytes)

    # Downstream analysis (make sure they handle bytes correctly)
    labels = analyze_image(bg_removed)
    catchy_text = generate_text(description, labels)
    bg_img = generate_background(labels)

    # Compose thumbnail
    thumbnail = compose_thumbnail(bg_removed, bg_img, catchy_text)

    # Ensure we have bytes
    if hasattr(thumbnail, "getvalue"):  # BytesIO
        thumbnail_bytes = thumbnail.getvalue()
    elif hasattr(thumbnail, "save"):  # PIL.Image
        buffer = io.BytesIO()
        thumbnail.save(buffer, format="JPEG")
        thumbnail_bytes = buffer.getvalue()
    else:
        raise TypeError("compose_thumbnail must return BytesIO or PIL.Image")

    # Save thumbnail locally
    tmp_path = os.path.join(
        tempfile.gettempdir(), f"thumbnail_{uuid.uuid4().hex[:8]}.jpg"
    )
    with open(tmp_path, "wb") as f:
        f.write(thumbnail_bytes)
        f.close()
    return tmp_path