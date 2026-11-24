@extends('layouts.app')

@section('title', 'Selección de niveles')

@section('content')
@vite('resources/css/welcome.css')

<div class="welcome-background">
    <form action="{{ route('logout') }}" method="POST" class="logout-form">
        @csrf
        <button type="submit" class="logout-button" aria-label="Cerrar sesión">
            <img src="{{ Vite::asset('resources/assets/buttonLogout.png') }}" alt="">
        </button>
    </form>

    @for ($i = 1; $i <= 6; $i++)
        <a href="{{ route('games.osoDancer') }}"
           class="boton-nivel nivel-{{ $i }}"
           aria-label="Jugar nivel {{ $i }}"></a>
    @endfor

    @for ($i = 7; $i <= 9; $i++)
        <a href="{{ route('games.GuitarherOso') }}"
           class="boton-nivel nivel-{{ $i }}"
           aria-label="Jugar nivel {{ $i }}"></a>
    @endfor
</div>

<script>
    window.addEventListener("load", function() {
        const contenedor = document.querySelector(".welcome-background");

        window.scrollTo(0, document.body.scrollHeight);
        contenedor.scrollTop = contenedor.scrollHeight;
    });
</script>
@endsection
