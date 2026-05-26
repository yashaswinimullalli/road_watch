"""
Model loading and inference service.
Handles YOLOv8 classification model operations.
"""

import os
from typing import Tuple, Optional
from pathlib import Path
from ultralytics import YOLO
from PIL import Image
import io


class ModelLoader:
    """Singleton class for loading and managing the YOLOv8 classification model."""

    _instance: Optional["ModelLoader"] = None
    _model: Optional[YOLO] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def load_model(self, model_path: str) -> YOLO:
        """
        Load YOLOv8 classification model from disk.

        Args:
            model_path: Path to the .pt model file

        Returns:
            Loaded YOLO model

        Raises:
            FileNotFoundError: If model file doesn't exist
            RuntimeError: If model loading fails
        """
        if self._model is not None:
            return self._model

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")

        try:
            self._model = YOLO(model_path)
            return self._model
        except Exception as e:
            raise RuntimeError(f"Failed to load model from {model_path}: {str(e)}") from e

    def get_model(self) -> YOLO:
        """
        Get the loaded model instance.

        Returns:
            YOLO model

        Raises:
            RuntimeError: If model hasn't been loaded yet
        """
        if self._model is None:
            raise RuntimeError("Model has not been loaded. Call load_model() first.")
        return self._model

    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self._model is not None


def classify_image(image_bytes: bytes) -> Tuple[str, float]:
    """
    Perform image classification on the provided image bytes.

    This is a classification task (not detection), so we extract:
    - Top-1 class name
    - Confidence score

    Args:
        image_bytes: Image data as bytes

    Returns:
        Tuple of (class_name: str, confidence: float)

    Raises:
        ValueError: If image is invalid or inference fails
    """
    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        # Get model instance
        loader = ModelLoader()
        model = loader.get_model()

        # Run inference (returns Results object)
        results = model(image)

        if not results or len(results) == 0:
            raise ValueError("Model returned no results")

        # Extract classification results
        result = results[0]

        # For classification models, top1 and top1conf provide class name and confidence
        if hasattr(result, "probs") and result.probs is not None:
            # YOLOv8 classification output structure
            top1_idx = result.probs.top1
            top1_conf = result.probs.top1conf.item()  # Convert tensor to float
            class_name = result.names[top1_idx]

            return class_name, top1_conf

        raise ValueError("Model output is not a classification result")

    except Exception as e:
        raise ValueError(f"Image classification failed: {str(e)}") from e


def validate_image_file(image_bytes: bytes) -> bool:
    """
    Validate that the provided bytes represent a valid image.

    Args:
        image_bytes: Image data as bytes

    Returns:
        True if valid image

    Raises:
        ValueError: If image is invalid
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()  # Verify file integrity
        return True
    except Exception as e:
        raise ValueError(f"Invalid image file: {str(e)}") from e
from pathlib import Path
import numpy as np


class PotholeDetector:
    """YOLO-based pothole detector."""
    
    def __init__(self, model_path: str = None):
        """Initialize detector with YOLO model."""
        if model_path is None:
            # Default to yolov8n.pt in project root or use app/models
            model_path = "yolov8n.pt"
        
        # Try different paths
        if not os.path.exists(model_path):
            alt_path = f"app/models/{Path(model_path).name}"
            if os.path.exists(alt_path):
                model_path = alt_path
        
        # Lazy import to avoid hard dependency at import time
        try:
            from ultralytics import YOLO
            self.model = YOLO(model_path)
        except Exception:
            # Model unavailable (not installed or incompatible Python)
            self.model = None

        self.confidence_threshold = 0.5
    
    def detect(self, image: np.ndarray) -> dict:
        """Run inference on image and return pothole count."""
        # If the model failed to load, return graceful default
        if self.model is None:
            return {"potholes_detected": 0, "confidence_scores": [], "warning": "model_not_loaded"}

        results = self.model(image, conf=self.confidence_threshold, verbose=False)

        if not results or len(results) == 0:
            return {"potholes_detected": 0, "confidence_scores": []}

        # Get detections from first result
        detections = results[0]
        boxes = detections.boxes

        if boxes is None or len(boxes) == 0:
            return {"potholes_detected": 0, "confidence_scores": []}

        # Extract confidence scores
        try:
            confidence_scores = boxes.conf.cpu().numpy().tolist()
        except Exception:
            # Fallback if tensors are not on CPU
            confidence_scores = list(map(float, boxes.conf.numpy().tolist()))

        pothole_count = len([c for c in confidence_scores if c >= self.confidence_threshold])

        return {
            "potholes_detected": pothole_count,
            "confidence_scores": confidence_scores
        }


# Global detector instance
_detector = None


def get_detector(model_path: str = None) -> PotholeDetector:
    """Get or create detector instance (singleton)."""
    global _detector
    if _detector is None:
        _detector = PotholeDetector(model_path)
    return _detector


def analyze_image(image: np.ndarray) -> dict:
    """Analyze image for potholes."""
    detector = get_detector()
    return detector.detect(image)