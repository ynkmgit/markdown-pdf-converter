#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const puppeteer = require('puppeteer');
const marked = require('marked');
const { glob } = require('glob');
const hljs = require('highlight.js');

// pkg環境での実行かどうかを判定し、適切なベースパスを設定
const isPkg = typeof process.pkg !== 'undefined';
const basePath = isPkg ? path.dirname(process.execPath) : __dirname;

class MarkdownToPDFConverter {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.startTime = new Date();
  }

  async initialize() {
    console.log('🚀 Markdown to PDF Converter を起動中...');
    console.log(`📅 開始時刻: ${this.startTime.toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'})}`);
    
    const launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ]
    };

    // pkg環境では同梱されたChromiumを使用
    if (isPkg) {
      // pkgでバンドルされたChromiumのパスを使用
      launchOptions.executablePath = puppeteer.executablePath();
    }

    this.browser = await puppeteer.launch(launchOptions);
    
    // Markedの設定
    marked.setOptions({
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value;
          } catch (err) {}
        }
        return hljs.highlightAuto(code).value;
      }
    });
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('ja-JP', {timeZone: 'Asia/Tokyo'});
    const prefix = {
      info: '📋',
      success: '✅',
      warn: '⚠️',
      error: '❌'
    }[type] || '📋';
    
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async convertSingleFile(inputPath, outputPath = null) {
    const fileName = path.basename(inputPath);
    outputPath = outputPath || inputPath.replace(/\.md$/, '.pdf');
    
    this.log(`変換開始: ${fileName}`, 'info');
    
    try {
      // 1. Markdownファイル読み込み
      const markdownContent = await fs.readFile(inputPath, 'utf8');
      
      // 2. Mermaid図の処理
      const processedContent = await this.processMermaidDiagrams(markdownContent);
      
      // 3. HTML変換
      const htmlContent = await this.markdownToHtml(processedContent, fileName);
      
      // 4. PDF生成
      await this.htmlToPdf(htmlContent, outputPath);
      
      this.log(`変換完了: ${path.basename(outputPath)}`, 'success');
      
      return { success: true, inputPath, outputPath };
      
    } catch (error) {
      this.log(`変換エラー: ${fileName} - ${error.message}`, 'error');
      return { success: false, inputPath, outputPath, error: error.message };
    }
  }

  async processMermaidDiagrams(markdown) {
    const mermaidRegex = /```mermaid\s*\n([\s\S]*?)\n```/g;
    let processedMarkdown = markdown;
    
    const matches = [...markdown.matchAll(mermaidRegex)];
    if (matches.length > 0) {
      this.log(`Mermaid図を検出: ${matches.length}個`, 'info');
    }
    
    for (let i = 0; i < matches.length; i++) {
      const diagramCode = matches[i][1].trim();
      try {
        // Mermaid SVG生成
        const svgCode = await this.generateMermaidSVG(diagramCode, i);
        const imgTag = `<div class="mermaid-diagram" id="mermaid-${i}">${svgCode}</div>`;
        processedMarkdown = processedMarkdown.replace(matches[i][0], imgTag);
        
      } catch (error) {
        this.log(`Mermaid図${i + 1}でエラー: ${error.message}`, 'warn');
        const errorDiv = `
          <div class="mermaid-error">
            <h4>🔧 Mermaid図エラー (図${i + 1})</h4>
            <p><strong>エラー内容:</strong> ${error.message}</p>
            <details>
              <summary>元のコード</summary>
              <pre><code>${diagramCode}</code></pre>
            </details>
          </div>
        `;
        processedMarkdown = processedMarkdown.replace(matches[i][0], errorDiv);
      }
    }
    
    return processedMarkdown;
  }

  async generateMermaidSVG(code, index) {
    const page = await this.browser.newPage();
    
    try {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
            <style>
              .mermaid {
                font-family: 'Arial', 'メイリオ', 'Hiragino Sans', sans-serif;
                font-size: ${this.config.mermaid.fontSize}px;
              }
            </style>
          </head>
          <body>
            <div class="mermaid" id="diagram-${index}">
${code}
            </div>
            <script>
              mermaid.initialize({
                theme: '${this.config.mermaid.theme}',
                fontFamily: '${this.config.mermaid.fontFamily}',
                flowchart: { htmlLabels: false },
                sequence: { htmlLabels: false },
                gantt: { htmlLabels: false }
              });
            </script>
          </body>
        </html>
      `;
      
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // SVGが生成されるまで待機
      await page.waitForSelector('.mermaid svg', { timeout: 10000 });
      
      const svg = await page.$eval('.mermaid', el => el.innerHTML);
      
      return svg;
      
    } finally {
      await page.close();
    }
  }

  async markdownToHtml(markdown, fileName = 'document') {
    const html = marked.parse(markdown);
    const cssPath = path.join(basePath, 'templates', 'default.css');
    
    let css;
    try {
      css = await fs.readFile(cssPath, 'utf8');
    } catch (error) {
      this.log('CSSファイルが見つかりません。デフォルトスタイルを使用します。', 'warn');
      css = this.getDefaultCSS();
    }
    
    const currentDateTime = new Date().toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'});
    
    return `
      <!DOCTYPE html>
      <html lang="ja">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${fileName}</title>
          <style>${css}</style>
        </head>
        <body>
          <div class="page-header">
            <div class="document-title">${fileName}</div>
            <div class="generation-date">生成日時: ${currentDateTime}</div>
          </div>
          <div class="markdown-body">
            ${html}
          </div>
        </body>
      </html>
    `;
  }

  getDefaultCSS() {
    return `
      body {
        font-family: 'Hiragino Sans', 'メイリオ', 'Arial', sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 20px;
        color: #333;
      }
      
      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #333;
        padding-bottom: 10px;
        margin-bottom: 30px;
      }
      
      .document-title {
        font-size: 18px;
        font-weight: bold;
      }
      
      .generation-date {
        font-size: 12px;
        color: #666;
      }
      
      .markdown-body {
        max-width: none;
      }
      
      h1, h2, h3, h4, h5, h6 {
        color: #2c3e50;
        margin-top: 24px;
        margin-bottom: 16px;
      }
      
      h1 { font-size: 24px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
      h2 { font-size: 20px; }
      h3 { font-size: 18px; }
      
      code {
        background-color: #f1f3f4;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Consolas', monospace;
      }
      
      pre {
        background-color: #f8f8f8;
        border: 1px solid #e1e4e8;
        border-radius: 6px;
        padding: 16px;
        overflow: auto;
      }
      
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 16px 0;
      }
      
      table th, table td {
        border: 1px solid #dfe2e5;
        padding: 8px 12px;
        text-align: left;
      }
      
      table th {
        background-color: #f6f8fa;
        font-weight: bold;
      }
      
      .mermaid-diagram {
        text-align: center;
        margin: 20px 0;
        page-break-inside: avoid;
      }
      
      .mermaid-error {
        border: 2px solid #ff6b6b;
        background-color: #ffe0e0;
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
      }
      
      .mermaid-error h4 {
        color: #d63031;
        margin-top: 0;
      }
      
      .page-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        text-align: center;
        font-size: 10px;
        color: #666;
        padding: 10px;
      }
    `;
  }

  async htmlToPdf(html, outputPath) {
    const page = await this.browser.newPage();
    
    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // 出力ディレクトリが存在しない場合は作成
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });
      
      await page.pdf({
        path: outputPath,
        format: this.config.paperFormat,
        margin: this.config.margins,
        printBackground: this.config.options.printBackground,
        displayHeaderFooter: this.config.options.includePageNumbers,
        headerTemplate: '<div></div>',
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; color: #666;">
            <span class="pageNumber"></span> / <span class="totalPages"></span>
          </div>
        `
      });
      
    } finally {
      await page.close();
    }
  }

  async convertFolder(inputDir, outputDir) {
    this.log(`フォルダ変換開始: ${inputDir} → ${outputDir}`, 'info');
    
    // 出力ディレクトリ作成
    await fs.mkdir(outputDir, { recursive: true });
    
    // 再帰設定に応じてglobパターンを決定
    const isRecursive = this.config.options?.recursive !== false; // デフォルトtrue
    const globPattern = isRecursive ? '**/*.md' : '*.md';
    
    this.log(`検索モード: ${isRecursive ? '再帰的（サブフォルダを含む）' : '直下のみ'}`, 'info');
    
    // Markdownファイル検索
    const markdownFiles = await glob(globPattern, { 
      cwd: inputDir,
      absolute: true,
      ignore: ['**/node_modules/**', '**/.git/**']
    });
    
    this.log(`対象ファイル数: ${markdownFiles.length}個`, 'info');
    
    if (markdownFiles.length === 0) {
      this.log('変換対象のMarkdownファイルが見つかりませんでした。', 'warn');
      return [];
    }
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const inputPath of markdownFiles) {
      const relativePath = path.relative(inputDir, inputPath);
      const outputPath = path.join(
        outputDir, 
        relativePath.replace(/\.md$/, '.pdf')
      );
      
      // 出力ファイルのディレクトリ作成
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      
      const result = await this.convertSingleFile(inputPath, outputPath);
      results.push(result);
      
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
      }
    }
    
    // 変換結果サマリー
    this.log(`\n📊 変換結果サマリー:`, 'info');
    this.log(`✅ 成功: ${successCount}個`, 'success');
    this.log(`❌ 失敗: ${errorCount}個`, errorCount > 0 ? 'error' : 'info');
    
    const endTime = new Date();
    const duration = ((endTime - this.startTime) / 1000).toFixed(1);
    this.log(`⏱️  処理時間: ${duration}秒`, 'info');
    this.log(`🏁 完了時刻: ${endTime.toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'})}`, 'info');
    
    return results;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// ユーザー確認機能（pkg環境用）
async function getUserConfirmation(config) {
  console.log('\n📋 変換設定を確認してください:');
  console.log(`📂 入力フォルダ: ${config.inputDir}`);
  console.log(`📁 出力フォルダ: ${config.outputDir}`);
  console.log(`🔍 検索モード: ${config.options?.recursive !== false ? 'サブフォルダ含む' : '直下のみ'}`);
  console.log(`📄 用紙サイズ: ${config.paperFormat || 'A4'}`);
  
  console.log('\n🚀 変換を開始しますか？ (y/N): ');
  
  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (key) => {
      const input = key.toString().toLowerCase();
      process.stdin.setRawMode(false);
      process.stdin.pause();
      
      if (input === 'y') {
        console.log('✅ 変換を開始します...\n');
        resolve(true);
      } else {
        console.log('❌ 変換をキャンセルしました。');
        resolve(false);
      }
    });
  });
}

// メイン処理
async function main() {
  const configPath = path.join(basePath, 'config.json');
  
  let config;
  try {
    config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  } catch (error) {
    console.error('❌ config.jsonの読み込みに失敗しました:', error.message);
    process.exit(1);
  }
  
  const converter = new MarkdownToPDFConverter(config);
  let conversionCompleted = false;
  
  try {
    await converter.initialize();
    
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      // pkg環境（exe実行）の場合は事前確認
      if (isPkg) {
        const shouldProceed = await getUserConfirmation(config);
        if (!shouldProceed) {
          await converter.close();
          console.log('\n💡 何かキーを押すとプログラムを終了します');
          process.stdin.setRawMode(true);
          process.stdin.resume();
          process.stdin.on('data', () => {
            process.exit(0);
          });
          return;
        }
      }
      
      // デフォルト: configで指定されたフォルダを変換
      converter.log('デフォルト設定で変換を開始します', 'info');
      converter.log(`入力フォルダ: ${config.inputDir}`, 'info');
      converter.log(`出力フォルダ: ${config.outputDir}`, 'info');
      
      const results = await converter.convertFolder(config.inputDir, config.outputDir);
      
      // エラーがあった場合は詳細表示
      const errors = results.filter(r => !r.success);
      if (errors.length > 0) {
        converter.log('\n❌ エラー詳細:', 'error');
        errors.forEach(error => {
          converter.log(`  - ${path.basename(error.inputPath)}: ${error.error}`, 'error');
        });
      }
      
      conversionCompleted = true;
      
    } else if (args[0] === '--single') {
      // 単体ファイル変換
      if (!args[1]) {
        console.error('❌ ファイルパスを指定してください: --single <input.md> [output.pdf]');
        process.exit(1);
      }
      
      const inputFile = args[1];
      const outputFile = args[2] || inputFile.replace(/\.md$/, '.pdf');
      
      converter.log(`単体ファイル変換: ${path.basename(inputFile)}`, 'info');
      const result = await converter.convertSingleFile(inputFile, outputFile);
      
      if (!result.success) {
        converter.log(`変換に失敗しました: ${result.error}`, 'error');
        process.exit(1);
      }
      
      conversionCompleted = true;
      
    } else if (args[0] === '--help' || args[0] === '-h') {
      // ヘルプ表示
      console.log(`
📄 Markdown PDF Converter

使用方法:
  node convert.js                    # デフォルト設定で変換
  node convert.js --single <input>   # 単体ファイル変換
  node convert.js <inputDir> <outputDir>  # カスタムフォルダ変換
  node convert.js --help             # このヘルプを表示

例:
  node convert.js --single "doc.md" "doc.pdf"
  node convert.js "C:/docs" "C:/pdfs"
      `);
      
    } else {
      // カスタムフォルダ指定
      const inputDir = args[0];
      const outputDir = args[1] || config.outputDir;
      
      converter.log(`カスタムフォルダ変換: ${inputDir} → ${outputDir}`, 'info');
      await converter.convertFolder(inputDir, outputDir);
      conversionCompleted = true;
    }
    
  } catch (error) {
    console.error('💥 予期しないエラーが発生しました:', error);
    console.error(error.stack);
    
    // pkg環境（実行ファイル）ではエラー確認後に終了
    if (isPkg) {
      console.log('\n💡 何かキーを押すとプログラムを終了します');
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', () => {
        process.exit(1);
      });
      return; // finallyに進まない
    } else {
      process.exit(1);
    }
  } finally {
    await converter.close();
    
    // 変換が正常に完了した場合のみ成功メッセージとフォルダオープン
    if (conversionCompleted) {
      console.log('\n🎉 処理が完了しました！');
      
      // pkg環境（実行ファイル）での実行時は、ユーザーが結果を確認できるように待機
      if (isPkg) {
        console.log('\n📁 出力フォルダが自動的に開きます...');
        console.log('💡 何かキーを押すとプログラムを終了します');
        
        // 出力フォルダを開く（Windows環境用）
        if (process.platform === 'win32') {
          const { spawn } = require('child_process');
          const outputPath = path.resolve(basePath, config.outputDir || 'output');
          spawn('explorer', [outputPath], { detached: true });
        }
        
        // キー入力待ち
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', () => {
          process.exit(0);
        });
      }
    }
  }
}

// スクリプトが直接実行された場合のみメイン処理を実行
if (require.main === module) {
  main().catch(error => {
    console.error('💥 致命的なエラー:', error);
    
    // pkg環境（実行ファイル）では致命的エラーも確認後に終了
    if (typeof process.pkg !== 'undefined') {
      console.log('\n💡 何かキーを押すとプログラムを終了します');
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on('data', () => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

module.exports = { MarkdownToPDFConverter };