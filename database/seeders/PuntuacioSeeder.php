<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PuntuacioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = DB::table('usuaris')->pluck('id');
        $levels = DB::table('nivells')->pluck('id');

        foreach ($users as $userId) {
            foreach ($levels as $levelId) {
                DB::table('puntuacions')->updateOrInsert(
                    [
                        'usuaris_id' => $userId,
                        'nivells_id' => $levelId,
                    ],
                    [
                        'puntuacio' => fake()->numberBetween(100, 10000),
                    ],
                );
            }
        }
    }
}
