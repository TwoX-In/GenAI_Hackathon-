import io
import os
from typing import List, Optional, Tuple
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
from attr import dataclass
import logging

from google import genai
from dotenv import load_dotenv

load_dotenv()
LOG = logging.getLogger("banner_maker")
customization_model = "imagen-3.0-capability-001"
generation_model = "imagen-3.0-generate-002"


# ---------------------------
# Types
# ---------------------------
@dataclass
class ProductSpec:
    id: str
    title: str
    description: str
    price: Optional[str] = None
    currency: Optional[str] = None
    product_image_bytes: Optional[bytes] = None
    brand_logo_path: Optional[Path] = None


@dataclass
class BannerSpec:
    size: Tuple[int, int]  # (width, height)
    output_format: str = "PNG"  # "PNG" or "JPEG"
    padding: int = 32  # Comfortable margin for editorial/magazine layout


# Modern implementation using latest Gemini model
class GenAIImageAPI:
    def __init__(self, project: str = None, region: str = "us-central1"):
        print("HELLLLOOOOOOOOOOO api key for nano bananas", os.getenv("NANO_BANANAS_API_KEY"))
        
        self.client = genai.Client(api_key=os.getenv("NANO_BANANAS_API_KEY"))
        self.model = "gemini-2.5-flash-image-preview"
        
    def generate(
        self,
        prompt: str,
        width: int,
        height: int,
        img_bytes: Optional[bytes] = None,
        sample_count: int = 1,
        add_watermark: bool = False,
    ) -> Image.Image:
        """Generate image using latest Gemini model"""
        try:
            # Enhance prompt with size specifications
            enhanced_prompt = f"{prompt}. High resolution, professional quality, {width}x{height} dimensions."
            
            contents = [enhanced_prompt]
            
            # Add reference image if provided
            if img_bytes:
                ref_image = Image.open(io.BytesIO(img_bytes))
                contents.append(ref_image)
                enhanced_prompt = f"Based on the provided reference image, {enhanced_prompt}"
                contents[0] = enhanced_prompt

            response = self.client.models.generate_content(
                model=self.model,
                contents=contents,
            )

            # Extract generated image from response
            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    generated_image = Image.open(io.BytesIO(part.inline_data.data))
                    # Resize to exact dimensions if needed
                    if generated_image.size != (width, height):
                        generated_image = ImageOps.fit(generated_image, (width, height))
                    return generated_image

            # If no image found in response, create fallback
            LOG.warning("No image found in Gemini response, using fallback")
            return self._create_magazine_fallback(width, height)

        except Exception as e:
            LOG.error(f"Error generating image with Gemini model: {e}")
            fallback = self._create_magazine_fallback(width, height)
            return fallback

    def _create_magazine_fallback(self, width: int, height: int) -> Image.Image:
        """Create an elegant magazine-style fallback background"""
        # Create gradient from light cream to soft white
        img = Image.new("RGB", (width, height), color=(248, 246, 244))
        draw = ImageDraw.Draw(img)

        # Add subtle gradient effect
        for y in range(height):
            alpha = y / height
            color_val = int(248 + (255 - 248) * alpha)
            draw.line([(0, y), (width, y)], fill=(color_val, color_val - 2, color_val - 4))
        
        # Add very subtle texture dots
        import random
        random.seed(42)  # Consistent pattern
        for _ in range(width * height // 5000):
            x = random.randint(0, width - 1)
            y = random.randint(0, height - 1)
            draw.point((x, y), fill=(240, 238, 236))

        return img


# Use latest Gemini model by default
HttpImageAPIClient = GenAIImageAPI()


class MagazineBannerMaker:
    def __init__(self, generator=HttpImageAPIClient):
        self.generator = generator

    def generate_banner_for_product(
        self,
        product: ProductSpec,
        banner_spec: BannerSpec,
        prompt: Optional[str] = None,
    ) -> Image.Image:
        """Generate a magazine-style editorial banner for the product"""
        final_prompt = prompt or self._magazine_prompt(product, banner_spec)

        LOG.info(f"Generating magazine-style background with prompt: {final_prompt}")

        # Generate background
        bg = self.generator.generate(
            final_prompt,
            banner_spec.size[0],
            banner_spec.size[1],
            product.product_image_bytes,
        )

       
        return bg
    def generate_thumbnail_for_product(
        self,
        product: ProductSpec,
    ):
        final_prompt = self._youtube_prompt(product=product)
        bg=self.generator.generate(final_prompt, 1280, 720, product.product_image_bytes)
        return bg
    def _magazine_prompt(self, product: ProductSpec, spec: BannerSpec) -> str:
        """Create a premium editorial magazine background prompt"""
        return (
            "Create a sophisticated magazine advertisement background inspired by luxury lifestyle publications "
            "like Vogue, Harper's Bazaar, or Architectural Digest & It should have some text Based on this description too without any distortion in the texts" + product.description + " whose price is " +product.price + " "
        )
    def _youtube_prompt(self, product: ProductSpec)-> str:
        return (
            "Create an eye-catching YouTube thumbnail using this Indian artisan product image that is modern and has text describing it from this description"
            + product.description
            + " whose price is "
            + product.price
            + " "
        )

# Create the updated BannerMaker instance
maker = MagazineBannerMaker()
