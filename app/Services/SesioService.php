<?php

namespace App\Services;

use App\Models\Sesio;
use App\Models\Usuari;
use Illuminate\Http\Request;

class SesioService
{
    public function iniciar(Request $request, Usuari $usuari): Sesio
    {
        $sesio = Sesio::create([
            'id_usuari' => $usuari->id,
            'temps_sesio' => 0,
            'data_hora_inici' => now(),
        ]);

        $request->session()->put('id_sesio_actual', $sesio->id);

        return $sesio;
    }

    public function finalizar(Request $request, Usuari $usuari): void
    {
        $idSesio = $request->session()->get('id_sesio_actual');

        if ($idSesio) {
            $sesio = Sesio::whereKey($idSesio)
                ->where('id_usuari', $usuari->id)
                ->first();

            if ($sesio) {
                $sesio->update([
                    // temps_sesio es un entero: se guardan segundos completos, sin decimales.
                    'temps_sesio' => (int) $sesio->data_hora_inici->diffInSeconds(now()),
                ]);
            }
        }

        $request->session()->forget('id_sesio_actual');
    }
}
