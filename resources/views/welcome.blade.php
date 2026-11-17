@extends('layouts.app')

@section('title', 'Selección de niveles')

@section('content')
@vite('resources/css/welcome.css')
<div class="welcome-background">
    @for ($i = 1; $i <= 9; $i++)
        <a href="{{ route('games.osoDancer') }}"
           class="boton-nivel nivel-{{ $i }}"
           aria-label="Jugar nivel {{ $i }}"></a>
    @endfor
</div>
@endsection