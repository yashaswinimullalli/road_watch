"""
RoadTrack AI - FastAPI Microservice for Road Damage Analysis

This is the main entry point for the application.
The model is loaded once on startup using lifespan context manager.
All API routes are registered here.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from pathlib import Path

# Import services
from .services.detector import ModelLoader
from .routes.analyze import router as analyze_router
from .routes.validate import router as validate_router


# Model path configuration
MODEL_DIR = Path(__file__).parent / "models"
MODEL_PATH = str(MODEL_DIR / "pothole.onnx")


# Lifespan context manager for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    - On startup: Load the YOLOv8 classification model
    - On shutdown: Clean up resources
    """
    # Startup
    try:
        print(f"Loading model from: {MODEL_PATH}")
        if not os.path.exists(MODEL_PATH):
            print(f"WARNING: Model file not found at {MODEL_PATH}")
            print("Make sure models/pothole.onnx exists in the app directory")
        else:
            loader = ModelLoader()
            loader.load_model(MODEL_PATH)
            print("[OK] YOLOv8 classification model (ONNX) loaded successfully")
    except Exception as e:
        print(f"ERROR: Failed to load model: {str(e)}")
        raise

    yield

    # Shutdown (if needed)
    print("Application shutting down...")


# Create FastAPI app with lifespan
app = FastAPI(
    title="RoadTrack AI - Road Damage Assessment",
    description="AI-powered microservice for road damage classification, severity analysis, and priority scoring. Uses YOLOv8 classification model for damage detection.",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# Enable CORS for development and cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include API routers
app.include_router(analyze_router)
app.include_router(validate_router)


# Root endpoint
@app.get("/", tags=["health"])
def root():
    """Root endpoint with API information."""
    return {
        "status": "operational",
        "service": "RoadTrack AI Microservice",
        "version": "2.0.0",
        "description": "AI-powered road damage analysis and authority reporting",
        "docs": "/docs",
        "health": "/api/v1/health",
    }


# Health check endpoint
@app.get("/health", tags=["health"])
def health():
    """Health check endpoint for load balancers and monitors."""
    return {
        "status": "healthy",
        "service": "RoadTrack AI",
        "version": "2.0.0",
    }
