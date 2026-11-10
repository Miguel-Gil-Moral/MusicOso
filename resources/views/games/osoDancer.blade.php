
@extends('games.main')

@section('title', 'Mapa')

@section('content')
    <header id="header"></header>
    <p id="mensaje"></p>

    <main id="game">
        <div id="map"></div>
    </main>

    <div class="timer-bar">
        <div class="izquierda"></div>
        <div class="derecha"></div>
    </div>
@endsection

@push('scripts')
    @vite(['resources/css/games/osoDancer.css', 'resources/js/games/osoDancer/app.js'])
@endpush
