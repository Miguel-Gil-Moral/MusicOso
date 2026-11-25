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

    <div class="panelLogin w-full max-w-sm bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs {{ $errors->registro->any() ? 'hidden' : '' }}">
        <form action="{{ route('login.submit') }}" method="post" data-submitting-text="Iniciando sesión...">
            @csrf
            <h1 class="text-xl font-semibold text-heading mb-6">Inicia sesión</h1>
            @include('auth.errors')

            <div class="mb-4">
                <label for="nom" class="block mb-2.5 text-sm font-medium text-heading">Nombre</label>
                <input id="nom" type="text" name="nom" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="example@company.com" value="{{ old('nom') }}" required />
            </div>
            <div>
                <label for="contrasenya" class="block mb-2.5 text-sm font-medium text-heading">Contraseña</label>
                <input id="contrasenya" type="password" name="contrasenya" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="•••••••••" required />
            </div>
            <button id="botonLogin" type="submit" class="botonLogin text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3">Iniciar Sesión</button>
            <div class="preguntaLogin text-sm font-medium text-body">No tienes cuenta? <a href="#" class="cambiarPanel text-fg-brand hover:underline">Crear cuenta</a></div>
        </form>
    </div>

    <div class="panelLogin w-full max-w-sm bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs {{ $errors->registro->any() ? '' : 'hidden' }}">
        <form action="{{ route('usuari.store') }}" method="POST" data-submitting-text="Creando cuenta...">
            @csrf

            <h1 class="text-xl font-semibold text-heading mb-6">Crear cuenta</h1>
            @if ($errors->registro->any())
                <div class="error" role="alert">
                    @foreach ($errors->registro->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif
            <div class="mb-4">
                <label for="nom-registre" class="block mb-2.5 text-sm font-medium text-heading">Nombre</label>
                <input id="nom-registre" type="text" name="nom" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" value="{{ old('nom') }}" required>
            </div>
            <div>
                <label for="contrasenya-registre" class="block mb-2.5 text-sm font-medium text-heading">Contraseña</label>
                <input id="contrasenya-registre" type="password" name="contrasenya" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" required />
            </div>
            <div class="mb-4">
                <label for="contrasenya_confirmation" class="block mb-2.5 text-sm font-medium text-heading">Repite la contraseña</label>
                <input id="contrasenya_confirmation" type="password" name="contrasenya_confirmation" class="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" required />
            </div>
            <button type="submit" class="botonLogin text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3">Crear cuenta</button>
            <div class="preguntaLogin text-sm font-medium text-body">Ya tienes cuenta? <a href="#" class="cambiarPanel text-fg-brand hover:underline">Iniciar sesión</a></div>
        </form>
    </div>
</body>
<script src="{{ asset('js/script.js') }}"></script>
</html>
