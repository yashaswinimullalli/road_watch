"""
Date utility functions for relaying score calculation.
"""

from datetime import datetime, date
from typing import Tuple


def parse_date(date_str: str) -> date:
    """
    Parse a date string in YYYY-MM-DD format.

    Args:
        date_str: Date string in YYYY-MM-DD format

    Returns:
        date object

    Raises:
        ValueError: If date string is not valid
    """
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError as e:
        raise ValueError(f"Invalid date format. Expected YYYY-MM-DD, got {date_str}") from e


def get_days_since_relaying(last_relaying_date_str: str) -> int:
    """
    Calculate days since last road relaying.

    Args:
        last_relaying_date_str: Date string in YYYY-MM-DD format

    Returns:
        Number of days since relaying (positive integer)

    Raises:
        ValueError: If date is in the future or invalid
    """
    relaying_date = parse_date(last_relaying_date_str)
    today = date.today()

    if relaying_date > today:
        raise ValueError(f"Relaying date cannot be in the future: {last_relaying_date_str}")

    days_since = (today - relaying_date).days
    return max(0, days_since)


def get_relaying_score(days_since_relaying: int) -> Tuple[float, str]:
    """
    Derive a recency score based on days since last relaying.

    Scoring bands:
    - < 6 months (180 days) = 4.0 (highest accountability)
    - 6-12 months (180-365 days) = 3.0 (high)
    - 1-3 years (365-1095 days) = 2.0 (medium)
    - > 3 years = 1.0 (low)

    Args:
        days_since_relaying: Number of days since last relaying

    Returns:
        Tuple of (score: float, category: str)
    """
    if days_since_relaying < 180:
        return 4.0, "Recently relayed"
    elif days_since_relaying < 365:
        return 3.0, "6-12 months since relaying"
    elif days_since_relaying < 1095:
        return 2.0, "1-3 years since relaying"
    else:
        return 1.0, ">3 years since relaying"
