
@extends('games.main')

@section('title', 'Mapa')

@section('content')

<body>
    
    <div id="contenedorJuego">
        <button id="botonJuego">Jugar</button>
    </div>

</body>
<script src=""></script>
@endsection

@push('srcipts')
    @vite(['resources/css/games/'GeOsometry\ Dash.css, 'resources/js/'GeOsometry\ Dash/script.js])
@endpush