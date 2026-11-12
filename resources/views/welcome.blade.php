
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Selección de niveles</title>

    @vite('resources/css/welcome.css')
</head>

<body class="welcome-page">

    <div class="welcome-background">

        @for ($i = 1; $i <= 9; $i++)
        <a href="{{ route('games.osoDancer') }}"
           class="boton-nivel nivel-{{ $i }}"
           aria-label="Jugar nivel {{ $i }}">
        </a>
        @endfor

    </div>

</body>
</html>
