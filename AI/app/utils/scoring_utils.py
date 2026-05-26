"""
Scoring utility functions for priority and severity calculations.
"""

from typing import Tuple, Optional


def normalize_road_type(road_type: str) -> str:
    """
    Normalize road type string to standard values.

    Standard values: NH, SH, MDR, ODR, Local Road

    Args:
        road_type: Input road type string (case-insensitive, allows variations)

    Returns:
        Normalized road type string
    """
    normalized = road_type.strip().upper()

    # Exact matches
    if normalized in ("NH", "SH", "MDR", "ODR"):
        return normalized

    if normalized == "LOCAL ROAD" or normalized == "LOCAL":
        return "Local Road"

    # Partial matches
    if "NATIONAL" in normalized or "NH" in normalized:
        return "NH"
    if "STATE" in normalized or "SH" in normalized:
        return "SH"
    if "MAJOR" in normalized or "MDR" in normalized:
        return "MDR"
    if "OTHER" in normalized or "ODR" in normalized:
        return "ODR"
    if "LOCAL" in normalized:
        return "Local Road"

    # Default fallback
    return "ODR"


def get_road_importance_score(road_type: str) -> Tuple[float, str]:
    """
    Calculate road importance score from road type.

    Mapping:
    - NH (National Highway) = 4.0 (highest)
    - SH (State Highway) = 3.5 (high)
    - MDR (Major District Road) = 2.5 (medium)
    - ODR (Other District Road) = 1.5 (low-medium)
    - Local Road = 1.0 (low)

    Args:
        road_type: Normalized road type

    Returns:
        Tuple of (score: float, description: str)
    """
    road_type_normalized = normalize_road_type(road_type)

    scores = {
        "NH": (4.0, "National Highway"),
        "SH": (3.5, "State Highway"),
        "MDR": (2.5, "Major District Road"),
        "ODR": (1.5, "Other District Road"),
        "Local Road": (1.0, "Local Road"),
    }

    return scores.get(road_type_normalized, (1.0, "Unknown"))


def get_support_score(support_count: int) -> Tuple[float, str]:
    """
    Calculate community impact score from support count.

    Score bands:
    - 0-5 = 1.0 (low)
    - 6-20 = 2.0 (moderate)
    - 21-50 = 3.0 (high)
    - 50+ = 4.0 (critical)

    Args:
        support_count: Number of civic complaints/support

    Returns:
        Tuple of (score: float, impact_level: str)
    """
    if support_count <= 5:
        return 1.0, "Low community impact"
    elif support_count <= 20:
        return 2.0, "Moderate community impact"
    elif support_count <= 50:
        return 3.0, "High community impact"
    else:
        return 4.0, "Critical community impact"


def get_condition_score(condition: Optional[str]) -> float:
    """
    Map condition string to score (0-1 scale).

    Args:
        condition: Condition string (good/fair/poor/critical) or None

    Returns:
        Score between 0 and 1
    """
    if not condition:
        return 0.5  # neutral default

    normalized = condition.strip().lower()

    condition_scores = {
        "good": 0.1,
        "fair": 0.3,
        "poor": 0.7,
        "critical": 0.9,
    }

    return condition_scores.get(normalized, 0.5)


def calculate_priority_score(
    severity_score: float,
    relaying_score: float,
    support_score: float,
    road_importance_score: float,
    condition_score: float,
    extra_penalty: float = 0.0,
) -> float:
    """
    Calculate unified priority score using weighted formula.

    Formula:
    priority_score = (severity_score × 0.4) +
                     (relaying_score × 0.25) +
                     (support_score × 0.2) +
                     (road_importance_score × 0.1) +
                     (condition_score × 0.05)

    All input scores should be normalized to 0-4 or 0-1 scale depending on component.
    Additional penalty applied for extra factors.

    Args:
        severity_score: Damage severity (0-4 scale)
        relaying_score: Recency/relaying (0-4 scale)
        support_score: Community impact (0-4 scale)
        road_importance_score: Road importance (0-4 scale)
        condition_score: Road condition (0-1 scale)
        extra_penalty: Additional penalty for extra factors (0-1 scale)

    Returns:
        Unified priority score
    """
    priority_score = (
        (severity_score * 0.4)
        + (relaying_score * 0.25)
        + (support_score * 0.2)
        + (road_importance_score * 0.1)
        + (condition_score * 0.05)
    )

    # Apply extra penalty if significant extra factors present
    priority_score += extra_penalty

    return priority_score


def normalize_priority_score(raw_priority_score: float) -> Tuple[float, str]:
    """
    Normalize raw priority score to 0-100 scale and assign priority level.

    Mapping:
    - 1.0-1.5 = low
    - 1.5-2.5 = moderate
    - 2.5-3.5 = high
    - > 3.5 = critical

    Args:
        raw_priority_score: Raw priority score (typically 0-4)

    Returns:
        Tuple of (normalized_score: float (0-100), priority_level: str)
    """
    # Normalize to 0-100 scale (assuming typical range is 0-4)
    normalized = (raw_priority_score / 4.0) * 100.0
    normalized = max(0.0, min(100.0, normalized))

    if raw_priority_score < 1.5:
        priority_level = "low"
    elif raw_priority_score < 2.5:
        priority_level = "moderate"
    elif raw_priority_score < 3.5:
        priority_level = "high"
    else:
        priority_level = "critical"

    return normalized, priority_level


def calculate_road_health_index(severity_score: float) -> float:
    """
    Calculate road health index from 0 to 100.

    Logic: road_health_index = 100 - normalized_damage_penalty

    Args:
        severity_score: Normalized severity score (typically 0-4)

    Returns:
        Road health index (0-100)
    """
    # Convert severity (0-4 scale) to damage penalty (0-100)
    damage_penalty = (severity_score / 4.0) * 100.0
    health_index = 100.0 - damage_penalty
    return max(0.0, min(100.0, health_index))


def calculate_extra_penalty(
    weather_exposure: Optional[str] = None,
    flood_prone: Optional[bool] = None,
    historical_damage_count: Optional[int] = None,
    repeated_complaints_count: Optional[int] = None,
    traffic_density: Optional[str] = None,
    school_nearby: Optional[bool] = None,
) -> float:
    """
    Calculate extra penalty from optional factors.

    Args:
        weather_exposure: Optional weather exposure level
        flood_prone: Optional boolean indicating flood-prone area
        historical_damage_count: Optional historical damage count
        repeated_complaints_count: Optional repeated complaints count
        traffic_density: Optional traffic density level
        school_nearby: Optional boolean for school/hospital nearby

    Returns:
        Extra penalty adjustment (typically 0-0.5)
    """
    penalty = 0.0

    if weather_exposure and weather_exposure.lower() in ("high", "severe", "extreme"):
        penalty += 0.1

    if flood_prone:
        penalty += 0.1

    if historical_damage_count and historical_damage_count > 5:
        penalty += min(0.15, 0.05 + (historical_damage_count - 5) * 0.01)

    if repeated_complaints_count and repeated_complaints_count > 3:
        penalty += min(0.15, 0.05 + (repeated_complaints_count - 3) * 0.02)

    if traffic_density and traffic_density.lower() in ("high", "very high", "extreme"):
        penalty += 0.1

    if school_nearby:
        penalty += 0.05

    return min(0.5, penalty)  # Cap the extra penalty
