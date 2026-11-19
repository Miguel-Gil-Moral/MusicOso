<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JocSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Oso Dancer', 'Guitar herOso'] as $game) {
            DB::table('jocs')->updateOrInsert(
                ['nom' => $game],
                ['nom' => $game],
            );
        }
    }
}
