"""
Model loading and inference service.
Handles YOLOv8 classification model operations using ONNX Runtime.
"""

import os
from typing import Tuple, Optional
from pathlib import Path
import numpy as np
import onnxruntime as ort
from PIL import Image
import io


class ModelLoader:
    """Singleton class for loading and managing the YOLOv8 classification model using ONNX Runtime."""

    _instance: Optional["ModelLoader"] = None
    _session: Optional[ort.InferenceSession] = None
    _input_name: Optional[str] = None
    _names = {0: 'cracks', 1: 'potholes', 2: 'uneven surfaces', 3: 'unknown'}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def load_model(self, model_path: str) -> ort.InferenceSession:
        """
        Load YOLOv8 classification model (ONNX format) from disk.

        Args:
            model_path: Path to the .onnx or .pt model file
        """
        if self._session is not None:
            return self._session

        # If .pt was specified, try to find .onnx instead
        if model_path.endswith('.pt'):
            model_path = model_path[:-3] + '.onnx'

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")

        try:
            # Set thread settings for ONNX Runtime to prevent high memory usage
            opts = ort.SessionOptions()
            opts.intra_op_num_threads = 1
            opts.inter_op_num_threads = 1
            opts.execution_mode = ort.ExecutionMode.ORT_SEQUENTIAL

            self._session = ort.InferenceSession(model_path, sess_options=opts, providers=['CPUExecutionProvider'])
            self._input_name = self._session.get_inputs()[0].name
            return self._session
        except Exception as e:
            raise RuntimeError(f"Failed to load ONNX model from {model_path}: {str(e)}") from e

    def get_session(self) -> ort.InferenceSession:
        if self._session is None:
            raise RuntimeError("Model has not been loaded. Call load_model() first.")
        return self._session

    def get_input_name(self) -> str:
        if self._input_name is None:
            raise RuntimeError("Model has not been loaded. Call load_model() first.")
        return self._input_name

    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self._session is not None

    def get_names(self) -> dict:
        return self._names


def classify_image(image_bytes: bytes) -> Tuple[str, float]:
    """
    Perform image classification on the provided image bytes using ONNX Runtime.

    Args:
        image_bytes: Image data as bytes

    Returns:
        Tuple of (class_name: str, confidence: float)
    """
    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        # Resize using Bilinear interpolation (standard for YOLOv8)
        image = image.resize((224, 224), resample=Image.BILINEAR)

        # Preprocess: convert to float32, normalize to [0, 1]
        x = np.array(image).astype(np.float32) / 255.0
        x = x.transpose(2, 0, 1)  # HWC -> CHW
        x = np.expand_dims(x, axis=0)  # Add batch dimension: (1, 3, 224, 224)

        # Get session and run inference
        loader = ModelLoader()
        session = loader.get_session()
        input_name = loader.get_input_name()
        names = loader.get_names()

        outputs = session.run(None, {input_name: x})
        probs = outputs[0][0]  # First batch output, probabilities

        # Extract top-1 result
        top1_idx = int(np.argmax(probs))
        top1_conf = float(probs[top1_idx])
        class_name = names[top1_idx]

        return class_name, top1_conf

    except Exception as e:
        raise ValueError(f"Image classification failed: {str(e)}") from e


def validate_image_file(image_bytes: bytes) -> bool:
    """
    Validate that the provided bytes represent a valid image.

    Args:
        image_bytes: Image data as bytes

    Returns:
        True if valid image
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        image.verify()  # Verify file integrity
        return True
    except Exception as e:
        raise ValueError(f"Invalid image file: {str(e)}") from e