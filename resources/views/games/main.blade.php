
<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="icon" type="image/png" href="{{ asset('icono.png') }}">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Mis Juegos')</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Fredoka One', sans-serif;
        }

        button, input, select, textarea {
            font-family: inherit;
        }
    </style>
</head>
<body>
    @yield('content')

    @stack('scripts')
</body>
</html>
