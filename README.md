# Markdown PDF Converter

Markdownファイルを高品質PDFに変換。Mermaid図表対応、日本語完全サポート。

## 利用方法

### 🐳 Docker版（開発・自動化向け）
**前提条件**: Docker Desktop

```bash
docker-run.bat
```
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
  "paperFormat": "A4",          // "210mm 297mm" 等のカスタムサイズも可
  "options": {
    "recursive": true,
    "skipConfirmation": true,
    "openOutputFolder": false
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
- `"skipConfirmation": true` - 即座に変換開始（デフォルト）
- `"skipConfirmation": false` - y/n確認を表示
- `"openOutputFolder": false` - 出力フォルダを開かない（デフォルト）
- `"openOutputFolder": true` - 完了後に出力フォルダを開く
- `"pauseOnSuccess": false` - 成功時は自動終了（デフォルト、エラー時のみ一時停止）
- `"pauseOnSuccess": true` - 成功時にキー入力待ち
- `"landscape": true` - 横向きPDF出力
- `"landscape": false` - 縦向きPDF出力（デフォルト）

### 設定ファイルの切り替え

`--config` フラグで別の設定ファイルを指定可能：
```bash
node convert.js --config ./my-config.json
node convert.js --config ./a5-config.json --single "doc.md" "doc.pdf"
```

フォルダ構造は自動的に保持されます

## サンプルファイル

`input/`フォルダにテストファイル：
- `00_markdown_basics.md` - Markdown基本構文
- `01_code_highlight.md` - シンタックスハイライト（10言語）
- `02_tables.md` - テーブルレンダリング
- `03_flowchart.md` - Mermaid: フローチャート
- `04_sequence.md` - Mermaid: シーケンス図
- `05_gantt.md` - Mermaid: ガントチャート
- `06_er_diagram.md` - Mermaid: ER図
- `07_class_state.md` - Mermaid: クラス図・状態遷移図
- `08_misc_diagrams.md` - Mermaid: 円グラフ・マインドマップ等
- `subfolder/09_subfolder_test.md` - サブフォルダ処理テスト

## 主な特徴

✅ **Mermaid図表完全対応** - フローチャート、シーケンス図、ER図等  
✅ **日本語フォント** - Noto CJK、絵文字サポート  
✅ **コードハイライト** - 全言語対応（highlight.js）  
✅ **高品質PDF** - A4レイアウト、ページ番号  
✅ **Docker環境** - 一貫した出力、環境依存なし  
✅ **ユーザー確認** - exe実行時の設定確認とキャンセル機能  

## 開発者向けノート

### ビルド再現性（npm ci + package-lock.json）

Dockerfile では `npm ci` を使用している。理由:

- このプロジェクトは `Dockerfile.build` で exe を生成して配布する。`npm install` は実行時点の最新互換バージョンを解決するため、同じコミットから異なる日にビルドすると異なる exe が生成され得る
- `npm ci` は package-lock.json から正確にインストールするため、ビルドが再現可能になる
- Docker レイヤーキャッシュとも相性が良く、依存が変わらない限りキャッシュが効く

依存を更新する場合は `npm install` でローカルの package-lock.json を更新してからコミットする。

### 設計判断の記録

以下の構造変更は検討の上、見送りとした:

- **convert.js のファイル分割**: 746行は分割するほどの規模ではない。pkg 同梱・デバッグ面で単一ファイルが有利
- **getDefaultCSS() と default.css の統合**: 前者はCSSファイル欠損時の緊急フォールバック、後者は本番スタイル。目的が異なるため独立して保持
- **config バリデーション**: config.json の各オプションにはコード側でフォールバック値があり、現状で十分機能している

## ファイル構成

```
├── convert.js          # メイン処理
├── config.json         # 設定ファイル
├── templates/
│   └── default.css     # PDF スタイル
├── input/              # 入力Markdownファイル
├── output/             # 出力PDFファイル
├── Dockerfile          # Docker実行用
├── Dockerfile.build    # ポータブル版ビルド用
├── docker-compose.yml  # Docker Compose設定
├── docker-run.bat      # Docker実行
├── build.bat           # ポータブル版ビルド
├── PORTABLE-README.txt # exe同梱README
└── dist/               # ビルド出力
```