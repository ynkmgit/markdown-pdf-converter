@echo off
title Docker Run

echo Running PDF conversion in Docker...
echo Converting test files...
echo.
echo Starting conversion...
docker compose -p markdown-pdf-converter run --build --rm pdf-converter "input" "output"

if %errorlevel% equ 0 (
    echo.
    echo Conversion complete!
    echo Check output folder for:
    echo - 00_markdown_basics.pdf           ^(Markdown syntax^)
    echo - 01_code_highlight.pdf            ^(Syntax highlight^)
    echo - 02_tables.pdf                    ^(Table rendering^)
    echo - 03_flowchart.pdf                 ^(Mermaid flowchart^)
    echo - 04_sequence.pdf                  ^(Mermaid sequence^)
    echo - 05_gantt.pdf                     ^(Mermaid gantt^)
    echo - 06_er_diagram.pdf                ^(Mermaid ER^)
    echo - 07_class_state.pdf               ^(Mermaid class/state^)
    echo - 08_misc_diagrams.pdf             ^(Mermaid misc^)
    echo - subfolder/09_subfolder_test.pdf   ^(Subfolder test^)
) else (
    echo Conversion failed
)

:end
pause