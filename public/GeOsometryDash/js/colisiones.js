let encimaBloque = false;
let estaBaya = false;
function colision(personaje, elemento) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = elemento.getBoundingClientRect();

    return !(
        el1.right - 16 < el2.left ||
        el1.left + 16 > el2.right ||
        el1.bottom - 16 < el2.top ||
        el1.top + 16 > el2.bottom
    );
}

function colisionZarza(personaje, zarza) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = zarza.getBoundingClientRect();

    return !(
        el1.right - 16 < el2.left + 16||
        el1.left + 16 > el2.right - 16 ||
        el1.bottom - 16 < el2.top + 16 ||
        el1.top + 16 > el2.bottom - 16
    );
}

function colisionBloque(personaje, bloque) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = bloque.getBoundingClientRect();

    return !(
        el1.right - 16 < el2.left + 3.5 ||
        el1.left + 16 > el2.right - 3.5 ||
        el1.bottom - 16 < el2.top + (16 * 2) ||
        el1.top + 16 > el2.bottom - (16 * 2)
    )
}

// REVISAR USO
function colisionTopBloque(personaje, bloqueTop) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = bloqueTop.getBoundingClientRect();

    return !(
        el1.right - 16 > el2.left ||
        el1.left + 16 < el2.right ||
        el1.bottom - 16 >= el2.top ||
        el1.bottom + 16 <= el2.top + 10
    )
}

function colisionBaya(personaje, baya) {
    const el1 = personaje.getBoundingClientRect();
    const el2 = baya.getBoundingClientRect();

    return !(
        el1.right - 16 >= el2.left + (16 * 2) ||
        el1.left + 16 <= el2.right - (16 * 2) ||
        el1.bottom - 16 >= el2.top + (16 * 2) ||
        el1.top + 16 <= el2.bottom - (16 * 2)
    )
}

function comprobarColisiones(personaje) {
    // Zarzas
    const zarzas = document.querySelectorAll('.zarzas');
    const bloques = document.querySelectorAll('.bloque');
    const bloquesTop = document.querySelectorAll('.bloqueTop');
    const bloquesBottom = document.querySelectorAll('.bloqueBottom');
    const letreros = document.querySelectorAll('.letrero');
    const espejos = document.querySelectorAll('.espejo');
    const bayas = document.querySelectorAll('.baya');
    const trampolines = document.querySelectorAll('.trampolin');
    const bandera = document.querySelector('.bandera');
    encimaBloque = false;
    estaBaya = false;
    zarzas.forEach(zarza => {
        if (colisionZarza(personaje, zarza)) {
            personajeCaido();
        }
    });
    bloques.forEach(bloque => {
        if(colisionBloque(personaje, bloque)) {
            personajeCaido();
        }
    })
    bloquesTop.forEach(bloqueTop => {
        if (colision(personaje, bloqueTop) && !cambioGravedad){
            sueloPersonaje = parseFloat(personaje.style.bottom);
            encimaBloque = true;
            prohibidoSaltar = false;
        } else if (colision(personaje, bloqueTop) && cambioGravedad) {
            personajeCaido();
        } else if (!colision(personaje, bloqueTop) && !cambioGravedad &&
        sueloPersonaje != 5 && !encimaBloque) {
            sueloPersonaje = 5;
            limiteCaidaLenta = parseFloat(personaje.style.bottom) - 1;
            limiteCaidaMedia = limiteCaidaLenta - 1;
            prohibidoSaltar = true;
            realizarCaida();
        }
    })
    bloquesBottom.forEach(bloqueBottom => {
        if(colision(personaje, bloqueBottom) && cambioGravedad){
            sueloPersonaje = parseFloat(personaje.style.bottom);
        } else if (colision(personaje, bloqueBottom) && !cambioGravedad) {
            personajeCaido();
        }
    })
    letreros.forEach(letrero => {
        if (colision(personaje, letrero)){
            switch(letrero.dataset.modo) {
                case 'cubo':
                    modoActual = 'Cubo';
                    break;
                case 'surf':
                    modoActual = 'Surf';
                    break;
                case 'bola':
                    modoActual = 'Bola';
                    break;
                case 'ufo':
                    modoActual = 'Ufo';
                    break;
            }
            cambiarImagenPersonaje(personaje);
        }
    })
    espejos.forEach(espejo => {
        if(colision(personaje, espejo) && !espejo.classList.contains('deshabilitar')){
            espejoGravedad(personaje);
            espejo.classList.add('deshabilitar');
            realizarCaida();
        }
    })
    bayas.forEach(baya => {
        if(colision(personaje, baya)){
            dobleSalto = true;
            estaBaya = true;
        } else if (!colision(personaje, baya) && !estaBaya) {
            dobleSalto = false;
        }
    })
    trampolines.forEach(trampolin => {
        if (colision(personaje, trampolin)) {
            realizarSalto();
        }
    })

    if(colision(personaje, bandera)) {
        
    }
}
