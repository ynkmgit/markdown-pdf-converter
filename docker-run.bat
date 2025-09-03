@echo off
title Docker Run

echo.
echo ==========================================
echo  Markdown PDF Converter (Docker版)
echo ==========================================
echo.
echo 📋 変換設定:
echo 📂 入力フォルダ: ./input
echo 📁 出力フォルダ: ./output  
echo 🔍 検索モード: サブフォルダ含む (config.json で変更可能)
echo 📄 用紙サイズ: A4 (config.json で変更可能)
echo 🐳 実行環境: Docker
echo.
set /p confirm="🚀 変換を開始しますか？ (y/N): "

if /i "%confirm%"=="y" (
    echo ✅ 変換を開始します...
    echo.
    docker-compose -p markdown-pdf-converter run --build --rm pdf-converter "input" "output"
) else (
    echo ❌ 変換をキャンセルしました。
    goto :end
)

if %errorlevel% equ 0 (
    echo.
    echo 🎉 変換完了！
    echo 📁 出力フォルダを確認してください:
    echo - 00_symbols_test.pdf     ^(絵文字・記号テスト^)
    echo - 01_flowchart.pdf        ^(システムフロー^)
    echo - 02_sequence.pdf         ^(APIシーケンス^)
    echo - 03_gantt.pdf            ^(プロジェクトスケジュール^)
    echo - 04_database.pdf         ^(ER図^)
    echo - 05_comprehensive.pdf    ^(全機能統合^)
    echo - subfolder/test.pdf      ^(サブフォルダテスト^)
) else (
    echo ❌ 変換に失敗しました
)

:end
echo.
pause