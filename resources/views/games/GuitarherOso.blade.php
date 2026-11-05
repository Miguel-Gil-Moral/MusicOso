
@extends('games.main')

@section('title', 'Mapa')

@section('content')
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="css.css">
    <script src="Controls.js" defer></script>
</head>
<body>
    <audio id="musica-joc" autoplay loop preload="auto">
        <source src="src/Canción de Pou (1 hora) [zHXauqz3ixM].mp3" type="audio/mpeg">
    </audio>
    <div id="Pantalla_principal">
        <h1>Guitar herOso</h1>
        <p>Notes Encertades: <span id="contador-notas">0</span></p>
        <div class="Gameplay-container">
            <div id="Controles" class="Gameplay">
                <div id="7" class="nota control">
                    <p>Sol J</p>
                </div>

                <div id="6" class="nota control">
                    <p>Fa H</p>
                </div>

                <div id="5" class="nota control">
                    <p>Mi G</p>
                </div>

                <div id="4" class="nota control">
                    <p>Re F</p>
                </div>

                <div id="3" class="nota control">
                    <p>Do D</p>
                </div>

                <div id="2" class="nota control">
                    <p>Si S</p>
                </div>

                <div id="1" class="nota control">
                    <p>La A</p>
                </div>
            </div>
            <div id="Pentagrama" class="Gameplay">

                <div id="G" class="nota">
                </div>

                <div id="F" class="nota">
                  <div class="linea-horizontal"></div>
                </div>

                <div id="E" class="nota">
                </div>

                <div id="D" class="nota">
                  <div class="linea-horizontal"></div>
                </div>

                <div id="C" class="nota">
                </div>

                <div id="B" class="nota">
                  <div class="linea-horizontal"></div>
                </div>

                <div id="A" class="nota">
                </div>
            </div>
        </div>
    </div>
   
</body>
</html>
@endsection

@push('scripts')
    @vite(['resources/css/games/GuitarherOso.css', 'resources/js/games/GuitarherOso/Controls.js'])
@endpush
