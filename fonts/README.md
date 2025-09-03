# Fonts Directory

This directory should contain the following font files for portable execution:

## Required Font Files

### 1. Noto Sans CJK (Japanese fonts)
- **File**: `NotoSansCJK-Regular.ttc`
- **Size**: ~10MB
- **Purpose**: Japanese text rendering
- **Download**: [Google Noto Fonts](https://fonts.google.com/noto/specimen/Noto+Sans+JP)

### 2. Noto Color Emoji (Emoji fonts)
- **File**: `NotoColorEmoji.ttf`
- **Size**: ~8MB  
- **Purpose**: Emoji and Unicode symbol rendering
- **Download**: [Noto Color Emoji](https://fonts.google.com/noto/specimen/Noto+Color+Emoji)

### 3. Liberation Sans (Western fonts)
- **File**: `LiberationSans-Regular.ttf`
- **Size**: ~1MB
- **Purpose**: Western text and fallback
- **Download**: [Liberation Fonts](https://github.com/liberationfonts/liberation-fonts)

## Installation

1. Download the font files from the links above
2. Place them in this `fonts/` directory
3. Build the portable executable with `build.bat`

## Total Size
- Expected font files total: ~19MB
- Final executable size: ~170MB (including Chrome and Node.js)