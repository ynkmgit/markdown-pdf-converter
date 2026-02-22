# Mermaid: ER図テスト

基本的なER図構文に加え、エッジケース（datetime型、json型、長い日本語エンティティ名、
"/"を含む文字列値）の変換を確認する。

## 基本ER図

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "included in"
    CUSTOMER {
        int id PK
        string name
        string email UK
    }
    ORDER {
        int id PK
        int customer_id FK
        string status
        float total
    }
    LINE_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
    }
    PRODUCT {
        int id PK
        string name
        float price
        int stock
    }
```

## リレーション記法一覧

```mermaid
erDiagram
    A ||--|| B : "一対一（必須-必須）"
    C ||--o| D : "一対一（必須-任意）"
    E ||--o{ F : "一対多（必須-任意）"
    G }|--|{ H : "多対多（必須-必須）"
    I }o--o{ J : "多対多（任意-任意）"
    K ||..o{ L : "一対多（点線）"
```

## datetime型・json型テスト

datetime型とjson型を含むエンティティ。PDF変換時のパースエラーを検出する。

```mermaid
erDiagram
    AUDIT_LOG {
        string audit_id PK
        string actor_id
        string target_table
        string target_id
        string operation "INSERT/UPDATE/DELETE"
        json diff_data
        datetime executed_at
        string correlation_id
    }

    EVENT_OUTBOX {
        string event_id PK
        string event_type
        json payload
        string status "NEW/SENT/FAILED"
        datetime created_at
    }

    SESSION {
        string session_id PK
        string user_id FK
        datetime login_at
        datetime expires_at
        json metadata
    }

    USER ||--o{ SESSION : has
    USER ||--o{ AUDIT_LOG : generates
```

## 長い日本語エンティティ名テスト

エンティティ名が長い場合のレイアウト崩れを検出する。

```mermaid
erDiagram
    招待 {
        string 招待ID PK
        string テナントID FK
        string メール
        string 役割ヒント "初期ロール/スコープ"
        string トークン UK
        datetime 有効期限
        string 状態 "SENT/RESEND/CANCEL/EXPIRED/COMPLETED"
        datetime 作成日時
    }

    パスワード再設定トークン {
        string リセットトークン PK
        string ユーザID FK
        datetime 有効期限
        string 状態 "ISSUED/USED/EXPIRED"
    }

    イベントアウトボックス {
        string イベントID PK
        string 種別
        json ペイロード
        string 状態 "NEW/SENT/FAILED"
        datetime 作成日時
    }

    テナント ||--o{ 招待 : 発行
    ユーザ ||--o{ パスワード再設定トークン : 回復
```

## "/"を含む文字列値テスト

属性コメントに "/" を含む場合のパースを確認する。

```mermaid
erDiagram
    TENANT_CONFIG {
        string config_id PK
        string tenant_id FK
        string category "SYSTEM/BILLING/NOTIFICATION"
        string value
        string scope "GLOBAL/COMPANY/STORE"
        datetime updated_at
    }

    USER_ACCOUNT {
        string user_id PK
        string email UK
        string display_name
        string status "ACTIVE/LOCKED/SUSPENDED/DELETED"
        string user_type "ADMIN/MANAGER/OPERATOR/VIEWER"
        string auth_method "PASSWORD/SSO/MFA"
        datetime created_at
        datetime updated_at
    }

    TENANT_CONFIG }o--|| USER_ACCOUNT : "updated by"
```
