<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::view('/games/osoDancer', 'games.osoDancer')->name('games.osoDancer');
