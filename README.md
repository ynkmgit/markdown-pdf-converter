# Markdown PDF Converter

Markdownファイルを高品質PDFに変換。Mermaid図表対応。

## 前提条件
- Docker Desktop インストール済み

## 使い方

### PDF変換
```bash
docker-run.bat
```
この1コマンドで：
- 必要に応じてDockerイメージをビルド
- test_inputフォルダ内の全Markdownファイルを変換
- test_outputフォルダにPDFを出力

### 設定
`config.json`でパス・フォーマット等を設定：
```json
{
  "inputDir": "./test_input",   # 入力フォルダ
  "outputDir": "./test_output"  # 出力フォルダ
}
```

## テストファイル
test_inputフォルダに以下のサンプルを用意：
- `00_symbols_test.md` - 絵文字・記号表示テスト
- `01_flowchart.md` - システムフロー図
- `02_sequence.md` - API通信シーケンス
- `03_gantt.md` - プロジェクトスケジュール
- `04_database.md` - データベース設計（ER図）
- `05_comprehensive.md` - 全機能総合テスト

## ポータブル実行ファイル作成

### 前提条件
- Docker Desktop インストール済み

### ビルド方法（推奨）
```bash
# クリーンなDocker環境でビルド
build-docker.bat

# または Docker Compose使用
build-compose.bat
```

### ビルド方法（ローカル）
```bash
# Node.js環境が必要
build.bat
```

### 出力
- `dist/` フォルダに完全なポータブル版を生成
- サイズ: 約170MB
- Windows実行ファイル1つで完結

## 主要ファイル

### 実行・開発
- `docker-run.bat` - Docker実行スクリプト
- `convert.js` - メイン処理
- `config.json` - 設定ファイル

### Docker環境
- `Dockerfile` - 実行用Dockerイメージ
- `docker-compose.yml` - 実行設定
- `Dockerfile.build` - ビルド用Dockerイメージ  
- `docker-compose.build.yml` - ビルド設定

### ビルド
- `build-docker.bat` - Dockerビルド（推奨）
- `build-compose.bat` - Docker Composeビルド
- `build.bat` - ローカルビルド
- `BUILD-GUIDE.md` - 詳細ビルドガイド

### ポータブル版テンプレート
- `README-PORTABLE.txt` - ユーザーガイド
- `INSTALL-PORTABLE.txt` - セットアップガイド
- `convert-portable-template.bat` - 高機能ランチャー