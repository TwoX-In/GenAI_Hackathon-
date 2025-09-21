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


class ComicGenerator:
    def __init__(self):
        self.story_model = story_model
        self.image_model = image_model

    def generate_comic_story(
        self, product_name: str, product_description: str
    ) -> Dict[str, Any]:
        """Generate a 4-panel comic story with improved prompting and JSON parsing."""

        prompt = f"""
        Create a 4-panel comic story featuring the product: {product_name}.
        Product description: {product_description}.
        
        IMPORTANT: Return ONLY valid JSON in the exact format below, no additional text:
        
        {{
            "panels": [
                {{
                    "panel_number": 1,
                    "description": "Detailed visual description for image generation",
                    "dialogue": "Short dialogue or caption text"
                }},
                {{
                    "panel_number": 2,
                    "description": "Detailed visual description for image generation",
                    "dialogue": "Short dialogue or caption text"
                }},
                {{
                    "panel_number": 3,
                    "description": "Detailed visual description for image generation",
                    "dialogue": "Short dialogue or caption text"
                }},
                {{
                    "panel_number": 4,
                    "description": "Detailed visual description for image generation",
                    "dialogue": "Short dialogue or caption text"
                }}
            ]
        }}
        
        Make each panel description vivid and specific for comic book style illustration.
        Keep dialogue concise (under 15 words per panel).
        """

        # Configure generation parameters for more consistent JSON output
        generation_config = GenerationConfig(
            temperature=0.7,
            top_p=0.8,
            max_output_tokens=2048,
        )

        try:
            response = self.story_model.generate_content(
                prompt, generation_config=generation_config
            )

            if not response or not response.text:
                raise ValueError("Empty response from story generation model")

            return self._parse_story_response(response.text)

        except Exception as e:
            logger.error(f"Error generating story: {e}")
            # Return fallback story structure
            return self._get_fallback_story(product_name, product_description)

    def _parse_story_response(self, response_text: str) -> Dict[str, Any]:
        """Parse the story response with multiple fallback strategies."""

        # Try direct JSON parsing first
        try:
            # Clean the response text
            cleaned_text = response_text.strip()

            # Remove potential markdown code blocks
            if cleaned_text.startswith("```"):
                cleaned_text = re.sub(
                    r"^```(?:json)?\s*\n", "", cleaned_text, flags=re.MULTILINE
                )
                cleaned_text = re.sub(
                    r"\n```\s*$", "", cleaned_text, flags=re.MULTILINE
                )

            story_data = json.loads(cleaned_text)

            # Validate the structure
            if not isinstance(story_data, dict) or "panels" not in story_data:
                raise ValueError("Invalid story structure")

            panels = story_data["panels"]
            if not isinstance(panels, list) or len(panels) != 4:
                raise ValueError("Story must have exactly 4 panels")

            # Validate each panel
            for i, panel in enumerate(panels):
                if not isinstance(panel, dict):
                    raise ValueError(f"Panel {i + 1} is not a dictionary")
                if "description" not in panel or "dialogue" not in panel:
                    raise ValueError(f"Panel {i + 1} missing required fields")

            logger.info("Successfully parsed story JSON")
            return story_data

        except json.JSONDecodeError as e:
            logger.warning(f"JSON parsing failed: {e}")
            # Try to extract JSON from response using regex
            return self._extract_json_from_text(response_text)

        except Exception as e:
            logger.error(f"Story parsing error: {e}")
            raise

    def _extract_json_from_text(self, text: str) -> Dict[str, Any]:
        """Extract JSON from text using regex patterns."""

        # Look for JSON-like structure
        json_pattern = r'\{.*?"panels".*?\[.*?\].*?\}'
        match = re.search(json_pattern, text, re.DOTALL)

        if match:
            try:
                json_text = match.group(0)
                return json.loads(json_text)
            except json.JSONDecodeError:
                pass

        # If all parsing fails, create structure from text
        return self._create_story_from_text(text)

    def _create_story_from_text(self, text: str) -> Dict[str, Any]:
        """Create story structure from free-form text."""

        logger.warning("Creating story structure from free-form text")

        # Split text into potential panels
        sentences = [s.strip() for s in text.split(".") if s.strip()]

        panels = []
        for i in range(4):
            if i < len(sentences):
                description = sentences[i]
                dialogue = f"Panel {i + 1} dialogue"
            else:
                description = f"Scene {i + 1} showing the product in use"
                dialogue = f"Great product feature {i + 1}!"

            panels.append(
                {
                    "panel_number": i + 1,
                    "description": description,
                    "dialogue": dialogue,
                }
            )

        return {"panels": panels}

    def _get_fallback_story(
        self, product_name: str, product_description: str
    ) -> Dict[str, Any]:
        """Generate a fallback story when AI generation fails."""

        logger.warning("Using fallback story generation")

        return {
            "panels": [
                {
                    "panel_number": 1,
                    "description": f"A person discovering {product_name} for the first time, comic book style",
                    "dialogue": f"What's this amazing {product_name}?",
                },
                {
                    "panel_number": 2,
                    "description": f"Person reading about {product_name}, showing interest and curiosity",
                    "dialogue": "This looks perfect for me!",
                },
                {
                    "panel_number": 3,
                    "description": f"Person using {product_name} successfully, showing satisfaction",
                    "dialogue": "Wow, this really works!",
                },
                {
                    "panel_number": 4,
                    "description": f"Person happy and recommending {product_name} to others",
                    "dialogue": "Everyone should try this!",
                },
            ]
        }

    def generate_panel_image(
        self, description: str, panel_number: int
    ) -> Optional[Image.Image]:
        """Generate image for a single panel with error handling."""

        enhanced_prompt = (
            f"Comic book style illustration, panel {panel_number} of 4. "
            f"Bold black outlines, bright vibrant colors, clear composition. "
            f"{description}. "
            f"Professional comic art style, clean lines, good contrast."
        )

        try:
            response = self.image_model.generate_images(
                prompt=enhanced_prompt,
                number_of_images=1,
                aspect_ratio="1:1",
            )

            if response and response.images:
                # Get the first generated image
                image_obj = response.images.__getitem__(0)
                # Convert to PIL Image
                image_bytes = image_obj._image_bytes
                image = Image.open(io.BytesIO(image_bytes))
                logger.info(f"Successfully generated image for panel {panel_number}")
                return image
            else:
                logger.error(f"No image generated for panel {panel_number}")
                return self._create_placeholder_image(panel_number)

        except Exception as e:
            logger.error(f"Error generating image for panel {panel_number}: {e}")
            return self._create_placeholder_image(panel_number)

    def _create_placeholder_image(self, panel_number: int) -> Image.Image:
        """Create a placeholder image when image generation fails."""

        image = Image.new("RGB", (512, 512), "lightgray")
        draw = ImageDraw.Draw(image)

        try:
            # Try to use a better font
            font = ImageFont.truetype("arial.ttf", 24)
        except:
            font = ImageFont.load_default()

        text = f"Panel {panel_number}\n(Image generation failed)"

        # Get text bounding box for centering
        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

        x = (512 - text_width) // 2
        y = (512 - text_height) // 2

        draw.text((x, y), text, font=font, fill="black", align="center")

        return image

    def assemble_comic(self, panels: List[Dict[str, Any]]) -> Image.Image:
        """Assemble individual panels into a complete comic strip."""

        # Create a 2x2 layout (4 panels) with padding
        panel_size = 512
        padding = 20
        text_height = 60

        total_width = (panel_size * 2) + (padding * 3)
        total_height = (panel_size * 2) + (padding * 3) + (text_height * 2)

        final_img = Image.new("RGB", (total_width, total_height), "white")
        draw = ImageDraw.Draw(final_img)

        # Try to load a better font
        try:
            font = ImageFont.truetype("arial.ttf", 16)
            title_font = ImageFont.truetype("arial.ttf", 20)
        except:
            font = ImageFont.load_default()
            title_font = ImageFont.load_default()

        # Panel positions (x, y)
        positions = [
            (padding, padding),  # Top left
            (padding + panel_size + padding, padding),  # Top right
            (padding, padding + panel_size + text_height + padding),  # Bottom left
            (
                padding + panel_size + padding,
                padding + panel_size + text_height + padding,
            ),  # Bottom right
        ]

        for i, panel in enumerate(panels):
            if i >= 4:  # Safety check
                break

            img = panel.get("image")
            if img and isinstance(img, Image.Image):
                # Resize image to fit panel if needed
                img = img.resize((panel_size, panel_size), Image.Resampling.LANCZOS)
                x, y = positions[i]

                # Paste image
                final_img.paste(img, (x, y))

                # Add border around panel
                draw.rectangle(
                    [x - 2, y - 2, x + panel_size + 1, y + panel_size + 1],
                    outline="black",
                    width=2,
                )

                # Add dialogue below panel
                dialogue = panel.get("dialogue", "")
                if dialogue:
                    # Word wrap the dialogue
                    wrapped_text = self._wrap_text(dialogue, font, panel_size - 10)

                    text_y = y + panel_size + 5
                    for line in wrapped_text:
                        draw.text((x + 5, text_y), line, font=font, fill="black")
                        text_y += 18

        return final_img

    def _wrap_text(
        self, text: str, font: ImageFont.ImageFont, max_width: int
    ) -> List[str]:
        """Wrap text to fit within specified width."""

        words = text.split()
        lines = []
        current_line = []

        draw = ImageDraw.Draw(Image.new("RGB", (1, 1), "white"))

        for word in words:
            test_line = " ".join(current_line + [word])
            bbox = draw.textbbox((0, 0), test_line, font=font)
            text_width = bbox[2] - bbox[0]

            if text_width <= max_width:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(" ".join(current_line))
                    current_line = [word]
                else:
                    lines.append(word)

        if current_line:
            lines.append(" ".join(current_line))

        return lines

    def create_product_comic(
        self, product_name: str, product_description: str
    ) -> io.BytesIO:
        """Main function to create a complete product comic."""

        logger.info(f"Starting comic generation for: {product_name}")

        try:
            # Generate story
            story_data = self.generate_comic_story(product_name, product_description)

            # Generate images for each panel
            panels = []
            for panel_data in story_data["panels"]:
                logger.info(
                    f"Generating image for panel {panel_data.get('panel_number', 'unknown')}"
                )

                image = self.generate_panel_image(
                    panel_data["description"],
                    panel_data.get("panel_number", len(panels) + 1),
                )

                panels.append(
                    {
                        "image": image,
                        "dialogue": panel_data.get("dialogue", ""),
                        "panel_number": panel_data.get("panel_number", len(panels) + 1),
                    }
                )

            # Assemble final comic
            comic = self.assemble_comic(panels)

            # Save to buffer
            buf = io.BytesIO()
            comic.save(buf, format="PNG", quality=95)
            buf.seek(0)

            logger.info("Comic generation completed successfully")
            return buf

        except Exception as e:
            logger.error(f"Error in comic generation pipeline: {e}")
            raise

    def debug_image_generation(self, description: str) -> None:
        """Debug method to understand the response structure."""

        if not self.image_model:
            logger.info("No image model available for debugging")
            return

        try:
            response = self.image_model.generate_images(
                prompt=f"Comic book style: {description}",
                number_of_images=1,
            )

            logger.info(f"Response type: {type(response)}")
            logger.info(
                f"Response dir: {[attr for attr in dir(response) if not attr.startswith('_')]}"
            )

            if hasattr(response, "__dict__"):
                logger.info(f"Response attributes: {response.__dict__}")

        except Exception as e:
            logger.error(f"Debug error: {e}")


# Create global instance
comic_generator = ComicGenerator()


def create_product_comic(product_name: str, product_description: str) -> io.BytesIO:
    """Wrapper function for backward compatibility."""
    return comic_generator.create_product_comic(product_name, product_description)

