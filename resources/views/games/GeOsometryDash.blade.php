@extends('games.main')

@section('title', 'Mapa')

@section('content')

<div id="contenedorJuego">
    <button id="botonJuego">Jugar</button>
</div>

@endsection

@push('scripts')
    @vite([
        'resources/css/games/GeOsometryDash.css',
        'resources/js/GeOsometryDash/script.js',
        'resources/js/GeOsometryDash/colisiones.js'])
@endpush