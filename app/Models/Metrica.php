<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Metrica extends Model
{
    protected $table = 'metricas';

    public $timestamps = false;

    protected $fillable = [
        'id_sesio',
        'nom_joc',
        'numero_nivell',
        'precisio',
        'temps_partida',
        'pasos',
        'vidas',
        'estrellas',
        'combo',
        'intents',
        'data_hora_inici'
    ];

    protected function casts(): array
    {
        return [
            'data_hora_inici' => 'datetime',
            'precisio' => 'decimal:2',
        ];
    }

    public function sesio(): BelongsTo
    {
        return $this->belongsTo(Sesio::class, 'id_sesio');
    }

    public function obtenirNivell(): ?Nivell
    {
        return Nivell::where('numero_nivell', $this->numero_nivell)
            ->where('nom_joc', $this->nom_joc)
            ->first();
    }
}