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
xcopy fonts dist\fonts\ /E /I /Y /Q >nul 2>&1
xcopy templates dist\templates\ /E /I /Y /Q >nul 2>&1
xcopy test_input dist\test_input\ /E /I /Y /Q >nul 2>&1
copy config.json dist\ /Y >nul 2>&1
mkdir dist\test_output >nul 2>&1

REM Create launcher
echo @echo off > dist\convert.bat
echo markdown-pdf-converter.exe test_input test_output >> dist\convert.bat
echo if %%errorlevel%% equ 0 start test_output >> dist\convert.bat
echo pause >> dist\convert.bat

echo Build complete: dist/
pause