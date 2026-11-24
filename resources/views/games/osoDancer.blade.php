
@extends('games.main')

@section('title', 'Mapa')

@section('content')
    <button type="button" class="back-button" data-leave-dialog="confirmar-salida-oso-dancer" aria-label="Volver al mapa">
        <img src="{{ Vite::asset('resources/assets/backButton.png') }}" alt="">
    </button>
    <x-confirm-leave-level dialog-id="confirmar-salida-oso-dancer" />
    <header id="header">
        <div id="cartel-container">
            <img src="{{ Vite::asset('resources/assets/osoDancer/cartel.svg') }}" id="cartel-img">
            <div id="cartel-texto">
                <h1 id="titulo">Oso <br> Dancer</h1>
            </div>
        </div>
    </header>
    <p id="mensaje"></p>

    <div id="vidas">
        <img src="{{ Vite::asset('resources/assets/osoDancer/corazonEntero.png') }}" alt="Vida" class="vida">
        <img src="{{ Vite::asset('resources/assets/osoDancer/corazonEntero.png') }}" alt="Vida" class="vida">
        <img src="{{ Vite::asset('resources/assets/osoDancer/corazonEntero.png') }}" alt="Vida" class="vida">
    </div>

    <main id="game">
        <div id="map"></div>
    </main>

    <div class="timer-bar-container">
        <img src="{{ Vite::asset('resources/assets/osoDancer/barra.svg') }}" id="timer-bar-img" alt="Barra de ritmo">
        <div class="timer-bar">
            <div class="objetivo"></div>
            <div class="izquierda"></div>
            <div class="derecha"></div>
        </div>
    </div>
@endsection

@push('scripts')
    @vite([
        'resources/css/games/osoDancer.css',
        'resources/css/components/confirm-leave-level.css',
        'resources/js/components/confirm-leave-level.js',
        'resources/js/games/osoDancer/app.js',
    ])
@endpush
