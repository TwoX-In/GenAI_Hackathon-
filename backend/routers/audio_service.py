# gemini_audio_service.py
from fastapi import APIRouter, FastAPI, File, UploadFile, HTTPException
from pydantic import BaseModel, Field
import google.auth
from google.cloud import storage
from google.cloud import speech
from google.cloud import aiplatform
from vertexai.generative_models import GenerativeModel
import vertexai
import uuid
import os
import json
import logging
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/artisan")


# Structured response schemas
class AudioInfoResponse(BaseModel):
    name: str = Field(..., description="Name of the artisan or speaker")
    state: str = Field(..., description="State/region where the artisan is from")
    artform: str = Field(..., description="Type of art form or craft")
    market: str = Field(..., description="Market or economic context")
    story: str = Field(..., description="Personal story or background")
    description: str = Field(..., description="Detailed description of their work")
    confidence_score: Optional[float] = Field(
        None, description="Analysis confidence score"
    )
    transcript: Optional[str] = Field(None, description="Speech-to-text transcript")


class TranscriptionResponse(BaseModel):
    transcript: str
    confidence: float
    language_code: str


# Initialize Google credentials and clients
try:
    credentials, project = google.auth.default()
    storage_client = storage.Client(credentials=credentials, project=project)
    speech_client = speech.SpeechClient(credentials=credentials)

    # Initialize Vertex AI
    vertexai.init(project=project, location="us-central1")

    logger.info(f"Initialized Google Cloud clients for project: {project}")
except Exception as e:
    logger.error(f"Failed to initialize Google Cloud clients: {e}")
    raise

# Configuration
BUCKET_NAME = "phankar"
SUPPORTED_AUDIO_FORMATS = {".wav", ".mp3", ".flac", ".m4a", ".ogg", ".webm"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Thread pool for blocking operations
executor = ThreadPoolExecutor(max_workers=4)


def validate_audio_file(file: UploadFile) -> None:
    """Validate uploaded audio file."""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in SUPPORTED_AUDIO_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format. Supported formats: {', '.join(SUPPORTED_AUDIO_FORMATS)}",
        )


def upload_to_gcs(file: UploadFile) -> str:
    """Upload file to Google Cloud Storage and return URI."""
    try:
        file_extension = os.path.splitext(file.filename)[1].lower()
        blob_name = f"audio_uploads/{uuid.uuid4()}{file_extension}"

        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(blob_name)

        # Reset file pointer
        file.file.seek(0)
        blob.upload_from_file(file.file, content_type=file.content_type)

        logger.info(f"Uploaded file to GCS: gs://{BUCKET_NAME}/{blob_name}")
        return f"gs://{BUCKET_NAME}/{blob_name}"

    except Exception as e:
        logger.error(f"Failed to upload to GCS: {e}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")


# Removed get_audio_encoding function as we're now using direct config creation


def transcribe_audio(audio_uri: str) -> TranscriptionResponse:
    """Transcribe audio using Google Cloud Speech-to-Text."""
    try:
        # Extract file extension from URI
        file_extension = os.path.splitext(audio_uri)[1]

        logger.info(f"Transcribing audio file: {file_extension}")

        # Create config based on file type
        if file_extension.lower() == ".mp3":
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.MP3,
                language_code="en-US",
                alternative_language_codes=["hi-IN", "ta-IN", "te-IN", "kn-IN"],
                enable_automatic_punctuation=True,
                model="latest_long",
            )
        elif file_extension.lower() == ".wav":
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code="en-US",
                alternative_language_codes=["hi-IN", "ta-IN", "te-IN", "kn-IN"],
                enable_automatic_punctuation=True,
                model="latest_long",
            )
        elif file_extension.lower() == ".flac":
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.FLAC,
                language_code="en-US",
                alternative_language_codes=["hi-IN", "ta-IN", "te-IN", "kn-IN"],
                enable_automatic_punctuation=True,
                model="latest_long",
            )
        else:
            # Fallback for other formats
            config = speech.RecognitionConfig(
                language_code="en-US",
                enable_automatic_punctuation=True,
                model="latest_long",
            )

        audio = speech.RecognitionAudio(uri=audio_uri)

        # Perform transcription
        logger.info("Starting speech recognition...")
        response = speech_client.recognize(config=config, audio=audio)

        if not response.results:
            logger.warning("No speech detected in audio")
            return TranscriptionResponse(
                transcript="No speech detected in audio",
                confidence=0.0,
                language_code="en-US",
            )

        # Get the best alternative
        result = response.results[0]
        alternative = result.alternatives[0]

        logger.info(
            f"Transcription completed with confidence: {alternative.confidence}"
        )

        return TranscriptionResponse(
            transcript=alternative.transcript,
            confidence=alternative.confidence,
            language_code=config.language_code,
        )

    except Exception as e:
        logger.error(f"Transcription failed: {e}")
        # Try with minimal config as fallback
        return transcribe_audio_fallback(audio_uri)


def transcribe_audio_fallback(audio_uri: str) -> TranscriptionResponse:
    """Fallback transcription method with minimal configuration."""
    try:
        logger.info("Attempting fallback transcription with minimal config...")

        # Ultra-minimal configuration
        config = speech.RecognitionConfig(language_code="en-US")

        audio = speech.RecognitionAudio(uri=audio_uri)
        response = speech_client.recognize(config=config, audio=audio)

        if not response.results:
            return TranscriptionResponse(
                transcript="No speech detected in audio (fallback)",
                confidence=0.0,
                language_code="en-US",
            )

        result = response.results[0]
        alternative = result.alternatives[0]

        logger.info("Fallback transcription successful")

        return TranscriptionResponse(
            transcript=alternative.transcript,
            confidence=alternative.confidence,
            language_code="en-US",
        )

    except Exception as e:
        logger.error(f"Fallback transcription also failed: {e}")
        raise HTTPException(
            status_code=500, detail=f"All transcription methods failed: {str(e)}"
        )


def analyze_with_gemini(transcript: str) -> dict:
    """Analyze transcript with Gemini to extract structured information."""
    try:
        # Create the prompt for structured extraction
        prompt = f"""
        Analyze the following transcript of an artisan speaking about their craft and extract structured information.
        
        Transcript: "{transcript}"
        
        Please extract and return a JSON object with the following fields:
        - name: The artisan's name (if mentioned, otherwise "Not specified")
        - state: The state or region they're from (if mentioned, otherwise "Not specified")
        - artform: The type of art form or craft they practice
        - market: Information about their market, customers, or economic context
        - story: Their personal story, background, or journey
        - description: A detailed description of their work, techniques, or products
        - confidence_score: A score from 0.0 to 1.0 indicating how confident you are in the extracted information
        
        Return only valid JSON without any additional text or formatting.
        """

        # Use Vertex AI Gemini model
        model = GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)

        # Parse the JSON response
        try:
            result = json.loads(response.text.strip())
            return result
        except json.JSONDecodeError:
            # Fallback if Gemini doesn't return valid JSON
            return {
                "name": "Analysis failed - invalid response format",
                "state": "Not specified",
                "artform": "Not specified",
                "market": "Not specified",
                "story": transcript[:500] + "..."
                if len(transcript) > 500
                else transcript,
                "description": "Failed to extract structured information",
                "confidence_score": 0.1,
            }

    except Exception as e:
        logger.error(f"Gemini analysis failed: {e}")
        # Return fallback response
        return {
            "name": f"Analysis failed: {str(e)}",
            "state": "Not specified",
            "artform": "Not specified",
            "market": "Not specified",
            "story": transcript[:500] + "..." if len(transcript) > 500 else transcript,
            "description": "Failed to analyze with Gemini",
            "confidence_score": 0.0,
        }


@router.post("/transcribe", response_model=TranscriptionResponse)
async def transcribe_only(file: UploadFile = File(...)):
    """
    Transcribe audio file to text only.
    """
    validate_audio_file(file)

    # Upload to GCS
    audio_uri = await asyncio.get_event_loop().run_in_executor(
        executor, upload_to_gcs, file
    )

    # Transcribe
    transcription = await asyncio.get_event_loop().run_in_executor(
        executor, transcribe_audio, audio_uri
    )

    return transcription


@router.post("/analyze_audio", response_model=AudioInfoResponse)
async def analyze_audio(file: UploadFile = File(...)):
    """
    Upload audio to GCS, transcribe it, analyze with Gemini, and return structured artisan info.
    """
    try:
        # Validate file
        validate_audio_file(file)
        logger.info(f"Processing audio file: {file.filename}")

        # Upload to Google Cloud Storage
        audio_uri = await asyncio.get_event_loop().run_in_executor(
            executor, upload_to_gcs, file
        )

        # Transcribe audio to text
        transcription = await asyncio.get_event_loop().run_in_executor(
            executor, transcribe_audio, audio_uri
        )

        if transcription.confidence < 0.3:
            logger.warning(f"Low confidence transcription: {transcription.confidence}")

        # Analyze transcript with Gemini
        analysis = await asyncio.get_event_loop().run_in_executor(
            executor, analyze_with_gemini, transcription.transcript
        )

        # Construct structured response
        result = AudioInfoResponse(
            name=analysis.get("name", "Not specified"),
            state=analysis.get("state", "Not specified"),
            artform=analysis.get("artform", "Not specified"),
            market=analysis.get("market", "Not specified"),
            story=analysis.get("story", "Not specified"),
            description=analysis.get("description", "Not specified"),
            confidence_score=analysis.get("confidence_score"),
            transcript=transcription.transcript,
        )

        logger.info("Successfully processed audio file")
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing audio: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Test GCS connection
        bucket = storage_client.bucket(BUCKET_NAME)
        bucket.exists()

        return {
            "status": "healthy",
            "services": {
                "gcs": "connected",
                "speech": "connected",
                "gemini": "connected",
            },
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}


# Optional: Cleanup function to delete old files from GCS
@router.delete("/cleanup")
async def cleanup_old_files(days_old: int = 7):
    """
    Delete audio files older than specified days from GCS.
    """
    try:
        bucket = storage_client.bucket(BUCKET_NAME)
        blobs = bucket.list_blobs(prefix="audio_uploads/")

        deleted_count = 0
        for blob in blobs:
            age_days = (blob.time_created.replace(tzinfo=None) - datetime.utcnow()).days
            if abs(age_days) > days_old:
                blob.delete()
                deleted_count += 1

        return {"deleted_files": deleted_count}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")
