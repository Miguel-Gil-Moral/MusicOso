const velocidad = 3.5; // Aplicar a los elementos que aparezcan lentos

// TOCAR LOS VALORES Y/O AÑADIR MULTIPLICADOR DE VELOCIDAD PARA AJUSTAR LA CURVA DE SALTO
function actualizarPersonaje(deltaTime) {
    switch (estadoPersonaje) {
        case 'saltando':
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
            if (posicionPersonaje <= sueloPersonaje) {
                posicionPersonaje = sueloPersonaje;
                estadoPersonaje = 'quieto';
                enAire = false;
                prohibidoSaltar = false;
            }
            break;
        case 'surf_subida':
            if (!cambioGravedad) {
                posicionPersonaje += sumaSurf * deltaTime * velocidad;
                
                sumaSurf += sumaSurf;
            } else {
                posicionPersonaje -= sumaSurf * deltaTime * velocidad;
                
                sumaSurf += sumaSurf;
            }
            break;
        case 'surf_bajada':
            if (!cambioGravedad) {
                // if (sumaSurf < 1) {
                //     sumaSurf = 1;
                // }
                posicionPersonaje -= sumaSurf * deltaTime * velocidad;
                
                sumaSurf += sumaSurf;
            } else {
                // if (sumaSurf < 1) {
                //     sumaSurf = 1;
                // }

                posicionPersonaje += sumaSurf * deltaTime * velocidad;
                
                sumaSurf += sumaSurf;
            }
            break;
    }
    personaje.style.bottom = posicionPersonaje + 'rem';
}

function realizarSalto() {
    enAire = true;
    sueloPersonaje = 5;
    
    if(!prohibidoSaltar || dobleSalto) {
        limiteSalto = posicionPersonaje + 10;
        limiteCaidaLenta = limiteSalto - 1;
        limiteCaidaMedia = limiteSalto - 2;
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

function espejoGravedad() {
    if(cambioGravedad) {
        cambioGravedad = false;
    } else {
        cambioGravedad = true;
    }
}