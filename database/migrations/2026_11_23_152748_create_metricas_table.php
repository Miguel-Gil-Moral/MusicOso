<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('metricas', function (Blueprint $table) {
            $table->id();

            $table->foreignId('id_sesio')->constrained('sesions');

            $table->string('nom_joc');
            $table->integer('numero_nivell');

            $table->foreign(['numero_nivell', 'nom_joc'])
                ->references(['numero_nivell', 'nom_joc'])
                ->on('nivells');

            $table->decimal('precisio', 5, 2)->nullable();
            $table->integer('temps_partida')->nullable();
            $table->integer('pasos')->nullable();
            $table->integer('vidas')->nullable();
            $table->integer('estrellas')->nullable();
            $table->integer('combo')->nullable();
            $table->integer('intents')->nullable();

            $table->dateTime('data_hora_inici');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metricas');
    }
};
