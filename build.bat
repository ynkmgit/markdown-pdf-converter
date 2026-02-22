@echo off
setlocal

set DOCKER_BUILDKIT=1
set CHROME_VERSION=145.0.7632.77

echo Building portable executable...

REM Check Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker not found
    pause
    exit /b 1
)

REM Clean previous build
if exist dist rmdir /s /q dist
mkdir dist\output >nul 2>&1

echo Starting Docker build...
docker build -f Dockerfile.build --build-arg CHROME_VERSION=%CHROME_VERSION% --output type=local,dest=dist .

if %errorlevel% neq 0 (
    echo Build failed with error code: %errorlevel%
    pause
    exit /b 1
)

echo Build complete: dist/
pause
