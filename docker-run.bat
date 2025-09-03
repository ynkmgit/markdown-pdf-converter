@echo off
title Docker Run

echo Running PDF conversion in Docker...
echo Converting test files...
echo.
set /p confirm="Start conversion? (y/N): "

if /i "%confirm%"=="y" (
    echo Starting conversion...
    docker-compose -p markdown-pdf-converter run --build --rm pdf-converter "input" "output"
) else (
    echo Conversion canceled.
    goto :end
)

if %errorlevel% equ 0 (
    echo.
    echo Conversion complete!
    echo Check output folder for:
    echo - 00_symbols_test.pdf     ^(Emoji/Symbol test^)
    echo - 01_flowchart.pdf        ^(System flow^)
    echo - 02_sequence.pdf         ^(API sequence^)
    echo - 03_gantt.pdf            ^(Project schedule^)
    echo - 04_database.pdf         ^(ER diagram^)
    echo - 05_comprehensive.pdf    ^(All features^)
    echo - subfolder/test.pdf      ^(Subfolder test^)
) else (
    echo Conversion failed
)

:end
pause