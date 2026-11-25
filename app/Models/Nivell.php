<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Nivell extends Model
{
    protected $table = 'nivells';

    public $timestamps = false;

    public $incrementing = false;

    protected $primaryKey = null;

    protected $fillable = [
        'numero_nivell',
        'nom_joc'
    ];
}