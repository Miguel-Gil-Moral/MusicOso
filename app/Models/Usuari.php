<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Usuari extends Authenticatable // Permite utilizar la autenticación de Laravel
{
    protected $table = 'usuaris';

    public $timestamps = false;

    protected $fillable = [
        'nom',
        'contrasenya',
        'nivells_superats',
        'rol'
    ];

    protected $hidden = [ //Oculta la contraseña al convertir el modelo a JSON o array
        'contrasenya',
    ];

    protected function casts(): array
    {
        return [
            'contrasenya' => 'hashed',
        ];
    }

    public function getAuthPasswordName(): string //Porque Laravel espera por defecto una columna llamada password
    {
        return 'contrasenya';
    }

    public function rolAssignat(): BelongsTo
    {
        return $this->belongsTo(Rol::class, 'rol');
    }

    public function sesions(): HasMany
    {
        return $this->hasMany(Sesio::class, 'id_usuari');
    }
}