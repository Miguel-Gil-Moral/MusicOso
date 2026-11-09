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

function colisionMuerteBloque(personaje, bloque) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = bloque.getBoundingClientRect();

    return !(
        el1.right < el2.left ||
        el1.left > el2.right ||
        el1.bottom < el2.top ||
        el1.top > el2.bottom
    )
}

function colisionBloque(personaje, bloque, posicionPersonaje) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = bloque.getBoundingClientRect();
    let respuesta;

    if (el1.right < el2.left ||
        el1.left > el2.right ||
        el1.top > el2.bottom ||
        el1.bottom < el2.top
    ) {
        respuesta = 'Nada';
    } else {
        respuesta = 'Chocado'
    }

    console.log(respuesta);
}
