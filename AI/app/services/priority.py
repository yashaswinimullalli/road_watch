"""
Priority scoring service.
Calculates unified priority score from multiple variables.
"""

from typing import Optional
from ..utils.scoring_utils import (
    get_road_importance_score,
    get_support_score,
    get_condition_score,
    calculate_priority_score,
    normalize_priority_score,
    calculate_extra_penalty,
)
from ..utils.date_utils import get_days_since_relaying, get_relaying_score


def calculate_priority(
    damage_class: str,
    severity_score: float,
    last_relaying_date: str,
    support_count: int,
    road_type: str,
    condition: Optional[str] = None,
    weather_exposure: Optional[str] = None,
    flood_prone: Optional[bool] = None,
    historical_damage_count: Optional[int] = None,
    repeated_complaints_count: Optional[int] = None,
    traffic_density: Optional[str] = None,
    school_nearby: Optional[bool] = None,
) -> dict:
    """
    Calculate comprehensive priority score with component breakdown.

    Args:
        damage_class: Type of damage detected
        severity_score: Severity score (0-4)
        last_relaying_date: Date string in YYYY-MM-DD format
        support_count: Number of civic complaints
        road_type: Road classification (NH, SH, MDR, ODR, Local Road)
        condition: Optional road condition (good/fair/poor/critical)
        weather_exposure: Optional weather exposure level
        flood_prone: Optional boolean for flood-prone area
        historical_damage_count: Optional historical damage count
        repeated_complaints_count: Optional repeated complaints count
        traffic_density: Optional traffic density level
        school_nearby: Optional boolean for school/hospital nearby

    Returns:
        Dictionary containing priority breakdown and final scores
    """
    # Calculate component scores
    relaying_score, relaying_category = get_relaying_score(
        get_days_since_relaying(last_relaying_date)
    )

    support_score_val, support_category = get_support_score(support_count)
    road_importance_score_val, road_category = get_road_importance_score(road_type)
    condition_score_val = get_condition_score(condition)

    # Calculate extra penalty for additional factors
    extra_penalty = calculate_extra_penalty(
        weather_exposure=weather_exposure,
        flood_prone=flood_prone,
        historical_damage_count=historical_damage_count,
        repeated_complaints_count=repeated_complaints_count,
        traffic_density=traffic_density,
        school_nearby=school_nearby,
    )

    # Calculate unified priority score
    raw_priority_score = calculate_priority_score(
        severity_score=severity_score,
        relaying_score=relaying_score,
        support_score=support_score_val,
        road_importance_score=road_importance_score_val,
        condition_score=condition_score_val,
        extra_penalty=extra_penalty,
    )

    # Normalize to 0-100 and get priority level
    normalized_priority, priority_level = normalize_priority_score(raw_priority_score)

    return {
        "raw_priority_score": round(raw_priority_score, 2),
        "priority_score_normalized": round(normalized_priority, 1),
        "priority_level": priority_level,
        "severity_score": round(severity_score, 2),
        "relaying_score": round(relaying_score, 2),
        "relaying_category": relaying_category,
        "support_score": round(support_score_val, 2),
        "support_category": support_category,
        "road_importance_score": round(road_importance_score_val, 2),
        "road_category": road_category,
        "condition_score": round(condition_score_val, 2),
        "extra_penalty": round(extra_penalty, 2),
    }
