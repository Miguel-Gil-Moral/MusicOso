
@extends('games.main')

@section('title', 'Mapa')

@section('content')
    <a href="{{ route('welcome') }}" class="back-button"><img src="{{ Vite::asset('resources/assets/backButton.png') }}" alt="Volver"></a>
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
<img src="{{ Vite::asset('resources/assets/osoDancer/corazonEntero.png') }}" alt="Vida" class="vida" height="70vw">
<img src="{{ Vite::asset('resources/assets/osoDancer/corazonEntero.png') }}" alt="Vida" class="vida" height="70vw">
<img src="{{ Vite::asset('resources/assets/osoDancer/corazonEntero.png') }}" alt="Vida" class="vida" height="70vw">

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
    @vite(['resources/css/games/osoDancer.css', 'resources/js/games/osoDancer/app.js'])
@endpush
