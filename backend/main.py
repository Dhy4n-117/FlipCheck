"""FlipCheck API — FastAPI application entry point."""

from __future__ import annotations

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from models import AnalysisResponse, ErrorResponse, ItemIdentification
from services.gemini import identify_and_price_item
from services.pricing import build_flip_insight, build_pricing

# Load .env file for local development
load_dotenv()

# ---------- Constants ----------
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp"}


# ---------- Lifespan ----------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — startup / shutdown hooks."""
    yield


# ---------- App ----------
app = FastAPI(
    title="FlipCheck API",
    description="Thrift store item price intelligence",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Global exception handler ----------
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Ensure all unhandled exceptions return structured JSON."""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="internal_error",
            message=str(exc),
        ).model_dump(),
    )


# ---------- Health check ----------
@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "service": "flipcheck-api"}


# ---------- Main analysis endpoint ----------
@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze(
    image: UploadFile = File(...),
    asking_price: float = Form(None),
):
    """Analyze an uploaded image of a thrift item.

    Pipeline:
    1. Validate image MIME type and size
    2. Call Gemini 2.5 Flash for identification, pricing, and flip analysis
    3. Construct response models from raw Gemini output
    4. Return structured profit report
    """

    # --- 1. Validate MIME type ---
    if image.content_type not in ALLOWED_MIME_TYPES:
        return JSONResponse(
            status_code=400,
            content=ErrorResponse(
                error="invalid_image",
                message=f"Unsupported image type '{image.content_type}'. Accepted: JPEG, PNG, WEBP.",
            ).model_dump(),
        )

    # --- 2. Read and validate size ---
    image_bytes = await image.read()
    if len(image_bytes) > MAX_IMAGE_SIZE:
        return JSONResponse(
            status_code=400,
            content=ErrorResponse(
                error="image_too_large",
                message=f"Image size {len(image_bytes) / (1024 * 1024):.1f}MB exceeds the 10MB limit.",
            ).model_dump(),
        )

    # --- 3. Gemini analysis (identification + pricing + insight) ---
    try:
        raw = await identify_and_price_item(image_bytes, image.content_type, asking_price)
    except ValueError as exc:
        return JSONResponse(
            status_code=422,
            content=ErrorResponse(
                error="analysis_failed",
                message=str(exc),
            ).model_dump(),
        )
    except Exception as exc:
        return JSONResponse(
            status_code=500,
            content=ErrorResponse(
                error="analysis_failed",
                message=f"AI vision service error: {exc}",
            ).model_dump(),
        )

    # --- 4. Build response models ---
    item_data = raw.get("item", {})
    item = ItemIdentification(**item_data)

    pricing = build_pricing(raw)
    flip_insight = build_flip_insight(raw, asking_price)

    return AnalysisResponse(
        item=item,
        pricing=pricing,
        flip_insight=flip_insight,
        asking_price=asking_price,
    )
