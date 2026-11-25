<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sesions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_usuari')->constrained('usuaris');
            $table->integer('temps_sesio');
            $table->dateTime('data_hora_inici');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sesions');
    }
};
