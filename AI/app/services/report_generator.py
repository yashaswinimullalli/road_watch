"""
Report generator service.
Produces formal authority-facing reports.
"""

from typing import Optional


def generate_authority_report(
    location: str,
    authority: str,
    road_type: str,
    damage_type: str,
    confidence: float,
    severity_level: str,
    severity_score: float,
    road_health_index: float,
    last_relaying_date: str,
    support_count: int,
    priority_level: str,
    priority_score: float,
    road_importance: str,
) -> str:
    """
    Generate a formal, government-style report addressed to the responsible authority.

    Args:
        location: Road location
        authority: Responsible authority
        road_type: Road classification
        damage_type: Type of damage detected
        confidence: Model confidence (0-1)
        severity_level: Severity level (low/medium/high/critical)
        severity_score: Numeric severity score
        road_health_index: Road health index (0-100)
        last_relaying_date: Date of last relaying
        support_count: Number of civic complaints
        priority_level: Priority level (low/moderate/high/critical)
        priority_score: Numeric priority score
        road_importance: Road importance category

    Returns:
        Formatted authority report as string
    """
    # Format confidence as percentage
    confidence_pct = confidence * 100

    # Determine recommendation based on priority level
    if priority_level == "critical":
        recommendation = (
            "IMMEDIATE ACTION REQUIRED. Emergency inspection and expedited repair "
            "are strongly recommended. A site visit should be scheduled within 48 hours."
        )
    elif priority_level == "high":
        recommendation = (
            "Urgent intervention advised. Inspection and repair should be prioritized "
            "and scheduled within 1-2 weeks to prevent further deterioration."
        )
    elif priority_level == "moderate":
        recommendation = (
            "Scheduled maintenance recommended. The road requires attention within "
            "the next 1-3 months to maintain acceptable service standards."
        )
    else:
        recommendation = (
            "Routine monitoring is advised. No immediate intervention is required, "
            "but the area should be included in the regular maintenance schedule."
        )

    # Generate report
    report = f"""
{'=' * 80}
ROAD DAMAGE ASSESSMENT REPORT
{'=' * 80}

AUTHORITY: {authority}
{'=' * 80}

LOCATION:
  {location}

ROAD CLASSIFICATION: {road_type}

ASSESSMENT DETAILS:
  Date of Assessment: (Current Date)
  Model Detection Method: YOLOv8 Classification-based Analysis
  Detection Confidence: {confidence_pct:.1f}%

DAMAGE FINDINGS:
  Damage Type Detected: {damage_type.upper()}
  Severity Level: {severity_level.upper()}
  Severity Score: {severity_score:.2f}/4.0
  Road Health Index: {road_health_index:.1f}/100

ROAD CONDITION ANALYSIS:
  Last Relaying Date: {last_relaying_date}
  Community Impact (Support Count): {support_count} complaints/reports
  Strategic Importance: {road_importance}

PRIORITY ASSESSMENT:
  Priority Level: {priority_level.upper()}
  Priority Score: {priority_score:.2f}/4.0

RECOMMENDATION:
  {recommendation}

ACTIONABLE NEXT STEPS:
  1. Conduct field verification of the automated assessment
  2. Assess repair requirements (patch, pothole filling, or surface treatment)
  3. Determine resource allocation and repair timeline
  4. Coordinate repair scheduling based on traffic and weather conditions
  5. Monitor area for recurring damage patterns

TECHNICAL NOTES:
  This assessment is based on automated image classification and provided metadata.
  Field verification by qualified personnel is recommended before final decision-making.
  Historical and repeated complaint data should be reviewed for pattern analysis.

AUTHORITY ACKNOWLEDGMENT:
  This report is generated for official use by {authority}.
  It supports data-driven decision-making for road maintenance prioritization.

{'=' * 80}
End of Report
{'=' * 80}
"""

    return report.strip()


def generate_summary(
    damage_type: str,
    severity_level: str,
    priority_level: str,
    location: str,
) -> str:
    """
    Generate a brief actionable summary.

    Args:
        damage_type: Type of damage
        severity_level: Severity level
        priority_level: Priority level
        location: Road location

    Returns:
        Brief summary string
    """
    # Map priority to action
    action_map = {
        "critical": "Immediate inspection and repair are critical.",
        "high": "Urgent intervention is recommended.",
        "moderate": "Scheduled maintenance should be prioritized.",
        "low": "Monitoring is advised. No emergency action needed.",
    }

    action = action_map.get(priority_level, "Assessment completed.")

    summary = (
        f"{damage_type.capitalize()} damage detected in {location}. "
        f"Severity: {severity_level.upper()}. {action}"
    )

    return summary
