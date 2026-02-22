# シンタックスハイライトテスト

各言語のコードブロックが正しくハイライトされることを確認する。

## JavaScript

```javascript
class EventEmitter {
  #listeners = new Map();

  on(event, callback) {
    if (!this.#listeners.has(event)) {
      this.#listeners.set(event, []);
    }
    this.#listeners.get(event).push(callback);
    return () => this.off(event, callback);
  }

  emit(event, ...args) {
    const callbacks = this.#listeners.get(event) ?? [];
    callbacks.forEach(cb => cb(...args));
  }

  off(event, callback) {
    const callbacks = this.#listeners.get(event);
    if (callbacks) {
      this.#listeners.set(event, callbacks.filter(cb => cb !== callback));
    }
  }
}

// 使用例
const emitter = new EventEmitter();
const unsubscribe = emitter.on('data', (msg) => console.log(`Received: ${msg}`));
emitter.emit('data', 'Hello World');
unsubscribe();
```

## Python

```python
from dataclasses import dataclass, field
from typing import Optional
import asyncio

@dataclass
class Config:
    host: str = "localhost"
    port: int = 8080
    debug: bool = False
    tags: list[str] = field(default_factory=list)

async def fetch_data(url: str, timeout: Optional[float] = None) -> dict:
    """非同期でデータを取得する"""
    async with aiohttp.ClientSession() as session:
        async with session.get(url, timeout=timeout) as response:
            if response.status != 200:
                raise ValueError(f"HTTP {response.status}")
            return await response.json()

# リスト内包表記とwalrus演算子
results = [y for x in range(100) if (y := x ** 2) > 50]
```

## Go

```go
package main

import (
	"context"
	"fmt"
	"sync"
)

type Worker struct {
	ID   int
	done chan struct{}
}

func (w *Worker) Start(ctx context.Context, wg *sync.WaitGroup, jobs <-chan int) {
	defer wg.Done()
	for {
		select {
		case job, ok := <-jobs:
			if !ok {
				return
			}
			fmt.Printf("Worker %d processing job %d\n", w.ID, job)
		case <-ctx.Done():
			fmt.Printf("Worker %d cancelled\n", w.ID)
			return
		}
	}
}
```

## SQL

```sql
WITH monthly_sales AS (
    SELECT
        DATE_TRUNC('month', order_date) AS month,
        category_id,
        SUM(amount) AS total,
        COUNT(DISTINCT customer_id) AS unique_customers,
        ROW_NUMBER() OVER (
            PARTITION BY DATE_TRUNC('month', order_date)
            ORDER BY SUM(amount) DESC
        ) AS rank
    FROM orders
    WHERE order_date >= '2025-01-01'
      AND status NOT IN ('cancelled', 'refunded')
    GROUP BY 1, 2
)
SELECT
    m.month,
    c.name AS category,
    m.total,
    m.unique_customers,
    m.rank
FROM monthly_sales m
JOIN categories c ON c.id = m.category_id
WHERE m.rank <= 5
ORDER BY m.month, m.rank;
```

## HTML

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>テストページ</title>
</head>
<body>
  <header>
    <nav aria-label="メインナビゲーション">
      <ul>
        <li><a href="#section1">セクション1</a></li>
        <li><a href="#section2">セクション2</a></li>
      </ul>
    </nav>
  </header>
  <main>
    <article id="section1">
      <h1>見出し</h1>
      <p>段落テキスト</p>
    </article>
  </main>
</body>
</html>
```

## CSS

```css
:root {
  --primary: #2563eb;
  --spacing-unit: 0.25rem;
}

.container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: calc(var(--spacing-unit) * 4);
  padding: calc(var(--spacing-unit) * 6);
}

.card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

@media (prefers-color-scheme: dark) {
  :root {
    --primary: #60a5fa;
  }
}
```

## Shell (Bash)

```bash
#!/bin/bash
set -euo pipefail

readonly LOG_DIR="/var/log/app"
readonly MAX_RETRIES=3

log() {
  local level="$1"; shift
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [${level}] $*" | tee -a "${LOG_DIR}/app.log"
}

retry() {
  local count=0
  until "$@"; do
    count=$((count + 1))
    if [[ $count -ge $MAX_RETRIES ]]; then
      log "ERROR" "Failed after ${MAX_RETRIES} attempts: $*"
      return 1
    fi
    log "WARN" "Retry ${count}/${MAX_RETRIES}: $*"
    sleep $((2 ** count))
  done
}

retry curl -sf "https://api.example.com/health" -o /dev/null
log "INFO" "Health check passed"
```

## YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web
    tier: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    spec:
      containers:
        - name: web
          image: app:latest
          ports:
            - containerPort: 8080
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
          resources:
            limits:
              memory: "256Mi"
              cpu: "500m"
```

## JSON

```json
{
  "name": "markdown-pdf-converter",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc --project tsconfig.json",
    "test": "jest --coverage",
    "lint": "eslint src/**/*.ts"
  },
  "dependencies": {
    "marked": "^12.0.0",
    "puppeteer": "^22.0.0"
  },
  "config": {
    "pdf": {
      "format": "A4",
      "margin": { "top": "20mm", "bottom": "20mm" },
      "printBackground": true
    }
  }
}
```

## Rust

```rust
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[derive(Debug, Clone)]
struct Cache<V: Clone> {
    store: Arc<Mutex<HashMap<String, V>>>,
    max_size: usize,
}

impl<V: Clone> Cache<V> {
    fn new(max_size: usize) -> Self {
        Self {
            store: Arc::new(Mutex::new(HashMap::new())),
            max_size,
        }
    }

    fn get(&self, key: &str) -> Option<V> {
        let store = self.store.lock().unwrap();
        store.get(key).cloned()
    }

    fn set(&self, key: String, value: V) -> Result<(), &'static str> {
        let mut store = self.store.lock().unwrap();
        if store.len() >= self.max_size && !store.contains_key(&key) {
            return Err("Cache is full");
        }
        store.insert(key, value);
        Ok(())
    }
}
```

## インラインコード混在

通常テキスト中の `inline code`、`const x = 42;`、`SELECT * FROM table` の表示確認。
