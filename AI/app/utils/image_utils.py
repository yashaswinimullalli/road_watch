from PIL import Image
import io
import numpy as np


async def read_image_bytes(file) -> np.ndarray:
    """Read uploaded file and convert to OpenCV format."""
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Return a BGR-style numpy array to match the detector's expectations.
    return np.array(image)[:, :, ::-1]


def resize_image(image: np.ndarray, max_size: int = 640) -> np.ndarray:
    """Resize image to max_size while maintaining aspect ratio."""
    height, width = image.shape[:2]
    
    if max(height, width) <= max_size:
        return image
    
    scale = max_size / max(height, width)
    new_width = int(width * scale)
    new_height = int(height * scale)

    pil_image = Image.fromarray(image[:, :, ::-1])
    resized = pil_image.resize((new_width, new_height), Image.Resampling.BILINEAR)
    return np.array(resized)[:, :, ::-1]


def extract_exif_data(image_bytes: bytes) -> dict:
    """Extract EXIF metadata from image bytes."""
    try:
        image = Image.open(io.BytesIO(image_bytes))
        exif_data = image._getexif()
        
        if not exif_data:
            return {}
        
        # GPS IFD tag
        gps_ifd_ptr = 0x8825
        if gps_ifd_ptr in exif_data:
            return exif_data[gps_ifd_ptr]
        
        return {}
    except Exception:
        return {}
