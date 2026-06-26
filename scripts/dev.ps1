#!/usr/bin/env pwsh
# GPU Cost Optimizer - Development Scripts
# Run from the gpu-cost-optimizer directory

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Start-Backend {
    Write-Host "🚀 Starting Go backend on :8080..." -ForegroundColor Cyan
    Push-Location backend
    go run main.go
    Pop-Location
}

function Start-Frontend {
    Write-Host "🖥️  Starting Next.js frontend on :3000..." -ForegroundColor Cyan
    Push-Location ..\frontend
    npm run dev
    Pop-Location
}

function Build-Backend {
    Write-Host "🔨 Building Go backend..." -ForegroundColor Yellow
    Push-Location backend
    go build -o gpu-cost-optimizer-api.exe main.go
    Write-Host "✅ Binary created: backend/gpu-cost-optimizer-api.exe" -ForegroundColor Green
    Pop-Location
}

function Test-Backend {
    Write-Host "🧪 Running Go tests..." -ForegroundColor Yellow
    Push-Location backend
    go test ./... -v
    Pop-Location
}

function Show-Help {
    Write-Host ""
    Write-Host "GPU Cost Optimizer - Dev Scripts" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\scripts\dev.ps1 <command>"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  backend    - Start the Go API server"
    Write-Host "  frontend   - Start the Next.js dev server"
    Write-Host "  build      - Build the Go binary"
    Write-Host "  test       - Run Go tests"
    Write-Host "  help       - Show this help"
    Write-Host ""
}

switch ($Command) {
    "backend"  { Start-Backend }
    "frontend" { Start-Frontend }
    "build"    { Build-Backend }
    "test"     { Test-Backend }
    default    { Show-Help }
}
