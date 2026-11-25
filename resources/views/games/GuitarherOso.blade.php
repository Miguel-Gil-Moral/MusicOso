
@extends('games.main')

@section('title', 'Mapa')

@section('content')
    <audio id="musica-joc" loop preload="auto">
    </audio>
    <button type="button" class="back-button" data-leave-dialog="confirmar-salida-guitarher-oso" aria-label="Volver al mapa">
        <img src="{{ Vite::asset('resources/assets/backButton.png') }}" alt="">
    </button>
    <x-confirm-leave-level dialog-id="confirmar-salida-guitarher-oso" />
    <div id="Pantalla_principal">
        <header id="header">
            <div id="cartel-container">
                <img
                    src="{{ Vite::asset('resources/assets/osoDancer/cartel.svg') }}"
                    id="cartel-img"
                    alt=""
                >
                <div id="cartel-texto">
                    <h1 id="titulo">Guitar <br> herOso</h1>
                </div>
            </div>
        </header>
        <p id="mensaje-juego" class="mensaje-juego mensaje-juego-visible" role="alert" aria-live="assertive">
            Pulsa cualquier tecla para empezar
        </p>
        <div class="Gameplay-container">
            <div class="controles-wrapper">
                <div class="combo-cartel-container">
                    <img
                        src="{{ Vite::asset('resources/assets/osoDancer/cartel.svg') }}"
                        class="combo-cartel-img"
                        alt=""
                    >
                    <div id="combo" class="combo" aria-live="polite">Combo: 0</div>
                </div>
                <div id="Controles" class="Gameplay">
                <div id="7" class="nota control">
                    <p>J</p>
                </div>

                <div id="6" class="nota control">
                    <p>H</p>
                </div>

                <div id="5" class="nota control">
                    <p>G</p>
                </div>

                <div id="4" class="nota control">
                    <p>F</p>
                </div>

                <div id="3" class="nota control">
                    <p>D</p>
                </div>

                <div id="2" class="nota control">
                    <p>S</p>
                </div>

                <div id="1" class="nota control">
                    <p>A</p>
                </div>
                </div>
            </div>
            <div id="Pentagrama" class="Gameplay">

                <div id="G" class="nota">
                    <div class="linea-blanca"></div>
                </div>

                <div id="F" class="nota">
                  <div class="linea-horizontal"></div>
                </div>

                <div id="E" class="nota">
                    <div class="linea-blanca"></div>
                </div>

                <div id="D" class="nota">
                  <div class="linea-horizontal"></div>
                </div>

                <div id="C" class="nota">
                    <div class="linea-blanca"></div>
                </div>

                <div id="B" class="nota">
                  <div class="linea-horizontal"></div>
                </div>

                <div id="A" class="nota">
                    <div class="linea-blanca"></div>
                </div>
            </div>
            <div class="marco-nivel">
                <img
                    src="{{ Vite::asset('resources/assets/osoDancer/barra.svg') }}"
                    class="marco-nivel-img"
                    alt=""
                    aria-hidden="true"
                >
                <div class="barra-nivel">
                    <div
                        id="marcador-nivel"
                        class="marcador-nivel"
                        role="progressbar"
                        aria-label="Precisión"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow="50"
                    ></div>
                </div>
            </div>
        </div>
    </div>
   
@endsection

@push('scripts')
    @vite([
        'resources/css/games/GuitarherOso.css',
        'resources/css/components/confirm-leave-level.css',
        'resources/js/components/confirm-leave-level.js',
        'resources/js/games/GuitarherOso/Controls.js',
    ])
@endpush
