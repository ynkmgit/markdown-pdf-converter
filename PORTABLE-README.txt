Markdown PDF 変換ツール v1.0

=== 使い方 ===

1. markdown-pdf-converter.exe をダブルクリック
2. 変換設定を確認し、y を押して開始（n でキャンセル）
3. 変換完了まで待機
4. output フォルダに PDF が生成されます
5. 何かキーを押して終了

=== ファイル構成 ===

markdown-pdf-converter.exe - メインプログラム（83MB）
input/                      - サンプルMarkdownファイル（10個、サブフォルダ含む）
output/                     - 生成されたPDFファイル
config.json                 - 設定ファイル（入出力パス等）
templates/                  - HTMLテンプレート

=== 動作環境 ===

- Windows 64bit
- RAM 4GB 推奨
- 空きディスク容量 500MB

=== 主な機能 ===

✓ Mermaid図表対応（フローチャート、シーケンス図等）
✓ 日本語・絵文字完全サポート
✓ コードシンタックスハイライト
✓ インストール不要
✓ 出力フォルダ自動オープン

=== 高度な使い方 ===

カスタムフォルダ変換：
> markdown-pdf-converter.exe "入力フォルダ" "出力フォルダ"

単一ファイル変換：
> markdown-pdf-converter.exe --single "文書.md" "文書.pdf"

設定ファイル指定：
> markdown-pdf-converter.exe --config "別の設定.json"
> markdown-pdf-converter.exe --config "別の設定.json" --single "文書.md"

ヘルプ表示：
> markdown-pdf-converter.exe --help

=== 設定変更 ===

config.json を編集して以下を変更可能：
- 入力・出力フォルダパス
- PDF用紙サイズ（A4/Letter等、"210mm 297mm" のようなカスタムサイズも可）
- Mermaidテーマ・フォントサイズ
- ページ余白
- サブフォルダ検索：
  "recursive": true   # サブフォルダ内も検索（デフォルト）
  "recursive": false  # 直下のファイルのみ
- 確認ダイアログ：
  "skipConfirmation": true   # 即座に変換開始（デフォルト）
  "skipConfirmation": false  # y/n確認を表示
- 出力フォルダオープン：
  "openOutputFolder": false  # フォルダを開かない（デフォルト）
  "openOutputFolder": true   # 完了後にフォルダを開く
- 完了時の動作：
  "pauseOnSuccess": false    # 成功時は自動終了（デフォルト）
  "pauseOnSuccess": true     # 成功時にキー入力待ち
- PDF向き：
  "landscape": false         # 縦向き（デフォルト）
  "landscape": true          # 横向き

=== トラブルシューティング ===

変換に失敗する場合：
- inputフォルダに.mdファイルがあるか確認
- 十分な空きディスク容量があるか確認
- 管理者権限で実行してみる
- コンソール出力でエラー内容を確認

プロジェクト: https://github.com/ynkmgit/markdown-pdf-converter