#!/bin/bash
# Test script for RoadTrack AI API
# Usage: ./test_api.sh <image_file>

if [ -z "$1" ]; then
    echo "Usage: ./test_api.sh <image_file>"
    echo "Example: ./test_api.sh road_damage.jpg"
    exit 1
fi

IMAGE_FILE="$1"

if [ ! -f "$IMAGE_FILE" ]; then
    echo "Error: Image file not found: $IMAGE_FILE"
    exit 1
fi

echo "🧪 Testing RoadTrack AI API"
echo "============================"
echo ""
echo "📸 Image: $IMAGE_FILE"
echo ""

# Test the analyze endpoint
curl -X POST http://localhost:8000/api/v1/analyze \
  -F "image=@$IMAGE_FILE" \
  -F "location=Tumkur Road, Bangalore" \
  -F "authority=National Highways Authority of India (NHAI)" \
  -F "road_type=NH" \
  -F "last_relaying_date=2022-06-15" \
  -F "support_count=8" \
  -F "condition=poor" \
  -F "traffic_density=high" \
  -F "school_or_hospital_nearby=true" \
  -F "weather_exposure=moderate" \
  -F "flood_prone_area=false" \
  -F "historical_damage_count=3" \
  -F "repeated_complaints_count=2" \
  -H "Content-Type: multipart/form-data" \
  -w "\n\nHTTP Status: %{http_code}\n"

echo ""
echo "✓ Test complete"
