@if ($errors->any())
    <div class="error text-xs font-medium me-2 py-0.5">
        @foreach ($errors->all() as $error)
            <p>{{ $error }}</p>
        @endforeach
    </div>
@endif
