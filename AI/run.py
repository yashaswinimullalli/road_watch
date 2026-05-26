"""
Root-level entry point for RoadTrack AI.
Handles Windows multiprocessing issues with Uvicorn --reload.
"""

import uvicorn
import os
import sys

if __name__ == "__main__":
    # Change to script directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Run Uvicorn with proper Windows multiprocessing support
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=["app"],
    )
