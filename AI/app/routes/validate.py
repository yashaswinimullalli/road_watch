"""
Road image validation endpoint.
Validates whether an uploaded image is road/infrastructure related
before allowing it to proceed to full AI analysis.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, status
from PIL import Image
import io

router = APIRouter(
    prefix="/api/v1",
    tags=["validation"],
)

# ── Keywords that indicate a valid road / infrastructure image ──────────────
# These map to classes the pothole classification model may return,
# as well as common YOLO/COCO categories present in road-scene images.
VALID_ROAD_KEYWORDS = {
    # Pothole / damage classes (custom model)
    "pothole", "potholes", "road", "roads", "damage", "damaged",
    "crack", "cracks", "cracking", "alligator", "rutting", "raveling",
    "pavement", "asphalt", "concrete", "highway", "lane",
    # Infrastructure / scene keywords
    "street", "sidewalk", "curb", "gutter", "median", "intersection",
    "crosswalk", "shoulder", "bridge", "overpass", "underpass",
    # Vehicle / traffic context (COCO classes common in road scenes)
    "car", "truck", "bus", "motorcycle", "bicycle", "traffic",
    "traffic light", "traffic_light", "stop sign", "stop_sign",
    "vehicle", "vehicles",
    # General road surface descriptors
    "surface", "tarmac", "gravel", "dirt road", "unpaved",
}


def _is_road_related(class_name: str) -> bool:
    """
    Check whether a YOLO class label is road / infrastructure related.

    Args:
        class_name: Class name returned by the classification model.

    Returns:
        True if the label matches road context, False otherwise.
    """
    lower = class_name.lower().strip()
    # Direct match
    if lower in VALID_ROAD_KEYWORDS:
        return True
    # Substring match — catches compound labels like "pothole_severe"
    for keyword in VALID_ROAD_KEYWORDS:
        if keyword in lower:
            return True
    return False


@router.post("/validate-road-image")
async def validate_road_image(
    image: UploadFile = File(..., description="Image to validate"),
):
    """
    Validate whether the uploaded image is road/infrastructure related.

    Uses the loaded YOLOv8 classification model to predict the top class,
    then checks whether it belongs to a curated set of road-related labels.

    Returns:
        JSON with ``is_valid`` bool, ``class_name``, and ``confidence``.
        Always returns 200 — callers should read ``is_valid`` to decide.
    """
    # ── Read image bytes ────────────────────────────────────────────────────
    image_bytes = await image.read()
    if not image_bytes:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Image file is empty",
        )

    # ── Verify it is a readable image ──────────────────────────────────────
    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
        pil_image.verify()
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Uploaded file is not a valid image",
        )

    # ── Attempt model inference (graceful fallback if model unavailable) ────
    try:
        from ..services.detector import classify_image
        class_name, confidence = classify_image(image_bytes)
        is_valid = _is_road_related(class_name)
        return {
            "is_valid": is_valid,
            "class_name": class_name,
            "confidence": round(confidence, 4),
            "message": (
                "Valid road image detected."
                if is_valid
                else "Please upload a valid road or road damage image for analysis."
            ),
        }
    except Exception:
        # If the model is unavailable (not loaded / no pothole.pt),
        # fall back to permissive validation so existing flow is unaffected.
        return {
            "is_valid": True,
            "class_name": "unknown",
            "confidence": 0.0,
            "message": "Validation skipped — model unavailable, proceeding.",
        }
