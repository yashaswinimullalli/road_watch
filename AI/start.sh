#!/bin/bash
# Quick Start Script for RoadTrack AI

echo "🚀 RoadTrack AI - Quick Start"
echo "=============================="
echo ""

# Check Python version
echo "📋 Checking Python version..."
python --version

# Create virtual environment
echo ""
echo "🔧 Creating virtual environment..."
if [ -d ".venv" ]; then
    echo "   ✓ Virtual environment already exists"
else
    python -m venv .venv
    echo "   ✓ Virtual environment created"
fi

# Activate virtual environment
echo ""
echo "⚡ Activating virtual environment..."
source .venv/bin/activate || . .venv/Scripts/activate
echo "   ✓ Virtual environment activated"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pip install -q -r requirements.txt
echo "   ✓ Dependencies installed"

# Check model
echo ""
echo "🤖 Checking model..."
if [ -f "app/models/pothole.pt" ]; then
    echo "   ✓ Model found at app/models/pothole.pt"
else
    echo "   ⚠ Model NOT found at app/models/pothole.pt"
    echo "   Please ensure your YOLOv8 classification model is at that location"
fi

# Start server
echo ""
echo "🌐 Starting FastAPI server..."
echo ""
echo "The API will be available at:"
echo "  - Main:     http://localhost:8000"
echo "  - Docs:     http://localhost:8000/docs"
echo "  - ReDoc:    http://localhost:8000/redoc"
echo ""
echo "Press CTRL+C to stop the server"
echo ""

uvicorn app.main:app --reload
