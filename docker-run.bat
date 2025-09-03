@echo off
title Docker Run

echo Running PDF conversion in Docker...
echo Converting 6 test files...
docker-compose -p markdown-pdf-converter run --build --rm pdf-converter "input" "output"

if %errorlevel% equ 0 (
    echo.
    echo Conversion complete!
    echo Check output folder for:
    echo - 00_symbols_test.pdf   ^(Emoji/Symbol test^)
    echo - 01_flowchart.pdf      ^(System flow^)
    echo - 02_sequence.pdf       ^(API sequence^)
    echo - 03_gantt.pdf          ^(Project schedule^)
    echo - 04_database.pdf       ^(ER diagram^)
    echo - 05_comprehensive.pdf  ^(All features^)
) else (
    echo Conversion failed
)
pause