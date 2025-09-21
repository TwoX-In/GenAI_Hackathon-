from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

try:
	from google.cloud import translate_v2 as translate
except Exception as exc:  # pragma: no cover - optional at runtime
	translate = None  # type: ignore


router = APIRouter(prefix="/translate", tags=["translate"])


class TranslateRequest(BaseModel):
	text: str = Field(..., description="Text to translate")
	target_language: str = Field(..., description="Target language code, e.g. 'hi'")
	source_language: Optional[str] = Field(
		"en", description="Source language code; defaults to English"
	)


@router.post("")
async def translate_text(req: TranslateRequest):
	"""Translate arbitrary text using Google Cloud Translation API v2.

	This endpoint expects project credentials to be available via GOOGLE_APPLICATION_CREDENTIALS
	or default environment configuration used by the Google SDK.
	"""
	if translate is None:
		raise HTTPException(status_code=500, detail="google-cloud-translate is not installed")

	if not req.text.strip():
		raise HTTPException(status_code=400, detail="Text must not be empty")

	client = translate.Client()
	try:
		result = client.translate(
			req.text,
			target_language=req.target_language,
			source_language=req.source_language or None,
		)
		return {
			"original_text": req.text,
			"translated_text": result.get("translatedText", ""),
			"source_language": result.get("detectedSourceLanguage", req.source_language or ""),
			"target_language": req.target_language,
		}
	except Exception as exc:
		raise HTTPException(status_code=500, detail=str(exc))


