let encimaBloque = false;
let estaBaya = false;
let hayColisionTop = false;
let hayColisionBottom = false;
let hayColisionBaya = false;
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
    encimaBloque = false;
    estaBaya = false;

    elementosPillados.zarzas.forEach(zarza => {
        if (colisionZarza(personaje, zarza)) {
            personajeCaido();
        }
    });
    elementosPillados.bloques.forEach(bloque => {
        if(colisionBloque(personaje, bloque)) {
            personajeCaido();
        }
    });
    elementosPillados.topBloques.forEach(topBloque => {
        hayColisionTop = colision(personaje, topBloque);
        if (hayColisionTop && !cambioGravedad && estadoPersonaje != 'saltando'){
            sueloPersonaje = parseFloat(topBloque.style.bottom);
            estadoPersonaje = 'quieto';
            encimaBloque = true;
            prohibidoSaltar = false;
        } else if (hayColisionTop && cambioGravedad) {
            personajeCaido();
        } else if (!hayColisionTop && !cambioGravedad &&
        sueloPersonaje != 5 && !encimaBloque) {
            sueloPersonaje = 5;
            limiteCaidaLenta = parseFloat(personaje.style.bottom) - 1;
            limiteCaidaMedia = limiteCaidaLenta - 1;
            prohibidoSaltar = true;
            realizarCaida();
        }
    });
    elementosPillados.bottomBloques.forEach(bottomBloque => {
        hayColisionTop = colision(personaje, bottomBloque);
        if (hayColisionTop && !cambioGravedad && estadoPersonaje != 'saltando'){
            sueloPersonaje = parseFloat(bottomBloque.style.bottom);
            estadoPersonaje = 'quieto';
            encimaBloque = true;
            prohibidoSaltar = false;
        } else if (hayColisionTop && cambioGravedad) {
            personajeCaido();
        } else if (!hayColisionTop && !cambioGravedad &&
        sueloPersonaje != 5 && !encimaBloque) {
            sueloPersonaje = 5;
            limiteCaidaLenta = parseFloat(personaje.style.bottom) - 1;
            limiteCaidaMedia = limiteCaidaLenta - 1;
            prohibidoSaltar = true;
            realizarCaida();
        }
    });
    elementosPillados.letreros.forEach(letrero => {
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
    });
    elementosPillados.espejos.forEach(espejo => {
        if(colision(personaje, espejo) && !espejo.classList.contains('deshabilitar')){
            espejoGravedad(personaje);
            espejo.classList.add('deshabilitar');
            realizarCaida();
        }
    });
    elementosPillados.bayas.forEach(baya => {
        hayColisionBaya = colision(personaje, baya);
        if(hayColisionBaya){
            dobleSalto = true;
            estaBaya = true;
        } else if (!hayColisionBaya && !estaBaya) {
            dobleSalto = false;
        }
    });
    elementosPillados.trampolines.forEach(trampolin => {
        if (colision(personaje, trampolin)) {
            realizarSalto();
        }
    });

    if(colision(personaje, elementosPillados.bandera)) {
        
    }
}
