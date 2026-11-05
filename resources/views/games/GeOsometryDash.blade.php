@extends('games.main')

@section('title', 'Mapa')

@section('content')

<body>
    
    <div id="contenedorJuego">
        <button id="botonJuego">Jugar</button>
    </div>

</body>
<script src="script.js"></script>
@endsection

@push('scripts')
    @vite(['resources/css/games/GeOsometryDash.css', 'resources/js/GeOsometryDash/script.js'])
@endpush