# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Markdown to PDF converter with full Mermaid diagram support, optimized for Japanese technical documentation. Docker-only approach ensures consistent environment and output.

## Commands

### Docker (Only)
```bash
docker-run.bat      # Run conversion with confirmation (auto-builds, converts input → output)
```

No local Node.js setup required - everything runs in Docker container.

## Architecture

### Conversion Pipeline
```
Markdown → processMermaidDiagrams() → markdownToHtml() → htmlToPdf()
              ↓                           ↓               ↓
           Puppeteer                   marked +         Puppeteer
           + Mermaid                   highlight.js     + Chrome
           → SVG                       → HTML           → PDF
```

### Core Class: MarkdownToPDFConverter
Key methods that handle the pipeline:
- `initialize()` - Sets up Puppeteer browser + marked configuration
- `convertSingleFile()` - Single file conversion orchestrator
- `processMermaidDiagrams()` - Regex detection + SVG generation via browser
- `generateMermaidSVG()` - Isolated browser context for each diagram
- `markdownToHtml()` - HTML generation with CSS + Japanese datetime
- `htmlToPdf()` - PDF generation with page settings
- `convertFolder()` - Batch processing with glob patterns

### Docker Environment
- **Base**: Node.js 18-slim
- **Timezone**: Asia/Tokyo (for consistent Japanese datetime)
- **Fonts**: Noto CJK, Noto Color Emoji, Liberation
- **Browser**: Chromium with security flags for container environment

## Configuration (config.json)

Key sections:
- `inputDir`/`outputDir` - Path configuration
- `paperFormat` + `margins` - PDF layout
- `mermaid.theme/fontSize` - Diagram appearance
- `options.includePageNumbers` - PDF features
- `options.recursive` - Subfolder search control
- `options.skipConfirmation` - Auto-execution without y/n prompt
- `options.openOutputFolder` - Auto-open output folder after completion

## Test Files Structure

Comprehensive test coverage in `input/`:
- `00_symbols_test.md` - Unicode emoji/symbol rendering validation
- `01_flowchart.md` - Basic Mermaid flowcharts
- `02_sequence.md` - API sequence diagrams 
- `03_gantt.md` - Project timeline charts
- `04_database.md` - ER diagrams and database schemas
- `05_comprehensive.md` - Mixed content (pie charts, state diagrams, class diagrams)

## Key Technical Decisions

- **Japanese timezone enforcement**: All datetime displays use `Asia/Tokyo`
- **Emoji font stack**: Multiple fallback fonts for symbol compatibility
- **Isolated Mermaid rendering**: Each diagram rendered in separate browser context
- **Auto-rebuild**: Docker compose with `--build` flag ensures latest changes
- **Error-resilient Mermaid**: Failed diagrams show debug info in PDF rather than breaking conversion