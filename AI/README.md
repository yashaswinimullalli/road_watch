# RoadTrack AI - Road Damage Assessment Microservice

**AI-powered road damage analysis and authority reporting microservice**

A production-ready FastAPI service that classifies road damage, calculates severity and priority scores, and generates formal reports for highway authorities. Built for the hackathon with YOLOv8 classification model.

## 🎯 Core Functionality

- **Image Classification**: YOLOv8-based classification for damage types (potholes, cracks, uneven surfaces, unknown)
- **Severity Analysis**: Maps model confidence to severity levels (low/medium/high/critical)
- **Smart Priority Scoring**: Multi-variable weighted scoring system considering:
  - AI damage severity
  - Time since last relaying
  - Community impact (support count)
  - Road importance (NH/SH/MDR/ODR/Local)
  - Optional factors (weather, flood-prone, traffic density, etc.)
- **Authority Reports**: Formal, government-style reports suitable for highway authorities
- **Structured JSON Output**: Complete analysis breakdown with component scores
- **Model Singleton**: Loads model once on startup for efficiency
- **Input Validation**: Comprehensive validation with clear error messages

## ✨ Features

✅ FastAPI with async/await for high concurrency
✅ Auto-generated Swagger UI and ReDoc documentation
✅ Modular service architecture (detector, severity, priority, reporting)
✅ Comprehensive Pydantic schemas for request/response validation
✅ Support for 13+ damage and road factors
✅ CORS enabled for cross-origin requests
✅ Health check endpoints for monitoring
✅ Production-ready error handling

## 📋 Requirements

- **Python**: 3.11+
- **FastAPI**: 0.104.1
- **Uvicorn**: 0.24.0 (ASGI server)
- **Ultralytics**: 8.0.220 (YOLO framework)
- **PyTorch**: 2.1.1
- **Pillow**: 10.1.0 (image processing)
- **OpenCV**: 4.8.1.78 (computer vision)
- **Pydantic**: 2.5.0 (data validation)

## 🏗️ Project Structure

```
Road-track AI/
├── app/
│   ├── main.py                 # FastAPI app with model loader
│   ├── models/
│   │   └── pothole.pt          # YOLOv8 classification model
│   ├── routes/
│   │   ├── __init__.py
│   │   └── analyze.py          # POST /api/v1/analyze endpoint
│   ├── services/
│   │   ├── __init__.py
│   │   ├── detector.py         # Model loading & inference
│   │   ├── severity.py         # Severity calculation
│   │   ├── priority.py         # Priority scoring
│   │   ├── report_generator.py # Report & summary generation
│   │   └── summary.py          # Summary helpers
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── requests.py         # Request Pydantic models
│   │   └── responses.py        # Response Pydantic models
│   └── utils/
│       ├── __init__.py
│       ├── date_utils.py       # Date parsing & relaying score
│       └── scoring_utils.py    # Scoring algorithms
├── requirements.txt
└── README.md
```

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
cd "Road-track AI"
```

### 2. Create Virtual Environment

```bash
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Verify Model File

Ensure the model exists at `app/models/pothole.pt`:

```bash
ls app/models/pothole.pt  # macOS/Linux
dir app\models\pothole.pt  # Windows
```

If missing, copy your trained pothole classification model to that location.

## 🚀 Running the Service

### Start Development Server

```bash
uvicorn app.main:app --reload
```

Output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete
✓ YOLOv8 classification model loaded successfully
```

### Production Deployment

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 📡 API Endpoints

### POST `/api/v1/analyze` - Analyze Road Damage

**Request** (multipart/form-data):

```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -F "image=@road_image.jpg" \
  -F "location=Tumkur Road, Bangalore" \
  -F "authority=National Highways Authority of India" \
  -F "road_type=NH" \
  -F "last_relaying_date=2022-06-15" \
  -F "support_count=8" \
  -F "condition=poor" \
  -F "traffic_density=high" \
  -F "school_or_hospital_nearby=true" \
  -F "weather_exposure=moderate"
```

**Form Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `image` | File | ✅ | Road damage image (JPEG/PNG) |
| `location` | String | ✅ | Road location (e.g., "Tumkur Road, Bangalore") |
| `authority` | String | ✅ | Responsible authority (e.g., "NHAI", "State PWD") |
| `road_type` | String | ✅ | Road classification: NH, SH, MDR, ODR, Local Road |
| `last_relaying_date` | String | ✅ | Last relaying date in YYYY-MM-DD format |
| `support_count` | Integer | ✅ | Number of civic complaints/support (≥0) |
| `condition` | String | ❌ | Road condition: good/fair/poor/critical |
| `traffic_density` | String | ❌ | Traffic level: low/medium/high/very high/extreme |
| `school_or_hospital_nearby` | Boolean | ❌ | Is school/hospital nearby? |
| `weather_exposure` | String | ❌ | Weather exposure: low/moderate/high/extreme |
| `flood_prone_area` | Boolean | ❌ | Is area flood-prone? |
| `historical_damage_count` | Integer | ❌ | Count of previous damages (≥0) |
| `repeated_complaints_count` | Integer | ❌ | Count of repeated complaints (≥0) |

**Response** (200 OK):

```json
{
  "success": true,
  "damage_type": "potholes",
  "confidence": 0.9834,
  "severity": "critical",
  "severity_score": 3.93,
  "road_health_index": 1.8,
  "relaying_score": 4.0,
  "support_score": 2.0,
  "road_importance_score": 4.0,
  "priority_score": 3.71,
  "priority_score_normalized": 92.8,
  "priority_level": "critical",
  "location": "Tumkur Road, Bangalore",
  "authority": "National Highways Authority of India",
  "summary": "Potholes damage detected in Tumkur Road, Bangalore. Severity: CRITICAL. Immediate inspection and repair are critical.",
  "report": "================================================================================\nROAD DAMAGE ASSESSMENT REPORT\n[... formal authority report ...]\n================================================================================"
}
```

### GET `/api/v1/health` - Health Check

```bash
curl http://localhost:8000/api/v1/health
```

Response:
```json
{
  "status": "healthy",
  "service": "RoadTrack AI",
  "version": "2.0.0"
}
```

### GET `/` - Root Information

```bash
curl http://localhost:8000/
```

## 📊 Priority Scoring System

### Component Weights

- **AI Severity**: 40% - Damage classification confidence
- **Relaying Recency**: 25% - Time since last road maintenance
- **Community Impact**: 20% - Civic complaints/support count
- **Road Importance**: 10% - Strategic importance (NH > Local)
- **Road Condition**: 5% - Optional condition assessment
- **Extra Penalty**: Up to +0.5 - Weather, flood, traffic, school factors

### Severity Levels

| Score | Level |
|-------|-------|
| 0.0-1.5 | Low |
| 1.5-2.5 | Medium |
| 2.5-3.5 | High |
| 3.5+ | Critical |

### Priority Levels

| Score | Level | Action |
|-------|-------|--------|
| 1.0-1.5 | Low | Routine monitoring |
| 1.5-2.5 | Moderate | Scheduled maintenance (1-3 months) |
| 2.5-3.5 | High | Urgent intervention (1-2 weeks) |
| > 3.5 | Critical | Immediate action (48 hours) |

## 🧮 Severity Mapping

Damage class to base severity:

| Class | Base Score |
|-------|-----------|
| Potholes | 4 |
| Cracks | 3 |
| Uneven Surfaces | 2 |
| Unknown | 1 |

Final severity = base_score × model_confidence

## 📝 Report Generation

The `/analyze` endpoint generates a formal authority report including:

- ✅ Damage findings with detection confidence
- ✅ Severity assessment
- ✅ Road health index
- ✅ Priority scoring rationale
- ✅ Actionable recommendations
- ✅ Technical notes for field verification

Reports are suitable for forwarding directly to highway authorities.

## 🔌 Integration with Backend

### Node.js Backend Example

```javascript
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function analyzeRoadDamage(imagePath, metadata) {
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));
  form.append('location', metadata.location);
  form.append('authority', metadata.authority);
  form.append('road_type', metadata.road_type);
  form.append('last_relaying_date', metadata.last_relaying_date);
  form.append('support_count', metadata.support_count);
  form.append('condition', metadata.condition);

  try {
    const response = await axios.post(
      'http://localhost:8000/api/v1/analyze',
      form,
      { headers: form.getHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Analysis failed:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
const analysis = await analyzeRoadDamage('road.jpg', {
  location: 'Tumkur Road, Bangalore',
  authority: 'NHAI',
  road_type: 'NH',
  last_relaying_date: '2022-06-15',
  support_count: 8,
  condition: 'poor'
});

console.log(analysis.summary);
console.log(analysis.report);
```

## ⚠️ Error Handling

The API returns clear error messages:

```json
{
  "success": false,
  "error": "Invalid date format",
  "details": "Expected YYYY-MM-DD, got 2022-13-45"
}
```

Status codes:
- **200**: Success
- **400**: Bad request (missing required field)
- **422**: Unprocessable entity (validation error)
- **500**: Internal server error (model inference failed)

## 🛠️ Development

### Run Tests

```bash
pytest
```

### Format Code

```bash
black app/
```

### Lint

```bash
pylint app/
```

## 📚 Architecture Notes

- **Model Singleton**: The YOLOv8 model is loaded once at startup and reused for all requests
- **Async Inference**: FastAPI is async-ready; inference itself is synchronous (GPU-bound)
- **Modular Design**: Services are separated by concern (detection, severity, priority, reporting)
- **No Database**: This is a stateless microservice; no persistence layer
- **Classification-Only**: This pipeline uses classification (not detection), so no bounding boxes

## 🎓 Example Workflow

1. User uploads road image + metadata to `/api/v1/analyze`
2. FastAPI loads image, validates inputs
3. Detector service runs YOLOv8 inference → `(damage_type, confidence)`
4. Severity service calculates severity score and level
5. Priority service computes unified score from 6+ factors
6. Report generator creates formal authority report
7. Response returns JSON with all component scores + report

## 📄 License

Built for hackathon. Use freely.

## 🤝 Support

For issues or questions, check the Swagger documentation at `/docs` or review the code structure in `app/services/`.

---

**Happy road damage detection! 🚗🛣️**

  "status": "healthy",
  "service": "Road-track AI"
}
```

### Analyze Road Image

```
POST /api/analyze-road
```

**Parameters:**
- `file` (FormData): Image file (JPEG, PNG, etc.)

**Response:**
```json
{
  "potholes_detected": 3,
  "severity": "medium",
  "road_score": 85,
  "location": "Bangalore, Karnataka",
  "message": "Analysis complete"
}
```

**Fields:**
- `potholes_detected`: Count of detected potholes (confidence > 0.5)
- `severity`: "low" (0-1), "medium" (2-4), or "high" (5+)
- `road_score`: Quality score 0-100 (100 = no damage, 0 = severe)
- `location`: City/state if GPS metadata available, null otherwise
- `message`: Status message

## 🧠 How It Works

### 1. Image Upload
User uploads a road image via `/api/analyze-road`

### 2. Preprocessing
- Image bytes extracted
- EXIF GPS data extracted (if available)
- Image converted to OpenCV format

### 3. YOLO Inference
- Image passed to YOLOv8 model
- Detections filtered by confidence threshold (0.5)
- Pothole count extracted

### 4. Analysis
- **Severity**: Based on pothole count
  - 0-1 potholes → **low**
  - 2-4 potholes → **medium**
  - 5+ potholes → **high**

- **Road Score**: 100 - (pothole_count × 5), clamped to [0, 100]

### 5. Geolocation (Optional)
- If GPS data present: Reverse geocoding via GeoPy
- Returns city/state or null

### 6. Response
Returns structured JSON with all analysis data

## 🛠️ Configuration

### Confidence Threshold
Edit [app/services/detector.py](app/services/detector.py#L22):
```python
self.confidence_threshold = 0.5  # Adjust detection sensitivity
```

### Road Score Formula
Edit [app/services/severity.py](app/services/severity.py#L11):
```python
score = base_score - (pothole_count * 5)  # Modify penalty
```

### Model Path
The detector auto-detects:
1. `yolov8n.pt` (root directory)
2. `app/models/yolov8n.pt` (backup)

## 📊 Example Usage

### Using cURL

```bash
curl -X POST "http://localhost:8000/api/analyze-road" \
  -F "file=@road_image.jpg"
```

### Using Python

```python
import requests

with open("road_image.jpg", "rb") as f:
    files = {"file": f}
    response = requests.post("http://localhost:8000/api/analyze-road", files=files)
    print(response.json())
```

### Response Example

```json
{
  "potholes_detected": 2,
  "severity": "medium",
  "road_score": 90,
  "location": "Bangalore, Karnataka",
  "message": "Analysis complete"
}
```

## 🔍 Development Notes

### Async Patterns
- All I/O operations (file reading, geolocation) are async
- Database queries would use `asyncio.to_thread()` if needed

### Error Handling
- Invalid file types → 400 Bad Request
- Analysis failures → 500 Internal Server Error
- Graceful degradation: Missing GPS data doesn't fail analysis

### Performance Considerations
- YOLO model loaded once (singleton pattern)
- Image resizing optional (YOLOv8 handles most sizes)
- Geolocation uses timeout to prevent hanging

## 🚀 Production Deployment

### For production (not hackathon):
1. Use Gunicorn: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`
2. Use environment variables for configuration
3. Add request logging and monitoring
4. Implement rate limiting
5. Add input validation (file size limits)

## 📝 Notes

- **No authentication** (hackathon MVP)
- **No database** (stateless design)
- **No Docker** (raw Python for simplicity)
- **CORS enabled** for development
- **Automatic Swagger docs** via FastAPI

## 🎯 Scope

Built for hackathon MVP with focus on:
- ✅ Working inference pipeline
- ✅ Clean, readable code
- ✅ Minimal dependencies
- ✅ Quick iteration
- ❌ Avoiding over-engineering
- ❌ Avoiding enterprise boilerplate

## 📄 License

MIT

---

**Questions?** Check FastAPI docs: https://fastapi.tiangolo.com/
