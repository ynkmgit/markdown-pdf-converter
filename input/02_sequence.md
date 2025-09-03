# API通信シーケンス

## 認証フロー

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API Server
    participant D as Database
    participant R as Redis Cache
    
    C->>A: POST /login {username, password}
    A->>D: SELECT user WHERE username = ?
    D-->>A: User data
    A->>A: Verify password hash
    A->>R: Store session token
    R-->>A: OK
    A-->>C: 200 OK {token, user_info}
    
    Note over C: Store token
    
    C->>A: GET /profile (Bearer token)
    A->>R: Validate token
    R-->>A: Session data
    A->>D: SELECT profile WHERE user_id = ?
    D-->>A: Profile data
    A-->>C: 200 OK {profile}
```

## エラーハンドリング

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API Server
    participant L as Logger
    
    C->>A: Request with invalid data
    A->>A: Validate request
    alt Validation Failed
        A->>L: Log error
        A-->>C: 400 Bad Request
    else Server Error
        A->>L: Log critical error
        A-->>C: 500 Internal Server Error
    else Success
        A-->>C: 200 OK
    end
```

## API仕様

### エンドポイント一覧

| メソッド | パス | 説明 | レスポンス |
|---------|------|------|------------|
| POST | /login | ログイン | JWT token |
| GET | /profile | プロフィール取得 | User profile |
| PUT | /profile | プロフィール更新 | Updated profile |
| DELETE | /session | ログアウト | Success message |