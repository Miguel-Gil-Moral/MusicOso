<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rol extends Model
{
    protected $table = 'rols';

    public $timestamps = false;

    protected $fillable = [
        'nom'
    ];

    public function usuaris(): HasMany
    {
        return $this->hasMany(Usuari::class, 'rol');
    }
}