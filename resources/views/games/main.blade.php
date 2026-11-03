
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Mis Juegos')</title>
</head>
<body>
    @yield('content')

    @stack('scripts')
</body>
</html>