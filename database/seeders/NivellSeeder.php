<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NivellSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('nivells')->insert([
            ['numero_nivell' => 1, 'nom_joc' => 'MusicOso'],
            ['numero_nivell' => 2, 'nom_joc' => 'MusicOso'],
            ['numero_nivell' => 3, 'nom_joc' => 'MusicOso'],

            ['numero_nivell' => 1, 'nom_joc' => 'GeOsometryDash'],
            ['numero_nivell' => 2, 'nom_joc' => 'GeOsometryDash'],
            ['numero_nivell' => 3, 'nom_joc' => 'GeOsometryDash'],
            
            ['numero_nivell' => 1, 'nom_joc' => 'GitarherOso'],
            ['numero_nivell' => 2, 'nom_joc' => 'GitarherOso'],
            ['numero_nivell' => 3, 'nom_joc' => 'GitarherOso'],

        ]);
    }
}