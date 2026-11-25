<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <link rel="icon" type="image/png" href="{{ asset('icono.png') }}">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'MusicOso')</title>
    @vite('resources/css/app.css')
</head>
<body style="position:relative; min-height:100vh; margin:0;">
    @yield('content')
    <footer style="position:fixed; bottom:0; right:0; background:rgba(255,255,255,0.6); padding:4px 8px; font-size:0.9rem; border-radius:4px; z-index:1000;">
        Versión {{ config('app.version', '1.0.0') }}
    </footer>
</body>
</html>
