"""
API route for road damage analysis.
Orchestrates the complete analysis pipeline.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from ..schemas.requests import AnalyzeRoadDamageRequest
from ..schemas.responses import AnalyzeRoadDamageResponse, ErrorResponse
from ..services.detector import classify_image, validate_image_file
from ..services.severity import classify_severity
from ..services.priority import calculate_priority
from ..services.report_generator import generate_authority_report, generate_summary
from ..utils.scoring_utils import calculate_road_health_index
from ..utils.date_utils import parse_date

router = APIRouter(
    prefix="/api/v1",
    tags=["analysis"],
)


@router.post(
    "/analyze",
    response_model=AnalyzeRoadDamageResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Bad request"},
        422: {"model": ErrorResponse, "description": "Validation error"},
        500: {"model": ErrorResponse, "description": "Internal server error"},
    },
)
async def analyze_road_damage(
    image: UploadFile = File(..., description="Road damage image file"),
    location: str = Form(..., description="Road location"),
    authority: str = Form(..., description="Responsible authority"),
    road_type: str = Form(..., description="Road classification"),
    last_relaying_date: str = Form(..., description="Last relaying date (YYYY-MM-DD)"),
    support_count: int = Form(..., description="Number of civic complaints"),
    condition: Optional[str] = Form(None, description="Optional road condition"),
    traffic_density: Optional[str] = Form(None, description="Optional traffic density"),
    school_or_hospital_nearby: Optional[bool] = Form(None, description="School/hospital nearby"),
    weather_exposure: Optional[str] = Form(None, description="Optional weather exposure"),
    flood_prone_area: Optional[bool] = Form(None, description="Flood-prone area"),
    historical_damage_count: Optional[int] = Form(None, description="Historical damage count"),
    repeated_complaints_count: Optional[int] = Form(None, description="Repeated complaints"),
) -> AnalyzeRoadDamageResponse:
    """
    Analyze road damage from an uploaded image and metadata.

    This endpoint:
    1. Validates the uploaded image
    2. Runs YOLOv8 classification inference
    3. Calculates damage severity
    4. Computes priority score with multiple variables
    5. Generates authority report
    6. Returns structured JSON response

    Returns:
        AnalyzeRoadDamageResponse with complete analysis
    """
    try:
        # Validate input parameters
        if not location or not location.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Location is required",
            )

        if not authority or not authority.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Authority is required",
            )

        if not road_type or not road_type.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Road type is required",
            )

        if support_count < 0:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Support count cannot be negative",
            )

        # Validate date format
        try:
            relaying_date_obj = parse_date(last_relaying_date)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid date format: {str(e)}",
            )

        # Read image file
        image_bytes = await image.read()

        if not image_bytes:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Image file is empty",
            )

        # Validate image
        try:
            validate_image_file(image_bytes)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid image file: {str(e)}",
            )

        # Run model inference
        try:
            damage_type, confidence = classify_image(image_bytes)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Model inference failed: {str(e)}",
            )

        # Calculate severity
        severity_level, severity_score = classify_severity(damage_type, confidence)

        # Calculate road health index
        road_health_index = calculate_road_health_index(severity_score)

        # Calculate priority and all component scores
        priority_data = calculate_priority(
            damage_class=damage_type,
            severity_score=severity_score,
            last_relaying_date=last_relaying_date,
            support_count=support_count,
            road_type=road_type,
            condition=condition,
            weather_exposure=weather_exposure,
            flood_prone=flood_prone_area,
            historical_damage_count=historical_damage_count,
            repeated_complaints_count=repeated_complaints_count,
            traffic_density=traffic_density,
            school_nearby=school_or_hospital_nearby,
        )

        # Generate summary
        summary = generate_summary(damage_type, severity_level, priority_data["priority_level"], location)

        # Generate formal authority report
        report = generate_authority_report(
            location=location,
            authority=authority,
            road_type=road_type,
            damage_type=damage_type,
            confidence=confidence,
            severity_level=severity_level,
            severity_score=severity_score,
            road_health_index=road_health_index,
            last_relaying_date=last_relaying_date,
            support_count=support_count,
            priority_level=priority_data["priority_level"],
            priority_score=priority_data["raw_priority_score"],
            road_importance=priority_data["road_category"],
        )

        # Build response
        response = AnalyzeRoadDamageResponse(
            success=True,
            damage_type=damage_type,
            confidence=round(confidence, 4),
            severity=severity_level,
            severity_score=round(severity_score, 2),
            road_health_index=round(road_health_index, 1),
            relaying_score=priority_data["relaying_score"],
            support_score=priority_data["support_score"],
            road_importance_score=priority_data["road_importance_score"],
            priority_score=priority_data["raw_priority_score"],
            priority_score_normalized=priority_data["priority_score_normalized"],
            priority_level=priority_data["priority_level"],
            location=location,
            authority=authority,
            summary=summary,
            report=report,
        )

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error during analysis: {str(e)}",
        )


@router.get("/health", tags=["health"])
async def health_check() -> dict:
    """Health check endpoint."""
    return {"status": "healthy", "service": "RoadTrack AI Microservice"}