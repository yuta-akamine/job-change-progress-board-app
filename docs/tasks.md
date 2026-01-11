# タスク

## 準備
- [x] env: .env.example をコピーして .env を作成、APP_KEY を生成（`php artisan key:generate`）
- [x] deps: Composer と npm の依存をインストール（`composer install` / `./vendor/bin/sail npm ci`）
- [x] sail: Sail コンテナを起動して動作確認（`./vendor/bin/sail up -d`）

## 認証（先に行う：users テーブルを確実に用意するため）
- [x] breeze: Laravel Breeze インストール & 認証 scaffold（React + Inertia 版）
- [x] migrate-users: 認証に必要なマイグレーションを実行（users テーブルが作成されることを確認）

## DB・バックエンド
- [x] migration: applications migration を作成（user_id に FK & index を付与）
- [x] migrate: `php artisan migrate` を実行してテーブル作成を確認
- [x] model: Applicationモデル + user relation（$fillable / casts を設定）
- [x] request: FormRequest（StoreApplicationRequest / UpdateApplicationRequest）を作成してバリデーションを定義
- [x] policy/auth: 簡易 Policy かコントローラ内チェックで `user_id == auth()->id()` を担保
- [x] controller: ApplicationController (index, store, update, destroy, updateStatus) を作成（バリデーション使用）
- [x] routes: web.php にルート追加・ミドルウェア auth を付与

## フロント
- [x] inertia_page: ダッシュボードページ (Inertia) を作成 + applications を取得して渡す
- [x] kanban_ui: Reactでカンバン表示（列固定）を作成（cards を status 毎にレンダリング）
- [x] create_modal: Createフォーム（Inertia form）を作成（FormRequest のフィールドと一致）
- [x] drag: dnd-kit（or react-beautiful-dnd）でドラッグ実装 + PATCH /applications/{id}/status を呼ぶ（optimistic update）
- [x] dev: `./vendor/bin/sail npm run dev` で HMR を確認

## レスポンシブ・スタイル
- [ ] tailwind: 最低限の見栄え調整（カード・列・モーダルのレスポンシブ確認）

## テスト・確認
- [x] seed: テスト用データを少量シード（開発確認用）
- [ ] manual_test: 新規登録→ログイン→登録→カンバン表示→ドラッグ→DB反映 を検証
- [ ] lint/build: `php -l` / `./vendor/bin/sail npm run build`（本番ビルドで失敗しないか確認）

## デプロイ
- [ ] deploy_prepare: Render/Railway の環境変数準備（DB URL, APP_KEY, APP_DEBUG=false など）
- [ ] deploy_build: 本番ビルドを実行（`npm run build` / `composer install --no-dev --optimize-autoloader`）
- [ ] migrate_prod: 本番で `php artisan migrate --force` を実行
- [ ] smoke_test: 公開URLで簡単な動作確認（ログイン・カンバン表示・ステータス変更）

## 緩衝・ドキュメント
- [ ] commit: 各ステップで小さく commit & push（PR を作る場合は PR 説明に要件を添付）
- [ ] readme: README に起動方法・デモ手順を記載
- [ ] decisions: 重要な設計判断は docs/decisions.md に記録
