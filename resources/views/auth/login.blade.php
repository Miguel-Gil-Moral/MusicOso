<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>@yield('title')</title>
    
    <link href="https://cdn.jsdelivr.net/npm/flowbite@4.0.1/dist/flowbite.min.css" rel="stylesheet" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://googleapis.com" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}"></link>
</head>
<body>

    <div class="panelLogin w-full max-w-sm bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs">
        <form action="{{ route('login.submit') }}" method="post">
            @csrf
            <h1 class="text-xl font-semibold text-heading mb-6">Inicia sesión</h1>
            @include('auth.errors')

            <div class="mb-4">
                <label for="nom" class="block mb-2.5 text-sm font-medium text-heading">Nombre</label>
                <input id="nom" type="text" name="nom" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="example@company.com" value="{{ old('nom') }}" required />
            </div>
            <div>
                <label for="password" class="block mb-2.5 text-sm font-medium text-heading">Contraseña</label>
                <input id="password" type="password" name="password" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="•••••••••" value="{{ old('password') }}" required />
            </div>
            <button id="botonLogin" type="submit" class="botonLogin text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3">Iniciar Sesión</button>
            <div class="preguntaLogin text-sm font-medium text-body">No tienes cuenta? <a href="#" class="cambiarPanel text-fg-brand hover:underline">Crear cuenta</a></div>
        </form>
    </div>

    <div class="panelLogin w-full max-w-sm bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs hidden">
        <form action="{{ route('usuari.store') }}" method="POST">
            @csrf

            <h1 class="text-xl font-semibold text-heading mb-6">Crear cuenta</h1>
            <div class="mb-4">
                <label for="nom" class="block mb-2.5 text-sm font-medium text-heading">Nombre</label>
                <input id="nomb" type="text" name="nomb" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" required>
            </div>
            <div>
                <label for="password" class="block mb-2.5 text-sm font-medium text-heading">Contraseña</label>
                <input id="password" type="password" name="password" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" required />
            </div>
            <button type="submit" class="botonLogin text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3">Iniciar Sesión</button>
            <div class="preguntaLogin text-sm font-medium text-body">Ya tienes cuenta? <a href="#" class="cambiarPanel text-fg-brand hover:underline">Iniciar sesión</a></div>
        </form>
    </div>
</body>
<script src="{{ asset('js/script.js') }}"></script>
</html>