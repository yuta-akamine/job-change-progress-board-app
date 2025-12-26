# アーキテクチャ

## 概要
- バックエンド: Laravel 12
- フロントエンド: React + Inertia + Vite
- DB: MySQL
- スタイル: Tailwind

## DB設計
- applications
  - id: bigint
  - user_id: bigint (FK)
  - company_name: string
  - role: string (nullable)
  - status: string
  - interview_at: timestamp (nullable)
  - notes: text (nullable)
  - indexes:
    - user_id (index, foreign key -> users.id)
    - status (index)

## API一覧
- GET /applications
- POST /applications
- PATCH /applications/{id}
- DELETE /applications/{id}
- PATCH /applications/{id}/status  # ドラッグ時のステータス更新用

## フロント画面
- ダッシュボード (カンバン)
- アプリケーション作成モーダル
- アプリケーションカード
- 認証ページ (Breeze)

## 非機能点
- 認可: user_id == auth()->id()
- CSRF: Laravel標準
- ドラッグ&ドロップ
