# Markdown PDF Converter

Markdownファイルを高品質PDFに変換。Mermaid図表対応、日本語完全サポート。

## 利用方法

### 🐳 Docker版（開発・自動化向け）
**前提条件**: Docker Desktop

```bash
docker-run.bat
```
- 設定確認画面表示
- inputフォルダのMarkdownファイルを一括変換
- outputフォルダにPDF出力
- 環境構築不要

### 💻 ポータブル版（エンドユーザー向け）
**前提条件**: Docker Desktop（ビルド時のみ）

```bash
build.bat
```
- `dist/markdown-pdf-converter.exe` 生成（83MB）
- 単一実行ファイル、インストール不要
- ダブルクリックで設定確認→変換実行

## 設定

`config.json`でカスタマイズ可能：
```json
{
  "inputDir": "./input",
  "outputDir": "./output",
  "paperFormat": "A4",
  "options": {
    "recursive": true,
    "skipConfirmation": false,
    "openOutputFolder": true
  },
  "mermaid": {
    "theme": "default",
    "fontSize": 16
  }
}
```

### 設定オプション
- `"recursive": true` - サブフォルダ内のMarkdownも変換（デフォルト）
- `"recursive": false` - 直下のファイルのみ変換
- `"skipConfirmation": false` - y/n確認を表示（デフォルト）
- `"skipConfirmation": true` - 即座に変換開始（自動化向け）
- `"openOutputFolder": true` - 完了後に出力フォルダを開く（デフォルト）
- `"openOutputFolder": false` - 出力フォルダを開かない
- `"pauseOnSuccess": true` - 成功時にキー入力待ち（デフォルト）
- `"pauseOnSuccess": false` - 成功時は自動終了（エラー時のみ一時停止）

フォルダ構造は自動的に保持されます

## サンプルファイル

`input/`フォルダにテストファイル：
- `00_symbols_test.md` - 絵文字・記号表示
- `01_flowchart.md` - システムフロー図
- `02_sequence.md` - API通信図
- `03_gantt.md` - プロジェクトスケジュール
- `04_database.md` - ER図・DB設計
- `05_comprehensive.md` - 全機能統合テスト
- `subfolder/test.md` - サブフォルダ処理テスト

## 主な特徴

✅ **Mermaid図表完全対応** - フローチャート、シーケンス図、ER図等  
✅ **日本語フォント** - Noto CJK、絵文字サポート  
✅ **コードハイライト** - 全言語対応（highlight.js）  
✅ **高品質PDF** - A4レイアウト、ページ番号  
✅ **Docker環境** - 一貫した出力、環境依存なし  
✅ **ユーザー確認** - exe実行時の設定確認とキャンセル機能  

## ファイル構成

```
├── input/              # 入力Markdownファイル
├── output/             # 出力PDFファイル  
├── docker-run.bat      # Docker実行
├── build.bat           # ポータブル版ビルド
├── convert.js          # メイン処理（15KB）
├── config.json         # 設定ファイル
├── Dockerfile          # Docker設定
└── dist/               # ビルド出力
```