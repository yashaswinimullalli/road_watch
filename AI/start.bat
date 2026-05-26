@echo off
REM Quick Start Script for RoadTrack AI (Windows)

echo.
echo 🚀 RoadTrack AI - Quick Start
echo ==============================
echo.

REM Check Python version
echo 📋 Checking Python version...
python --version

REM Create virtual environment
echo.
echo 🔧 Creating virtual environment...
if exist ".venv" (
    echo    ✓ Virtual environment already exists
) else (
    python -m venv .venv
    echo    ✓ Virtual environment created
)

REM Activate virtual environment
echo.
echo ⚡ Activating virtual environment...
call .venv\Scripts\activate.bat
echo    ✓ Virtual environment activated

REM Install dependencies
echo.
echo 📦 Installing dependencies...
pip install -q -r requirements.txt
echo    ✓ Dependencies installed

REM Check model
echo.
echo 🤖 Checking model...
if exist "app\models\pothole.pt" (
    echo    ✓ Model found at app\models\pothole.pt
) else (
    echo    ⚠ Model NOT found at app\models\pothole.pt
    echo    Please ensure your YOLOv8 classification model is at that location
)

REM Start server
echo.
echo 🌐 Starting FastAPI server...
echo.
echo The API will be available at:
echo   - Main:     http://localhost:8000
echo   - Docs:     http://localhost:8000/docs
echo   - ReDoc:    http://localhost:8000/redoc
echo.
echo Press CTRL+C to stop the server
echo.

uvicorn app.main:app --reload

pause
