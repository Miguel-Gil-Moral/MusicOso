<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NivellSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $games = DB::table('jocs')->pluck('id', 'nom');

        foreach ($games as $gameName => $gameId) {
            for ($level = 1; $level <= 3; $level++) {
                DB::table('nivells')->updateOrInsert(
                    [
                        'jocs_id' => $gameId,
                        'id' => ($gameId - 1) * 3 + $level,
                    ],
                    [
                        'jocs_id' => $gameId,
                    ],
                );
            }
        }
    }
}
