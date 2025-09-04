@echo off
echo Building portable executable...

REM Check Docker
docker --version
if %errorlevel% neq 0 (
    echo ERROR: Docker not found
    pause
    exit /b 1
)

REM Clean previous build
if exist dist rmdir /s /q dist

echo Starting Docker build...
docker run --rm -v "%cd%":/work -w /work node:18-slim bash -c "rm -rf node_modules && npm install && npm install pkg && ./node_modules/.bin/pkg . --target win-x64 --output dist/markdown-pdf-converter.exe" 2>&1

if %errorlevel% neq 0 (
    echo Build failed with error code: %errorlevel%
    echo.
    echo Try moving this folder to a path without Japanese characters
    echo Example: C:\build\markdown-pdf\
    pause
    exit /b 1
)

REM Copy files
xcopy templates dist\templates\ /E /I /Y /Q >nul 2>&1
xcopy input dist\input\ /E /I /Y /Q >nul 2>&1
copy config.json dist\ /Y >nul 2>&1
copy PORTABLE-README.txt dist\README.txt /Y >nul 2>&1
mkdir dist\output >nul 2>&1

REM Extract Chromium for manual bundling
echo Extracting Chromium...
docker run --rm -v "%cd%":/work -w /work node:18-slim bash -c "apt update && apt install -y wget unzip && wget https://storage.googleapis.com/chrome-for-testing-public/131.0.6778.204/win64/chrome-win64.zip && unzip chrome-win64.zip && mv chrome-win64 /work/chrome-bundle-temp"
if exist chrome-bundle-temp (
    echo Moving Chromium files...
    if not exist dist\chrome-bundle mkdir dist\chrome-bundle
    xcopy chrome-bundle-temp dist\chrome-bundle\ /E /I /Y /Q >nul 2>&1
    rmdir /s /q chrome-bundle-temp >nul 2>&1
    echo SUCCESS: Windows Chromium bundled successfully
) else (
    echo WARNING: Chromium extraction failed - will use system Chrome
)

REM Portable version complete - no launcher needed

echo Build complete: dist/
pause