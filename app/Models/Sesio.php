<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sesio extends Model
{
    protected $table = 'sesions';

    public $timestamps = false;

    protected $fillable = [
        'id_usuari',
        'temps_sesio',
        'data_hora_inici',
    ];

    protected function casts(): array {
        return [
            'data_hora_inici' => 'datetime',
            'temps_sesio' => 'integer',
        ];
    }

    public function usuari(): BelongsTo { //Solo un usuario
        return $this->belongsTo(Usuari::class, 'id_usuari');
    }

    public function metricas(): HasMany { //Una sesion puede tener muchas metricas
        return $this->hasMany(Metrica::class, 'id_sesio');
    }
}
