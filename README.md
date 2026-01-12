# 就活ステータス管理ボードアプリ

就職・転職活動における応募企業・選考状況を「一目で把握できる状態」にすることを目的とした Web アプリケーションです。

## 本番環境

**デプロイ済みURL:** https://job-change-progress-board-app-production.up.railway.app/

## 主な機能

### 認証
- ユーザー登録
- ログイン / ログアウト
- Laravel Breeze による認証機能

### 応募情報管理
応募情報の CRUD 操作が可能です。以下の情報を管理できます：

- **企業名**（必須）
- **職種**（任意）
- **選考ステータス**（必須）
- **面接日**（任意）
- **メモ**（任意）

### カンバン表示
応募情報をステータスごとにカンバン形式で一覧表示します。各応募はカードとして表示され、ドラッグ＆ドロップでステータスを変更できます。

### 選考ステータス
以下のステータスが利用可能です：

- カジュアル面談
- 応募予定
- 書類選考
- 筆記試験
- 面接（一次〜最終）
- 内定
- 辞退/見送り

## 使用技術スタック

- **Backend:** Laravel 12 (PHP 8.4)
- **Frontend:** React + Inertia.js + Vite
- **Styling:** Tailwind CSS
- **Database:** MySQL
- **開発環境:** Laravel Sail (Docker)

## ローカル開発環境の起動方法

### 前提条件
- Docker と Docker Compose がインストールされていること
- Composer がインストールされていること

### セットアップ手順

1. **環境変数の設定**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

2. **依存関係のインストール**
   ```bash
   composer install
   ./vendor/bin/sail npm ci
   ```

3. **Sail コンテナの起動**
   ```bash
   ./vendor/bin/sail up -d
   ```

4. **データベースマイグレーションの実行**
   ```bash
   ./vendor/bin/sail artisan migrate
   ```

5. **フロントエンド開発サーバーの起動（HMR 有効）**
   ```bash
   ./vendor/bin/sail npm run dev
   ```

6. **アプリケーションへのアクセス**
   - ブラウザで http://localhost にアクセス

### よく使うコマンド

- **コンテナの停止:** `./vendor/bin/sail down`
- **コンテナの再起動:** `./vendor/bin/sail restart`
- **Artisan コマンド実行:** `./vendor/bin/sail artisan [command]`
- **NPM コマンド実行:** `./vendor/bin/sail npm [command]`
- **本番ビルド:** `./vendor/bin/sail npm run build`

## 設計上の重要な意思決定

### PHP 8.4 の使用
本番環境（Railway）では `nixpacks.toml` で PHP 8.4 を明示的に指定しています。開発環境（Laravel Sail）も PHP 8.4 を使用しており、Symfony 8.0.x パッケージが PHP 8.4 以上を要求するため、本番環境も PHP 8.4 に統一しています。

### HTTPS 強制設定
本番環境で Mixed Content エラーを解消するため、`AppServiceProvider::boot()` で条件付きで HTTPS を強制しています。条件は `APP_FORCE_HTTPS=true` または `APP_ENV=production` です。開発環境には影響しない安全な実装となっています。

### ステータス設計
ステータスは `string` カラムでアプリ層で列挙しています。ENUM 型は使用せず、将来のステータス追加を容易にする設計としています。

### 認可
応募情報は `user_id == auth()->id()` の条件で認可されており、自分のデータのみ操作可能です。

## セキュリティ

- 認証必須（未ログインでは操作不可）
- 応募情報は自分のデータのみ操作可能
- CSRF 対策は Laravel 標準機構を利用

## ドキュメント

詳細な要件定義、アーキテクチャ、設計判断については `docs/` ディレクトリを参照してください：

- `docs/requirements.md` - 要件定義
- `docs/architecture.md` - アーキテクチャ設計
- `docs/decisions.md` - 設計上の重要な意思決定
- `docs/manual_test.md` - 完成判定チェックリスト

## ライセンス

このプロジェクトはオープンソースソフトウェアとして MIT ライセンスの下で公開されています。
