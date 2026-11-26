<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nivell extends Model
{
    protected $table = 'nivells';

    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = null;
// Eloquent no soporta claves primarias compuestas.
// La PK ya está definida en la migración (numero_nivell, nom_joc).
    protected $fillable = [
        'numero_nivell',
        'nom_joc'
    ];
}