<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * 開発用 Application シーダー（Dashboard 確認用）
 */
class ApplicationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // User::first() が存在すればそれを使用、なければダミーユーザーを作成
        $user = User::first();
        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);
        }

        // 各ステータスを最低1件ずつ作成（Dashboard 確認用）
        $statuses = [
            'カジュアル面談',
            '応募予定',
            '書類選考',
            '筆記試験',
            '面接',
            '内定',
            '辞退/見送り',
        ];

        foreach ($statuses as $status) {
            Application::factory()->create([
                'user_id' => $user->id,
                'status' => $status,
                'company_name' => fake()->company(),
                'role' => fake()->optional(0.7)->jobTitle(),
                'interview_at' => fake()->optional(0.5)->dateTimeBetween('-1 month', '+1 month'),
                'notes' => fake()->optional(0.3)->sentence(),
            ]);
        }

        // 追加でランダムなステータスのデータを2-3件作成（合計7-10件程度）
        Application::factory()->count(3)->create([
            'user_id' => $user->id,
        ]);
    }
}

