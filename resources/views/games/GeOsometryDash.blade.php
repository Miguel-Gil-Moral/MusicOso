@extends('games.main')

@section('title', 'Mapa')

@section('content')

<link rel="stylesheet" href="{{ asset('GeOsometryDash/css/GeOsometryDash.css') }}">

<div>
    <p>Aqui las corcheas para que salten al ritmo</p>
</div>

<div id="contenedorJuego">
    <button id="botonJuego">Jugar</button>
    <div id="niveles">
        <a data-nombre="StereOso Madness">
            <div class="nivel">
                <h4>Dificultad: Facíl</h4>
                <h2>StereOso Madness</h2>
                <p>Mecánicas: Surf y Espejo</p>
            </div>
        </a>
        <a data-nombre="Oso Can't Let Go">
            <div class="nivel">
                <h4>Dificultad: Media</h4>
                <h2>Oso Can't Let Go</h2>
                <p>Mecánicas: Surf, Espejo, Bola, Bayas</p>
            </div>
        </a>
        <a data-nombre="UltraOso">
            <div class="nivel">
                <h4>Dificultad: Difícil</h4>
                <h2>UltraOso</h2>
                <p>Mecánicas: Surf, Espejo, Bola, Ufo, Bayas, Trampolines</p>
            </div>
        </a>
    </div>
    <div id="pantallaPausa">
        <h1 id="encabezadoPausa"></h1>
        <div>
            <button id="botonMenu">Menú</button>
            <button id="botonReanudar">Reanudar</button>
            <button id="botonReiniciar">Reintentar</button>
        </div>
    </div>
</div>

<script src='{{ asset('GeOsometryDash/js/script.js') }}'></script>
<script src='{{ asset('GeOsometryDash/js/colisiones.js') }}'></script>

@endsection
{{-- 
@push('scripts')
    @vite(['resources/css/games/GeOsometryDash.css', 'resources/js/GeOsometryDash/script.js', 'resources/js/GeOsometryDash/colisiones.js'])
@endpush --}}