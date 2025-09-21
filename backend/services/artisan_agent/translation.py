"""Translation service using Google Cloud Translation API."""

import logging
from google.cloud import translate_v2 as translate

logger = logging.getLogger(__name__)


class TranslationService:
    """Service for handling text translation using Google Cloud Translation API."""
    
    def __init__(self):
        self.client = translate.Client()
    
    def should_translate(self, language: str) -> bool:
        """Check if translation is needed based on language code."""
        return language.lower() != "en"
    
    async def translate_text(self, text: str, source_language: str) -> dict:
        """
        Translate text using Google Cloud Translation API.
        
        Args:
            text: Text to translate
            source_language: Source language code (e.g., "es", "fr")
        
        Returns:
            Dict with translation details
        """
        try:
            logger.info(f"Translating text from {source_language} to English: {text[:50]}...")
            
            result = self.client.translate(
                text,
                target_language="en",
                source_language=source_language
            )
            
            translated_text = result['translatedText']
            detected_source_language = result.get('detectedSourceLanguage', source_language)
            
            logger.info(f"Translation completed. Source language: {detected_source_language}")
            
            return {
                "original_text": text,
                "translated_text": translated_text,
                "source_language": detected_source_language,
                "target_language": "en",
                "was_translated": True
            }
            
        except Exception as e:
            logger.error(f"Translation error: {str(e)}")
            raise e
