<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (['Administrador', 'Jugador'] as $role) {
            DB::table('rols')->updateOrInsert(
                ['nom' => $role],
                ['nom' => $role],
            );
        }
    }
}
