const velocidad = 3.5; // Aplicar a los elementos que aparezcan lentos

// TOCAR LOS VALORES Y/O AÑADIR MULTIPLICADOR DE VELOCIDAD PARA AJUSTAR LA CURVA DE SALTO
function actualizarPersonaje(deltaTime) {
    switch (estadoPersonaje) {
        case 'saltando':
            if(!cambioGravedad){
                if (posicionPersonaje >= limiteCaidaLenta &&
                    posicionPersonaje < limiteSalto) {
                    posicionPersonaje += 0.07 * deltaTime * velocidad;
                } else if (posicionPersonaje >= limiteCaidaMedia &&
                    posicionPersonaje < limiteCaidaLenta) {
                    posicionPersonaje += 0.17 * deltaTime * velocidad;
                } else {
                    posicionPersonaje += 0.27 * deltaTime * velocidad;
                }
                if (posicionPersonaje >= limiteSalto) {
                    posicionPersonaje = limiteSalto;
                    realizarCaida();
                }
            } else {
                if (posicionPersonaje <= limiteCaidaLenta &&
                    posicionPersonaje > limiteSalto) {
                    posicionPersonaje -= 0.07 * deltaTime * velocidad;
                } else if (posicionPersonaje <= limiteCaidaMedia &&
                    posicionPersonaje > limiteCaidaLenta) {
                    posicionPersonaje -= 0.17 * deltaTime * velocidad;
                } else {
                    posicionPersonaje -= 0.27 * deltaTime * velocidad;
                }
                if (posicionPersonaje <= limiteSalto) {
                    posicionPersonaje = limiteSalto;
                    realizarCaida();
                }
            }
            break;
        case 'cayendo':
            if (!cambioGravedad) {
                if (posicionPersonaje >= limiteCaidaLenta &&
                    posicionPersonaje < limiteSalto) {
                    posicionPersonaje -= 0.07 * deltaTime * velocidad;
                } else if (posicionPersonaje >= limiteCaidaMedia &&
                    posicionPersonaje < limiteCaidaLenta) {
                    posicionPersonaje -= 0.17 * deltaTime * velocidad;
                } else {
                    posicionPersonaje -= 0.27 * deltaTime * velocidad;
                }
            } else {
                limiteCaidaLenta = posicionPersonaje + 1;
                limiteCaidaMedia = posicionPersonaje + 2;
                if (posicionPersonaje >= limiteCaidaLenta) {
                    posicionPersonaje += 0.07 * deltaTime * velocidad;

                } else if (posicionPersonaje >= limiteCaidaMedia) {
                    posicionPersonaje += 0.17 * deltaTime * velocidad;

                } else {
                    posicionPersonaje += 0.27 * deltaTime * velocidad;
                }
            }
            if (posicionPersonaje <= sueloPersonaje && !cambioGravedad) {
                posicionPersonaje = sueloPersonaje;
                estadoPersonaje = 'quieto';
                enAire = false;
                prohibidoSaltar = false;
            }
            break;
        case 'surf_subida':
            if (!cambioGravedad) {
                posicionPersonaje += sumaSurf * deltaTime * velocidad;
            } else {
                posicionPersonaje -= sumaSurf * deltaTime * velocidad;
            }
            sumaSurf += 0.01;
            break;
        case 'surf_bajada':
            if (!cambioGravedad) {
                posicionPersonaje -= sumaSurf * deltaTime * velocidad;
            } else {
                posicionPersonaje += sumaSurf * deltaTime * velocidad;
            }
            sumaSurf += 0.01;
            if (posicionPersonaje <= sueloPersonaje && !cambioGravedad) {
                posicionPersonaje = sueloPersonaje;
                estadoPersonaje = 'quieto';
                enAire = false;
                prohibidoSaltar = false;
            }
            break;
    }
    personaje.style.bottom = posicionPersonaje + 'rem';
}

function realizarSalto() {
    enAire = true;
    sueloPersonaje = 5;

    if(!prohibidoSaltar || dobleSalto) {
        if (!cambioGravedad) {
            limiteSalto = posicionPersonaje + 10;
            limiteCaidaLenta = limiteSalto - 1;
            limiteCaidaMedia = limiteSalto - 2;
            sueloPersonaje = 5;
        } else {
            limiteSalto = posicionPersonaje - 10;
            limiteCaidaLenta = limiteSalto + 1;
            limiteCaidaMedia = limiteSalto + 2;
            sueloPersonaje = 100;
        }
        
        prohibidoSaltar = true;
        
        // NUEVO --> cambiar estado del personaje
        // Ahora la función "Actualizar personaje" es la que mueve arriba y abajo el pj
        estadoPersonaje = "saltando";
    }

}

// NUEVO --> cambiar estado del personaje
// Ahora la función "Actualizar personaje" es la que mueve arriba y abajo el pj
function realizarCaida() {
    estadoPersonaje = 'cayendo';
}

function personajeCaido() {
    if (muriendo) return;
    clearInterval(tiempoSuma);
    audio.pause();

    muriendo = true;
    tiempoMuerte = performance.now();

    estadoPersonaje = 'quieto';
    enAire = false;
}

function espejoGravedad(personaje) {
    if(cambioGravedad) {
        cambioGravedad = false;
        // personaje.style.transform = 'scaleY(1)';
    } else {
        cambioGravedad = true;
        // personaje.style.transform = 'scaleY(-1)';
    }
}

function cambiarImagenPersonaje(personaje) {
    switch(modoActual) {
        case 'Cubo':
            personaje.src = '../GeOsometryDash/imagenes/Oso.png';
            break;
        case 'Surf':
            personaje.src = '../GeOsometryDash/imagenes/Oso_surf.png';
            break;
        case 'Bola':
            personaje.src = '../GeOsometryDash/imagenes/Oso_bola.png';
            break;
        case 'Ufo':
            personaje.src = '../GeOsometryDash/imagenes/Oso_ufo.png';
            break;
    }
    if (modoActual == 'Cubo') {
        personaje.style.transform = 'scaleX(1)';
    } else {
        personaje.style.transform = 'scaleX(-1)';
    }
}