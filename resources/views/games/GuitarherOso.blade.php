
@extends('games.main')

@section('title', 'Mapa')

@section('content')
    <audio id="musica-joc" autoplay loop preload="auto">
    </audio>
    <div id="Pantalla_principal">
        <h1>Guitar herOso</h1>
    <p id="mensaje-juego" class="mensaje-juego" role="alert" aria-live="assertive"></p>
        <div class="Gameplay-container">
            <div class="controles-wrapper">
                <div id="combo" class="combo" aria-live="polite">Combo: 0</div>
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
            <div class="barra-nivel" aria-label="Nivel de precisión">
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
   
@endsection

@push('scripts')
    @vite(['resources/css/games/GuitarherOso.css', 'resources/js/games/GuitarherOso/Controls.js'])
@endpush
