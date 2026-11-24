<?php

namespace App\Http\Controllers;

use App\Models\Usuari;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    //
    public function showLoginForm() {
        return view('auth.login');
    }

    public function login(Request $request) {
        $credencials = $request->validate([
            'nom' => ['required', 'string'],
            'contrasenya' => ['required', 'string'],
        ]);

        $usuari = Usuari::where('nom', $credencials['nom'])->first();

        if ($usuari && Hash::check($credencials['contrasenya'], $usuari->contrasenya)) {
            Auth::login($usuari);
            $request->session()->regenerate();

            return redirect()->intended(route('welcome'));
        }

        return back()
            ->withErrors(['nom' => 'Las credenciales no son correctas.'])
            ->onlyInput('nom');
    }

    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
