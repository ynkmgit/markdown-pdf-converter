# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Markdown to PDF converter with full Mermaid diagram support, optimized for Japanese technical documentation. Dual execution model supports both development (Docker) and end-user distribution (portable executable).

## Commands

### Development & Testing
```bash
docker-run.bat      # Docker execution with user confirmation
node convert.js     # Direct Node.js execution (requires local setup)
```

### Build & Distribution
```bash
build.bat           # Create portable executable (83MB) in dist/
```

### Portable Executable Usage
```bash
# GUI-style confirmation dialog
markdown-pdf-converter.exe

# Command line with custom paths
markdown-pdf-converter.exe "docs" "pdfs"
```

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

### Execution Environments
**Dual Environment Detection:**
```javascript
const isPkg = typeof process.pkg !== 'undefined';
const basePath = isPkg ? path.dirname(process.execPath) : __dirname;
```

**Docker Environment:**
- **Base**: Node.js 18-slim
- **Timezone**: Asia/Tokyo (for consistent Japanese datetime)
- **Fonts**: Noto CJK, Noto Color Emoji, Liberation
- **Browser**: Chromium with security flags for container environment

**Pkg Environment:**
- **Executable**: Single 83MB file with embedded Node.js + Chromium
- **Assets**: Templates, config.json, and input folder bundled
- **Confirmation**: GUI-style y/n prompts before execution
- **Path Resolution**: Dynamic base path detection for portable operation

## Configuration (config.json)

Key sections:
- `inputDir`/`outputDir` - Path configuration (relative paths supported)
- `paperFormat` + `margins` - PDF layout (A4 default)
- `mermaid.theme/fontSize` - Diagram appearance
- `options.includePageNumbers` - PDF page numbering
- `options.recursive` - Subfolder search control (preserves directory structure)
- `options.skipConfirmation` - Automation mode (skips y/n prompts)
- `options.openOutputFolder` - Auto-open output folder after completion
- `options.pauseOnSuccess` - Pause for user input on successful completion (false = auto-exit)
- `logging.verbose/logFile` - Debug output control

## Build Process

### Portable Executable Creation
```bash
build.bat   # Docker-based build for clean environment
```

Build pipeline:
1. **Docker container**: Uses Node.js 18-slim for consistent pkg compilation
2. **Asset bundling**: Copies templates/, input/, config.json to dist/
3. **Executable creation**: pkg creates 83MB self-contained file
4. **No launcher needed**: Direct execution with embedded runtime

### User Confirmation System
**Automatic confirmation prompts in pkg environment:**
- Displays current configuration settings
- Shows input/output directories
- y/n confirmation (skippable via `skipConfirmation: true`)
- English prompts in batch files to avoid encoding issues

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
- **Dual execution model**: Single codebase supports both development and distribution
- **Path resolution**: Dynamic base path detection for portable vs development environments

## Critical Implementation Details

### Output Folder Tracking
```javascript
let actualOutputDir = null;
// Track actual output directory for proper folder opening
actualOutputDir = config.outputDir;        // Default case
actualOutputDir = path.dirname(outputFile); // Single file conversion
actualOutputDir = outputDir;               // Command line arguments
```

**Important**: The `actualOutputDir` tracking prevents incorrect folder opening when using command line arguments with relative paths.

### Character Encoding Challenges
- **Batch files**: Use English prompts to avoid Shift_JIS/UTF-8 conflicts
- **Console output**: Japanese text works correctly in convert.js
- **Config files**: UTF-8 encoding for Japanese configuration values