
@extends('games.main')

@section('title', 'Mapa')

@section('content')
    <header id="header"></header>
    <p id="mensaje"></p>

    <div id="vidas">
<img src="{{ Vite::asset('resources/assets/osoDancer/corazonEntero.png') }}" alt="Vida" class="vida" height="70vw">
<img src="{{ Vite::asset('resources/assets/osoDancer/corazonEntero.png') }}" alt="Vida" class="vida" height="70vw">
<img src="{{ Vite::asset('resources/assets/osoDancer/corazonEntero.png') }}" alt="Vida" class="vida" height="70vw">

</div>

    <main id="game">
        <div id="map"></div>
    </main>

    <div class="timer-bar">
        <div class="objetivo"></div>
        <div class="izquierda"></div>
        <div class="derecha"></div>
    </div>
@endsection

@push('scripts')
    @vite(['resources/css/games/osoDancer.css', 'resources/js/games/osoDancer/app.js'])
@endpush
