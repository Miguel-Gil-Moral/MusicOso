<?php

namespace App\Http\Controllers;

use App\Models\Rol;
use App\Models\Usuari;
use App\Services\SesioService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        return view('welcome');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, SesioService $sesioService)
    {
        $dades = $request->validateWithBag('registro', [
            'nom' => ['required', 'string', 'max:255', 'unique:usuaris,nom'],
            'contrasenya' => ['required', 'string', 'min:8', 'confirmed'],
        ], ['nom.unique' => 'Este nombre de usuario ya está en uso.']);

        $rolUsuari = Rol::firstOrCreate(['nom' => 'Usuari']);

        $usuari = Usuari::create([
            'nom' => $dades['nom'],
            'contrasenya' => $dades['contrasenya'],
            'rol' => $rolUsuari->id,
        ]);

        Auth::login($usuari);
        $request->session()->regenerate();
        $sesioService->iniciar($request, $usuari);

        return redirect()->route('welcome');
    }

    /**
     * Display the specified resource.
     */
    public function show(Usuari $usuari)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Usuari $usuari)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Usuari $usuari)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Usuari $usuari)
    {
        //
    }
}
