function colision(personaje, elemento) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = elemento.getBoundingClientRect();

    return !(
        el1.right < el2.left ||
        el1.left > el2.right ||
        el1.bottom < el2.top ||
        el1.top > el2.bottom
    );
}

function colisionZarza(personaje, zarza) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = zarza.getBoundingClientRect();

    return !(
        el1.right < el2.left + 16||
        el1.left > el2.right - 16 ||
        el1.bottom < el2.top + 16 ||
        el1.top > el2.bottom - 16
    );
}

// REVISAR USO
function colisionTopBloque(personaje, bloque) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = bloque.getBoundingClientRect();

    return !(
        el1.right > el2.left ||
        el1.left < el2.right ||
        el1.bottom >= el2.top - (16 * 2) ||
        el1.top <= el2.bottom + (16 * 2)
    )
}

function colisionBaya(personaje, baya) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = baya.getBoundingClientRect();

    return !(
        el1.right >= el2.left + (16 * 2) ||
        el1.left <= el2.right - (16 * 2) ||
        el1.bottom >= el2.top + (16 * 2) ||
        el1.top <= el2.bottom - (16 * 2)
    )
}

function comprobarColisiones() {
    // Zarzas
    const zarzas = document.querySelectorAll('.zarzas');
    zarzas.forEach(zarza => {
        if (colisionZarza(personaje, zarza)) {
            personajeCaido();
        }
    });
    // // Baya
    // if (colision(personaje, baya)) {
    //     prohibidoSaltar = false;
    // }

    // // Trampolín
    // if (colision(personaje, trampolin)) {
    //     realizarSalto();
    // }
}
