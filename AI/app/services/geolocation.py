from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut
import asyncio


async def get_location_from_gps(latitude: float, longitude: float) -> str:
    """Reverse geocode GPS coordinates to get location name."""
    try:
        geolocator = Nominatim(user_agent="road_track_ai")
        
        # Run in thread pool to avoid blocking
        location = await asyncio.to_thread(
            geolocator.reverse,
            f"{latitude}, {longitude}",
            language='en'
        )
        
        if location:
            # Extract useful parts: city, state, country
            address_parts = location.address.split(",")
            if len(address_parts) >= 3:
                return f"{address_parts[-3].strip()}, {address_parts[-2].strip()}"
            return location.address
        
        return None
    except GeocoderTimedOut:
        return None
    except Exception:
        return None


def extract_gps_from_exif(exif_gps: dict) -> tuple:
    """Extract latitude and longitude from EXIF GPS data."""
    try:
        if not exif_gps:
            return None, None
        
        # GPS IFD tags
        gps_latitude_ref = exif_gps.get(1)  # GPSLatitudeRef (N/S)
        gps_latitude = exif_gps.get(2)  # GPSLatitude
        gps_longitude_ref = exif_gps.get(3)  # GPSLongitudeRef (E/W)
        gps_longitude = exif_gps.get(4)  # GPSLongitude
        
        if not all([gps_latitude_ref, gps_latitude, gps_longitude_ref, gps_longitude]):
            return None, None
        
        # Convert DMS (Degree, Minute, Second) to decimal
        lat = _dms_to_decimal(gps_latitude, gps_latitude_ref)
        lon = _dms_to_decimal(gps_longitude, gps_longitude_ref)
        
        return lat, lon
    except Exception:
        return None, None


def _dms_to_decimal(dms: tuple, ref: str) -> float:
    """Convert DMS coordinates to decimal format."""
    degrees = dms[0]
    minutes = dms[1] / 60
    seconds = dms[2] / 3600
    
    decimal = degrees + minutes + seconds
    
    if ref in ['S', 'W']:
        decimal = -decimal
    
    return decimal
