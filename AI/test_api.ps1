# Test script for RoadTrack AI API (PowerShell)
# Usage: .\test_api.ps1 -ImageFile "road_damage.jpg"

param(
    [Parameter(Mandatory=$true)]
    [string]$ImageFile
)

if (-not (Test-Path $ImageFile)) {
    Write-Host "Error: Image file not found: $ImageFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🧪 Testing RoadTrack AI API" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""
Write-Host "📸 Image: $ImageFile"
Write-Host ""

# Prepare the form data
$form = @{
    'image' = Get-Item -Path $ImageFile
    'location' = 'Tumkur Road, Bangalore'
    'authority' = 'National Highways Authority of India (NHAI)'
    'road_type' = 'NH'
    'last_relaying_date' = '2022-06-15'
    'support_count' = '8'
    'condition' = 'poor'
    'traffic_density' = 'high'
    'school_or_hospital_nearby' = 'true'
    'weather_exposure' = 'moderate'
    'flood_prone_area' = 'false'
    'historical_damage_count' = '3'
    'repeated_complaints_count' = '2'
}

# Make the request
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/v1/analyze" `
        -Method Post `
        -Form $form `
        -ContentType "multipart/form-data"
    
    Write-Host ""
    Write-Host "✓ Request successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    $response | ConvertTo-Json | Write-Host
}
catch {
    Write-Host ""
    Write-Host "❌ Request failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✓ Test complete" -ForegroundColor Green
