<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::view('/games/osoDancer', 'games.osoDancer')->name('games.osoDancer');
Route::view('/games/GuitarherOso', 'games.GuitarherOso')->name('games.GuitarherOso');