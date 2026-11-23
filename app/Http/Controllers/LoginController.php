<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
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
        $usuari = Usuario::where('nom', $request->input('nom'))->first();

        if ($usuari && Hash::check($request->input('password'), $usuari->password)){
            Auth::login($usuari);
            $response = redirect('welcome');
        } else {
            session()->flash('error', 'Las credenciales son erroneas');
            $response = redirect()->back()->withInput();
        }

        return $response;
    }

    public function logout(Request $request) {
        Auth::logout();
        return redirect('welcome');
    }
}
