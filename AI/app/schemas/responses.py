"""
Response schemas for the road damage analysis API.
"""

from pydantic import BaseModel
from typing import Optional


class AnalyzeRoadDamageResponse(BaseModel):
    """
    Comprehensive response containing damage classification, severity, priority, and authority report.
    """

    success: bool = True
    damage_type: str = ""  # e.g., "potholes", "cracks", "uneven surfaces", "unknown"
    confidence: float = 0.0  # Model confidence (0-1)
    severity: str = ""  # low, medium, high, critical
    severity_score: float = 0.0  # Numeric severity score
    road_health_index: float = 0.0  # 0-100 scale
    relaying_score: float = 0.0  # Recency/relaying score
    support_score: float = 0.0  # Community impact score
    road_importance_score: float = 0.0  # Strategic importance score
    priority_score: float = 0.0  # Raw priority score
    priority_score_normalized: float = 0.0  # 0-100 normalized priority
    priority_level: str = ""  # low, moderate, high, critical
    location: str = ""
    authority: str = ""
    summary: str = ""  # Brief actionable summary
    report: str = ""  # Full formatted authority report


class ErrorResponse(BaseModel):
    """Error response schema."""

    success: bool = False
    error: str = ""
    details: Optional[str] = None
