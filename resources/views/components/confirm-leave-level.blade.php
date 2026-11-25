@props([
    'dialogId' => 'confirmar-salida-nivel',
    'href' => route('welcome'),
    'message' => 'Perderás el progreso de este nivel.',
])

<dialog id="{{ $dialogId }}" class="leave-level-dialog" aria-labelledby="{{ $dialogId }}-title">
    <div class="leave-level-dialog__content">
        <h2 id="{{ $dialogId }}-title">¿Quieres salir del nivel?</h2>
        <p>{{ $message }}</p>
        <div class="leave-level-dialog__actions">
            <form method="dialog">
                <button type="submit" class="leave-level-dialog__cancel">No</button>
            </form>
            <a href="{{ $href }}" class="leave-level-dialog__confirm">Sí, salir</a>
        </div>
    </div>
</dialog>
