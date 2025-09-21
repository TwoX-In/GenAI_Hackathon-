from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from init import db as init
from contextlib import asynccontextmanager
from routers import artisan
from routers import image
from routers import social_media
from routers import classifier
from routers import inventory # Added inventory router
from routers import text_highlighter
from routers import storage
from routers import youtube
from routers import translation as translation_router
from routers import audio_service
from routers import ar

import os

# Load environment variables from .env (root or backend directory)
try:
    from dotenv import load_dotenv
    # Try project root .env
    root_env = os.path.join(os.path.dirname(__file__), "..", ".env")
    backend_env = os.path.join(os.path.dirname(__file__), ".env")
    for env_path in [root_env, backend_env]:
        if os.path.exists(env_path):
            load_dotenv(env_path, override=False)
except Exception:
    # dotenv is optional; if missing, proceed with existing env
    pass

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Initializing database...")
    await init.init_db()
    
    yield

app = FastAPI(lifespan=lifespan)
origins = [
    "http://localhost:5173",  # Your existing frontend
    "http://localhost:3000",  # Common dev port
    "http://localhost:8080",  # Backend port
    "http://127.0.0.1:5173",  # Alternative localhost
    "http://127.0.0.1:3000",  # Alternative localhost
    "http://127.0.0.1:8000",  # Alternative localhost
    "*",                      # Allow all origins (for Chrome extension compatibility)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Custom middleware to handle private network CORS
@app.middleware("http")
async def add_private_network_headers(request: Request, call_next):
    response = await call_next(request)
    
    # Add headers for private network requests
    response.headers["Access-Control-Allow-Private-Network"] = "true"
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    
    return response

app.include_router(artisan.router)
app.include_router(image.router)
app.include_router(social_media.router)
app.include_router(classifier.router)  
app.include_router(inventory.router) 
app.include_router(storage.router)
app.include_router(text_highlighter.router)
app.include_router(youtube.router)
app.include_router(audio_service.router)
app.include_router(translation_router.router)
app.include_router(ar.router)