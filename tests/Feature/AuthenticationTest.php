<?php

use App\Models\Rol;
use App\Models\Usuari;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('a user can log in with nom and contrasenya', function () {
    $rol = Rol::create(['nom' => 'Usuari']);
    $usuari = Usuari::create([
        'nom' => 'oso',
        'contrasenya' => Hash::make('contrasenya-segura'),
        'rol' => $rol->id,
    ]);

    $response = $this->post(route('login.submit'), [
        'nom' => $usuari->nom,
        'contrasenya' => 'contrasenya-segura',
    ]);

    $response->assertRedirect(route('welcome'));
    $this->assertAuthenticatedAs($usuari);
});

test('registration stores the fields defined by usuaris', function () {
    $response = $this->post(route('usuari.store'), [
        'nom' => 'oso-nuevo',
        'contrasenya' => 'contrasenya-segura',
        'contrasenya_confirmation' => 'contrasenya-segura',
    ]);

    $usuari = Usuari::where('nom', 'oso-nuevo')->firstOrFail();

    $response->assertRedirect(route('welcome'));
    $this->assertAuthenticatedAs($usuari);
    expect(Hash::check('contrasenya-segura', $usuari->contrasenya))->toBeTrue();
    expect($usuari->nivells_superats)->toBe(0);
    expect($usuari->rolAssignat->nom)->toBe('Usuari');
});
