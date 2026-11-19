@if (session('error'))
    <span
        class=" error text-xs font-medium me-2 py-0.5">
        {{ session('error') }}
    </span>
@endif