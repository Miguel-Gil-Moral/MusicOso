<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuariSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $playerRoleId = DB::table('rols')->where('nom', 'Jugador')->value('id');
        $adminRoleId = DB::table('rols')->where('nom', 'Administrador')->value('id');
        $firstLevelId = DB::table('nivells')->min('id');

        foreach ([
            ['nom' => 'Admin', 'password' => 'password', 'rols_id' => $adminRoleId],
            ['nom' => 'Jugador1', 'password' => 'password', 'rols_id' => $playerRoleId],
            ['nom' => 'Jugador2', 'password' => 'password', 'rols_id' => $playerRoleId],
        ] as $user) {
            DB::table('usuaris')->updateOrInsert(
                ['nom' => $user['nom']],
                [
                    'nom' => $user['nom'],
                    'password' => Hash::make($user['password']),
                    'nivells_id' => $firstLevelId,
                    'rols_id' => $user['rols_id'],
                ],
            );
        }
    }
}
