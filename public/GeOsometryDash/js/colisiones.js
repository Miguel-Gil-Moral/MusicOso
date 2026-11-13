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
