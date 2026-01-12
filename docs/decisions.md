# decisions.md

## 2025-12-25 - プロジェクト開始（初期決定）
- 技術スタック: Laravel12 / React / Inertia / Tailwind / MySQL
  - 理由: 既定の要件、Inertiaでフロントとバックを素早く統合できるため
- タイムボックス: 8時間以内で MVP（実装・動作確認・デプロイ）
  - 理由: デモ目的のため短時間で価値を出す
- ステータス設計: string カラムでアプリ層で列挙（ENUMは後回し）
  - 理由: 将来の追加を容易にするため

## 2026-1-11- Application 編集範囲
- MVP では company_name / role を含む全項目を編集可能とする
- 理由: 実用性と CRUD 操作の一貫性を優先するため

## 2026-1-11 - Railway デプロイ設定（PHP バージョン）
- Railway デプロイ時に `nixpacks.toml` で PHP 8.4 を明示的に指定
- 理由: 
  - 開発環境（Laravel Sail）が PHP 8.4 を使用しており、`composer.lock` が PHP 8.4 用に生成されている
  - Symfony 8.0.x パッケージが PHP 8.4 以上を要求するため、本番環境も PHP 8.4 に統一する必要がある
  - デフォルトの PHP 8.2 環境では依存関係の互換性エラーが発生するため
- 実装: `nixpacks.toml` で PHP 8.4 と必要な拡張機能（pdo_mysql, mbstring, xml, curl, zip, bcmath, gd, intl）を指定
