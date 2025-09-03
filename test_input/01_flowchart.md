# システムフロー図

## 処理フロー

```mermaid
graph TD
    A[開始] --> B{認証確認}
    B -->|成功| C[メインメニュー]
    B -->|失敗| D[エラー表示]
    D --> E[再試行]
    E --> B
    C --> F[機能選択]
    F --> G{選択内容}
    G -->|データ入力| H[入力画面]
    G -->|レポート| I[レポート生成]
    G -->|設定| J[設定画面]
    H --> K[データ保存]
    I --> L[PDF出力]
    J --> M[設定保存]
    K --> N[完了]
    L --> N
    M --> N
    N --> O[終了]
```

## 処理詳細

| 処理 | 説明 | 時間 |
|------|------|------|
| 認証 | ユーザー認証を行う | 1秒 |
| データ入力 | フォームからデータを入力 | 30秒 |
| レポート生成 | データからレポートを作成 | 5秒 |
| 設定変更 | システム設定を変更 | 10秒 |

## コード例

```javascript
function authenticate(user, password) {
    // 認証処理
    if (checkCredentials(user, password)) {
        return { success: true, token: generateToken() };
    }
    return { success: false, error: "Invalid credentials" };
}
```