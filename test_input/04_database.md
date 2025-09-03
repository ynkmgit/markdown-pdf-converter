# データベース設計書

## ER図

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    USERS ||--o{ ADDRESSES : has
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : included_in
    CATEGORIES ||--o{ PRODUCTS : contains
    
    USERS {
        int user_id PK
        string username UK
        string email UK
        string password_hash
        datetime created_at
        datetime updated_at
    }
    
    ADDRESSES {
        int address_id PK
        int user_id FK
        string type
        string postal_code
        string prefecture
        string city
        string street
        boolean is_default
    }
    
    ORDERS {
        int order_id PK
        int user_id FK
        string status
        decimal total_amount
        datetime order_date
        datetime shipped_date
    }
    
    ORDER_ITEMS {
        int item_id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
    }
    
    PRODUCTS {
        int product_id PK
        int category_id FK
        string name
        text description
        decimal price
        int stock_quantity
        boolean is_active
    }
    
    CATEGORIES {
        int category_id PK
        string name
        string slug UK
        int parent_id FK
    }
```

## テーブル定義

### USERSテーブル

| カラム名 | データ型 | NULL | キー | デフォルト | 説明 |
|---------|----------|------|------|------------|------|
| user_id | INT | NO | PRI | AUTO_INCREMENT | ユーザーID |
| username | VARCHAR(50) | NO | UNI | | ユーザー名 |
| email | VARCHAR(255) | NO | UNI | | メールアドレス |
| password_hash | VARCHAR(255) | NO | | | パスワードハッシュ |
| created_at | TIMESTAMP | NO | | CURRENT_TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | NO | | CURRENT_TIMESTAMP | 更新日時 |

### インデックス

```sql
-- ユーザーテーブル
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 注文テーブル
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);

-- 商品テーブル
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
```

## データフロー

```mermaid
graph LR
    A[Webアプリ] --> B[API層]
    B --> C[ビジネスロジック]
    C --> D[DAOレイヤー]
    D --> E[(MySQL)]
    D --> F[(Redisキャッシュ)]
    E --> G[レプリケーション]
    G --> H[(読み取り専用DB)]
```