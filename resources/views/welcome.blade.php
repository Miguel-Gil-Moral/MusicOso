<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>My App</title>
        @vite('resources/css/welcome.css')
    </head>

    <body class="welcome-page">
        <div
            class="welcome-background"
            aria-hidden="true"
        ></div>

        <div class="welcome-content">
            <h1>Welcome to My App</h1>
            <a href="{{ route('games.osoDancer') }}">Go to Oso Dancer Game</a>
        </div>
    </body>
</html>
