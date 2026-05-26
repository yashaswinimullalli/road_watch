"""
Request schemas for the road damage analysis API.
"""

from typing import Optional
from pydantic import BaseModel, Field


class AnalyzeRoadDamageRequest(BaseModel):
    """
    Schema for multipart form data request to analyze road damage.
    Image file is handled separately by FastAPI.
    """

    location: str = Field(..., description="Road location (e.g., 'Tumkur Road, Bangalore')")
    authority: str = Field(..., description="Responsible authority (e.g., 'NHAI')")
    road_type: str = Field(..., description="Road classification (NH, SH, MDR, ODR, Local Road)")
    last_relaying_date: str = Field(..., description="Date of last road relaying in YYYY-MM-DD format")
    support_count: int = Field(..., description="Number of civic complaints/support count", ge=0)
    condition: Optional[str] = Field(None, description="Optional road condition (good/fair/poor/critical)")
    traffic_density: Optional[str] = Field(None, description="Optional traffic density level")
    school_or_hospital_nearby: Optional[bool] = Field(None, description="Is there a school or hospital nearby?")
    weather_exposure: Optional[str] = Field(None, description="Optional weather exposure level")
    flood_prone_area: Optional[bool] = Field(None, description="Is the area flood-prone?")
    historical_damage_count: Optional[int] = Field(None, description="Historical damage count", ge=0)
    repeated_complaints_count: Optional[int] = Field(None, description="Number of repeated complaints", ge=0)
