# RoadTrack AI - Architecture & Deployment Guide

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Application                          │
│                     (app/main.py)                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Request Handler (Routes)                   │  │
│  │              (/api/v1/analyze)                          │  │
│  └────────────┬──────────────────────────────────────────┬─┘  │
│               │                                          │     │
│               ▼                                          ▼     │
│  ┌─────────────────────────┐         ┌──────────────────────┐ │
│  │  Image Validation       │         │  Input Validation    │ │
│  │  - Format check         │         │  - Date parsing      │ │
│  │  - File integrity       │         │  - Support count ≥0  │ │
│  └─────────────┬───────────┘         └──────────┬───────────┘ │
│                │                                │              │
│                └────────────┬───────────────────┘              │
│                             ▼                                  │
│                  ┌──────────────────────┐                      │
│                  │  Model Inference     │                      │
│                  │  (detector.py)       │                      │
│                  │                      │                      │
│                  │ YOLOv8 Classification│                      │
│                  │ ▼ damage_type        │                      │
│                  │ ▼ confidence         │                      │
│                  └─────────┬────────────┘                      │
│                            ▼                                   │
│            ┌───────────────────────────────────┐              │
│            │   Severity Calculation            │              │
│            │   (severity.py)                   │              │
│            │                                   │              │
│            │  base_score × confidence         │              │
│            │  → severity_level (low/med/high) │              │
│            │  → severity_score (0-4)          │              │
│            └────────┬────────────────────────┘              │
│                     ▼                                        │
│         ┌───────────────────────────────┐                  │
│         │  Priority Scoring             │                  │
│         │  (priority.py)                │                  │
│         │                               │                  │
│         │  Weighted Multi-Factor Score: │                  │
│         │  • Severity (40%)             │                  │
│         │  • Relaying Recency (25%)     │                  │
│         │  • Community Impact (20%)     │                  │
│         │  • Road Importance (10%)      │                  │
│         │  • Condition (5%)             │                  │
│         │  • Extra Factors (+up to 0.5) │                  │
│         │                               │                  │
│         │  → priority_score (0-4)       │                  │
│         │  → priority_level             │                  │
│         └────────┬────────────────────┘                  │
│                  ▼                                        │
│      ┌──────────────────────────────┐                  │
│      │  Report Generation           │                  │
│      │  (report_generator.py)       │                  │
│      │                              │                  │
│      │  • Formal authority report   │                  │
│      │  • Summary & recommendations │                  │
│      └─────────┬────────────────────┘                  │
│              ▼                                          │
│      ┌──────────────────────────┐                    │
│      │  JSON Response           │                    │
│      │  (response.py)           │                    │
│      │                          │                    │
│      │  • damage_type           │                    │
│      │  • confidence            │                    │
│      │  • severity_level        │                    │
│      │  • priority_level        │                    │
│      │  • All component scores  │                    │
│      │  • Full report           │                    │
│      └──────────────────────────┘                    │
│                                                       │
└─────────────────────────────────────────────────────────┘
```

## Module Responsibilities

### `services/detector.py` - Model Loading & Inference
- **Responsibility**: Load YOLOv8 classification model once, perform inference on images
- **Key Class**: `ModelLoader` (singleton pattern)
- **Key Functions**:
  - `load_model(path)` - Load PT file from disk
  - `classify_image(bytes)` - Run inference, return (class_name, confidence)
  - `validate_image_file(bytes)` - Validate image integrity
- **Output**: `(damage_type: str, confidence: float)`

### `services/severity.py` - Damage Severity Calculation
- **Responsibility**: Map damage class and confidence to severity level and score
- **Key Functions**:
  - `get_base_severity(class)` - Map class → base score (1-4)
  - `calculate_severity_score(class, confidence)` - Score = base × confidence
  - `normalize_severity_score(score)` - Map to level (low/medium/high/critical)
- **Output**: `(severity_level: str, severity_score: float)`

### `services/priority.py` - Priority Score Computation
- **Responsibility**: Combine multiple factors into unified priority score
- **Key Function**: `calculate_priority(...)` - Returns dict with:
  - `raw_priority_score`: Unified weighted score
  - `priority_level`: low/moderate/high/critical
  - Component breakdowns (relaying_score, support_score, etc.)
- **Weights**:
  - Severity: 40%
  - Relaying Recency: 25%
  - Support/Community Impact: 20%
  - Road Importance: 10%
  - Road Condition: 5%

### `services/report_generator.py` - Authority Reports
- **Responsibility**: Generate formal reports and summaries
- **Key Functions**:
  - `generate_authority_report(...)` - Formal multi-line government-style report
  - `generate_summary(...)` - Brief actionable summary (1 sentence)
- **Output**: Professional text suitable for forwarding to highway authorities

### `utils/date_utils.py` - Date Handling
- **Responsibility**: Parse dates, calculate recency scores
- **Key Functions**:
  - `parse_date(string)` - Parse YYYY-MM-DD
  - `get_days_since_relaying(date_str)` - Days elapsed
  - `get_relaying_score(days)` - Recency score (1-4)
- **Scoring**: Recently damaged roads = higher accountability

### `utils/scoring_utils.py` - Scoring Algorithms
- **Responsibility**: Calculate all component scores used in priority
- **Key Functions**:
  - `normalize_road_type(string)` - NH/SH/MDR/ODR/Local Road
  - `get_road_importance_score(type)` - Road importance (1-4)
  - `get_support_score(count)` - Community impact (1-4)
  - `get_condition_score(string)` - Road condition (0-1)
  - `calculate_priority_score(...)` - Unified formula
  - `calculate_extra_penalty(...)` - Weather, flood, traffic factors
  - `calculate_road_health_index(score)` - Health metric (0-100)

### `schemas/requests.py` - Request Validation
- **Responsibility**: Validate and parse incoming request data
- **Pydantic Model**: `AnalyzeRoadDamageRequest`
- **Fields**: location, authority, road_type, date, support_count, optional factors

### `schemas/responses.py` - Response Structure
- **Responsibility**: Define response format
- **Pydantic Model**: `AnalyzeRoadDamageResponse`
- **Fields**: All analysis results, scores, and report

### `routes/analyze.py` - API Endpoint
- **Responsibility**: Orchestrate complete analysis pipeline
- **Endpoint**: `POST /api/v1/analyze` (multipart/form-data)
- **Workflow**:
  1. Validate inputs
  2. Read and validate image
  3. Run detector service
  4. Calculate severity
  5. Calculate priority
  6. Generate report
  7. Return JSON response

### `main.py` - Application Entry Point
- **Responsibility**: Initialize FastAPI app, load model on startup
- **Lifespan Manager**: Model loading happens once at app startup
- **CORS**: Enable cross-origin requests
- **Routes**: Include all routers

## Data Flow

```
User Request (multipart/form-data)
    │
    ├─ image (bytes)
    ├─ location (string)
    ├─ authority (string)
    ├─ road_type (string)
    ├─ last_relaying_date (YYYY-MM-DD)
    ├─ support_count (int)
    └─ optional factors (string/bool/int)
    │
    ▼
Validation Layer (routes/analyze.py)
    │
    ├─ Validate image format & integrity
    ├─ Validate date format
    ├─ Validate support_count ≥ 0
    └─ Validate required fields
    │
    ▼
Model Inference (services/detector.py)
    │
    └─ YOLOv8 Classification
        └─ Returns: (damage_type, confidence)
    │
    ▼
Severity Calculation (services/severity.py)
    │
    ├─ Get base severity for damage_type
    ├─ Multiply by confidence
    └─ Map to severity_level
    │
    ▼
Priority Calculation (services/priority.py)
    │
    ├─ Get relaying_score from date
    ├─ Get support_score from count
    ├─ Get road_importance_score from road_type
    ├─ Get condition_score (optional)
    ├─ Calculate extra_penalty from optional factors
    └─ Weighted formula → priority_score & priority_level
    │
    ▼
Report Generation (services/report_generator.py)
    │
    ├─ Generate formal authority report
    └─ Generate summary
    │
    ▼
JSON Response
    │
    └─ All scores, levels, report, summary
```

## Scoring Formulas

### Severity Score
```
severity_score = base_severity × model_confidence
    where base_severity = {
        potholes: 4,
        cracks: 3,
        uneven surfaces: 2,
        unknown: 1
    }
Range: 0.0-4.0
```

### Priority Score (Unified)
```
priority_score = 
    (severity_score × 0.40) +
    (relaying_score × 0.25) +
    (support_score × 0.20) +
    (road_importance_score × 0.10) +
    (condition_score × 0.05) +
    extra_penalty

Where:
    severity_score: 0-4
    relaying_score: 1-4 (based on days since maintenance)
    support_score: 1-4 (based on complaint count)
    road_importance_score: 1-4 (NH=4, SH=3.5, MDR=2.5, ODR=1.5, Local=1)
    condition_score: 0-1 (good=0.1, fair=0.3, poor=0.7, critical=0.9)
    extra_penalty: 0-0.5 (weather, flood, traffic, school factors)

Range: ~1.0-4.5
```

### Road Health Index
```
road_health_index = 100 - (normalized_damage_penalty × 100)
    where normalized_damage_penalty = severity_score / 4.0
Range: 0-100
```

### Relaying Score (Time-Based)
```
if days_since_relaying < 180:
    score = 4.0  # Recently damaged = high accountability
elif days_since_relaying < 365:
    score = 3.0
elif days_since_relaying < 1095:
    score = 2.0
else:
    score = 1.0  # Long ago relayed = lower concern
```

## Severity & Priority Levels

### Severity Levels
| Score | Level |
|-------|-------|
| 0.0-1.5 | low |
| 1.5-2.5 | medium |
| 2.5-3.5 | high |
| 3.5+ | critical |

### Priority Levels
| Score | Level | Typical Action |
|-------|-------|-----------------|
| 1.0-1.5 | low | Routine monitoring |
| 1.5-2.5 | moderate | Maintenance within 1-3 months |
| 2.5-3.5 | high | Urgent repair within 1-2 weeks |
| > 3.5 | critical | Immediate action within 48 hours |

## Deployment

### Development
```bash
uvicorn app.main:app --reload
```

### Production
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker (if needed)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Performance Notes

- **Model Loading**: ~2-5 seconds on first request (cached after)
- **Inference Time**: ~100-300ms per image (GPU dependent)
- **Total Request Time**: ~500ms-1s (including validation, scoring, report generation)
- **Memory Usage**: ~2-4 GB (model + PyTorch + OpenCV)
- **Throughput**: ~2-4 requests/second on single worker

## Error Handling

All errors return HTTP status with JSON error response:

```json
{
  "success": false,
  "error": "Error category",
  "details": "Detailed message"
}
```

Status Codes:
- **200**: Success
- **400**: Bad request (malformed input)
- **422**: Validation error (invalid values)
- **500**: Server error (model inference failure)

## Testing

### Manual Test with curl
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -F "image=@road.jpg" \
  -F "location=Road Name, City" \
  -F "authority=NHAI" \
  -F "road_type=NH" \
  -F "last_relaying_date=2022-06-15" \
  -F "support_count=10"
```

### Health Check
```bash
curl http://localhost:8000/api/v1/health
```

## Key Design Decisions

1. **Classification, not Detection**: Model outputs damage class + confidence, not bounding boxes
2. **Singleton Model Loading**: Model loaded once at startup, reused for all requests
3. **Stateless Design**: Each request is independent; no persistent state
4. **Modular Services**: Each service handles one domain, easy to test and extend
5. **Weighted Scoring**: Priority considers multiple factors with configurable weights
6. **Formal Reporting**: Output suitable for government submission without modification
7. **Graceful Degradation**: Optional factors don't break the system if missing

---

**Last Updated**: Complete V2 Rewrite (Classification Pipeline)
