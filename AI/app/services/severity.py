"""
Severity calculation service.
Maps model classification output to damage severity levels.
"""

from typing import Tuple


# Damage class to base severity mapping
DAMAGE_CLASS_SEVERITY = {
    "potholes": 4,
    "cracks": 3,
    "uneven surfaces": 2,
    "uneven": 2,
    "unknown": 1,
}


def get_base_severity(damage_class: str) -> int:
    """
    Get base severity value for a damage class.

    Severity values:
    - potholes = 4
    - cracks = 3
    - uneven surfaces = 2
    - unknown = 1

    Args:
        damage_class: Detected damage class name (typically from model output)

    Returns:
        Base severity value (1-4)
    """
    normalized_class = damage_class.lower().strip()
    return DAMAGE_CLASS_SEVERITY.get(normalized_class, 1)


def calculate_severity_score(damage_class: str, confidence: float) -> float:
    """
    Calculate severity score by combining base severity with model confidence.

    Formula:
    severity_score = base_severity × confidence

    Args:
        damage_class: Detected damage class name
        confidence: Model confidence (0-1)

    Returns:
        Severity score (0-4)
    """
    base_severity = get_base_severity(damage_class)
    severity_score = base_severity * confidence

    # Clamp to 0-4 range
    return max(0.0, min(4.0, severity_score))


def normalize_severity_score(severity_score: float) -> Tuple[str, float]:
    """
    Map severity score to severity level.

    Severity levels:
    - low: 0.0–1.5
    - medium: 1.5–2.5
    - high: 2.5–3.5
    - critical: 3.5+

    Args:
        severity_score: Numeric severity score (0-4)

    Returns:
        Tuple of (severity_level: str, normalized_score: float (0-100))
    """
    # Normalize to 0-100 scale
    normalized = (severity_score / 4.0) * 100.0
    normalized = max(0.0, min(100.0, normalized))

    # Map to severity level
    if severity_score < 1.5:
        severity_level = "low"
    elif severity_score < 2.5:
        severity_level = "medium"
    elif severity_score < 3.5:
        severity_level = "high"
    else:
        severity_level = "critical"

    return severity_level, normalized


def classify_severity(damage_class: str, confidence: float) -> Tuple[str, float]:
    """
    Complete severity classification workflow.

    Args:
        damage_class: Detected damage class name
        confidence: Model confidence (0-1)

    Returns:
        Tuple of (severity_level: str, severity_score: float)
    """
    score = calculate_severity_score(damage_class, confidence)
    level, _ = normalize_severity_score(score)
    return level, score