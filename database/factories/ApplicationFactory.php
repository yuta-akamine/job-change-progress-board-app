<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Application>
 */
class ApplicationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\Illuminate\Database\Eloquent\Model>
     */
    protected $model = Application::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = [
            'カジュアル面談',
            '応募予定',
            '書類選考',
            '筆記試験',
            '面接（一次〜最終）',
            '内定',
            '辞退/見送り',
        ];

        // return [
        //     'user_id' => User::factory(),
        //     'company_name' => fake()->company(),
        //     'role' => fake()->optional()->jobTitle(),
        //     'status' => fake()->randomElement($statuses),
        //     'interview_at' => fake()->optional()->dateTimeBetween('-1 month', '+1 month'),
        //     'notes' => fake()->optional()->sentence(),
        // ];
        return [
            'user_id' => User::factory(),
            'company_name' => $this->faker->company(),
            'role' => $this->faker->optional()->jobTitle(),
            'status' => $this->faker->randomElement($statuses),
            'interview_at' => $this->faker->optional()->dateTimeBetween('-1 month', '+1 month'),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}

