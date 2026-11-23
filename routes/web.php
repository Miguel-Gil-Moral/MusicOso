<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::get('/', function () {
        return view('welcome');
    })->name('welcome');
});

Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login'])->name('login.submit');
Route::get('logout', [LoginController::class, 'logout'])->name('logout');

Route::view('/games/osoDancer', 'games.osoDancer')->name('games.osoDancer');
Route::view('/games/GuitarherOso', 'games.GuitarherOso')->name('games.GuitarherOso');
Route::view('/games/GeOsometryDash', 'games.GeOsometryDash')->name('games.GeOsometryDash');

Route::resource('usuari', UsuarioController::class);