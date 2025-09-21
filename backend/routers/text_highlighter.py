
from fastapi import APIRouter
from pydantic import BaseModel
from services.text_highlighter.highlighter import highlight_text



router = APIRouter(tags=["highlighter"], prefix="/highlight")

class TextRequest(BaseModel):
    text: str
@router.post("/text")
async def highlight_text_endpoint(body: TextRequest):
    return await highlight_text(body.text)