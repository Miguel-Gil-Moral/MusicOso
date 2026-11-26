<?php

namespace App\Http\Controllers;

use App\Models\Metrica;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MetricaController extends Controller
{
    public function index()
    {
        return Metrica::all();
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $datos = $request->validate([
            'id_sesio' => 'required|exists:sesions,id',
            'nom_joc' => 'required|string',

            'numero_nivell' => [
                'required',
                'integer',
                Rule::exists('nivells', 'numero_nivell')
                    ->where('nom_joc', $request->nom_joc)
            ],

            'precisio' => 'nullable|numeric|min:0|max:100',
            'temps_partida' => 'nullable|integer|min:0',
            'pasos' => 'nullable|integer|min:0',
            'vidas' => 'nullable|integer|min:0',
            'estrellas' => 'nullable|integer|min:0|max:3',
            'combo' => 'nullable|integer|min:0',
            'intents' => 'nullable|integer|min:0',
            'data_hora_inici' => 'required|date'
        ]);

        $metrica = Metrica::create($datos);

        return response()->json($metrica);
    }

    public function show(string $id)
    {
        return Metrica::findOrFail($id);
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}