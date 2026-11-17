    let estructuraNivel = [], audio;

    /** NUEVO **/

    let enAire = false;
    let pause = false;
    let cambioGravedad = false;
    let prohibidoSaltar = false;

    let pantallaActual = 'Menu';
    let modoActual = 'Cubo';

    // Main animation loop
    let animationFrameId = null;
    let ultimoFrame = 0;

    // Character movement
    let estadoPersonaje = 'quieto';

    // Death timer
    let tiempoMuerte = null;
    let muriendo = false;


    /** FIN NUEVO */

    let posicionFondo = 0, posicionSuelo = 0, sueloPersonaje = 5,
    posicionPersonaje = 5, posicionEspejo = 450, posicionCaja = 250, posicionBaya = 200, posicionTrampolin = 225;
    limiteSalto = posicionPersonaje + 10, limiteCaidaLenta = limiteSalto - 1, limiteCaidaMedia = limiteSalto - 2;

document.addEventListener('DOMContentLoaded', function() {
   
    const velocidad = 3.5; // Aplicar a los elementos que aparezcan lentos
    const contenedorJuego = document.getElementById('contenedorJuego');
    const boton = document.getElementById('botonJuego');
    const pantallaPausa = document.getElementById('pantallaPausa');
    const botonMenu = document.getElementById('botonMenu');
    const botonReanudar = document.getElementById('botonReanudar');
    const botonReiniciar = document.getElementById('botonReiniciar');
    const divNiveles = document.getElementById('niveles');
    const niveles = document.querySelectorAll('a');
    
    const suelo = document.createElement('div');
    const personaje = document.createElement('img');
    const caja = document.createElement('img');
    const espejo = document.createElement('img');
    const baya = document.createElement('img');
    const trampolin = document.createElement('img');

    espejo.className = 'espejo';
    espejo.src = '../GeOsometryDash/imagenes/Espejo.png';
    caja.className = 'caja';
    caja.src = '../GeOsometryDash/imagenes/Caja.png';
    baya.className = 'baya';
    baya.src = '../GeOsometryDash/imagenes/Baya.png';
    trampolin.className = 'trampolin';
    trampolin.src = '../GeOsometryDash/imagenes/Trampolin.png';

    suelo.id = 'sueloJuego';
    personaje.src = '../GeOsometryDash/imagenes/Oso.jpg';
    personaje.id = 'personaje';

    establecerMenu();    
    
    function establecerMenu() {
        divNiveles.style.display = 'none';
        pantallaActual = 'Menu';
        pararIntervalos();
        contenedorJuego.style.backgroundImage = 'url(../GeOsometryDash/imagenes/Fondo_menu.jpg)';
        pantallaPausa.style.display = 'none';
        contenedorJuego.style.backgroundSize = 'cover';
        boton.removeAttribute('hidden');
    }

    function establecerNiveles() {
        contenedorJuego.style.backgroundImage = 'url(../GeOsometryDash/imagenes/Fondo_menu.jpg)';
        contenedorJuego.style.backgroundSize = 'cover';
        divNiveles.style.display = 'flex';
        divNiveles.style.justifyContent = 'space-around';
        pantallaActual = 'Niveles';
        boton.setAttribute('hidden', '')
    }

    boton.addEventListener('click', function() {
        establecerNiveles();
        const encabezadoPausa = pantallaPausa.querySelector('h1');
        niveles.forEach(nivel => {
            nivel.addEventListener('click', function() {
                pantallaActual = 'Juego';
                encabezadoPausa.textContent = nivel.dataset.nombre;
                divNiveles.style.display = 'none';
                switch(nivel.dataset.nombre){
                    case 'StereOso Madness':
                        audio = new Audio('../GeOsometryDash/audio/stereo_madness.mp3');
                        estructuraNivel = getEstructuraStereoso();
                        break;
                    case 'Oso Can\'t Let Go':
                        audio = new Audio('../GeOsometryDash/audio/cant_let_go.mp3');
                        break;
                    case 'UltraOso':
                        audio = new Audio('../GeOsometryDash/audio/sonic_blaster.mp3');
                        estructuraNivel = getEstructuraUltraOso();
                        break;
                }
                if (nivel.dataset.nombre === 'StereOso Madness') {
                    audio.volume = 0.05;
                    audio.play();
                    crearEstructura();
                    comenzarJuego();
                } else {
                    comenzarJuego();
                }
            })
        })
    })

    function crearEstructura() {
        let posicionBottom = 5;
        let divTopBloque;
        let temp = [];
        contenedorJuego.appendChild(suelo);
        estructuraNivel.forEach(elemento => {
            posicionBottom = 5;
            const imagen = document.createElement('img');
            imagen.classList.add(elemento.nombre);
            switch (elemento.nombre) {
                case 'zarzas':
                    imagen.src = '../GeOsometryDash/imagenes/Zarzas.png';
                    break;
                case 'bloque':
                    imagen.src = '../GeOsometryDash/imagenes/Bloque.png';
                    divTopBloque = document.createElement('div');
                    divTopBloque.classList.add('bloqueTop');
                    break;
                case 'bandera':
                    imagen.src = '../GeOsometryDash/imagenes/Bandera.png';
                    break;
            }
            imagen.style.left = elemento.posicion + 'rem';
            contenedorJuego.appendChild(imagen);
            temp.push(elemento);
            if(elemento?.bloquesEncima) {
                for (let i = 0; i < elemento.bloquesEncima; i++) {
                    posicionBottom += 3.6;
                    const bloqueEncima = document.createElement('img');
                    bloqueEncima.classList.add('bloque');
                    bloqueEncima.src = '../GeOsometryDash/imagenes/Bloque.png';
                    bloqueEncima.style.left = elemento.posicion + 'rem';
                    bloqueEncima.style.bottom = posicionBottom + 'rem';
                    contenedorJuego.appendChild(bloqueEncima);
                    temp.push({
                        nombre: bloqueEncima.classList[0],
                        posicion: elemento.posicion
                    });
                }
            }
            if(elemento?.zarzasEncima){
                const zarzaEncima = document.createElement('img');
                zarzaEncima.classList.add('zarzas');
                zarzaEncima.src = '../GeOsometryDash/imagenes/Zarzas.png';
                zarzaEncima.style.left = elemento.zarzasEncima + 'rem';
                zarzaEncima.style.bottom = (posicionBottom + 3.6) + 'rem';
                contenedorJuego.appendChild(zarzaEncima);
                temp.push({
                    nombre: zarzaEncima.classList[0],
                    posicion: elemento.zarzasEncima
                });
            }
            if (elemento.nombre === 'bloque') {
                // if (elemento.visible) {
                    divTopBloque.style.left = elemento.posicion + 'rem';
                    divTopBloque.style.bottom = posicionBottom + 3.5 + 'rem';
                    contenedorJuego.appendChild(divTopBloque);
                // }
                temp.push({ 
                    nombre: divTopBloque.classList[0],
                    posicion: elemento.posicion
                });
            }
        })
        estructuraNivel = temp;
    }

    function quitarElementos() {
        const bloques = document.querySelectorAll('.bloque');
        const topBloques = document.querySelectorAll('.bloqueTop');
        const zarzas = document.querySelectorAll('.zarzas');
        const bandera = document.querySelector('.bandera');
        contenedorJuego.removeChild(suelo);
        contenedorJuego.removeChild(personaje);
        zarzas.forEach(zarza => {
            contenedorJuego.removeChild(zarza);
        });
        bloques.forEach(bloque => {
            contenedorJuego.removeChild(bloque);
        });
        topBloques.forEach(topBloque => {
            contenedorJuego.removeChild(topBloque);
        });
        contenedorJuego.removeChild(espejo);
        contenedorJuego.removeChild(caja);
        contenedorJuego.removeChild(baya);
        contenedorJuego.removeChild(trampolin);
        contenedorJuego.removeChild(bandera);
    }

    botonMenu.addEventListener('click', function() {
        pantallaPausa.style.display = 'none';
        pause = false;
        quitarElementos();
        pararIntervalos();
        establecerNiveles();
    })

    botonReanudar.addEventListener('click', function(){
        pause = false;
        audio.play();
        pantallaPausa.style.display = 'none';
        arrancarJuego();
        if (enAire) {
            realizarCaida();
        }
    })

    botonReiniciar.addEventListener('click', function() {
        pantallaPausa.style.display = 'none';
        pause = false;
        reiniciarJuego();
    })

    function comenzarJuego() {
        audio.currentTime = 0;
        audio.play();
        modoActual = 'Cubo';
        posicionFondo = 0.00, posicionSuelo = 0.00;
        posicionPersonaje = 5, posicionEspejo = 450, posicionCaja = 250, posicionBaya = 200, posicionTrampolin = 225;
        limiteSalto = posicionPersonaje + 10, limiteCaidaLenta = limiteSalto - 1, limiteCaidaMedia = limiteSalto - 2;
        cambioGravedad = false;
        enAire = false;
        prohibidoSaltar = false;

        pararIntervalos();
        contenedorJuego.appendChild(personaje);
        contenedorJuego.appendChild(baya);
        contenedorJuego.appendChild(espejo);
        contenedorJuego.appendChild(caja);
        contenedorJuego.appendChild(trampolin);
        contenedorJuego.appendChild(pantallaPausa);

        contenedorJuego.style.backgroundImage = 'url(../GeOsometryDash/imagenes/Fondo_juego.png)';
        contenedorJuego.style.backgroundSize = "";
        contenedorJuego.style.backgroundPosition = '0% center';

        personaje.style.bottom = posicionPersonaje + 'rem';

        boton.setAttribute('hidden', '');

        arrancarJuego();
    }

    function pararIntervalos() {
        if (animationFrameId !== null) {
                cancelAnimationFrame(animationFrameId);
             animationFrameId = null;
         }

        ultimoFrame = 0;
    }

    //Funcionamiento juego
    function arrancarJuego() {
        pantallaActual = 'Juego';
        
       
        /** VARIABLES NUEVAS */

        muriendo = false;
        tiempoMuerte = null;
        ultimoFrame = 0;

        animationFrameId = requestAnimationFrame(bucleJuego);

        function bucleJuego(tiempoActual) {

            if (ultimoFrame === 0) {
                ultimoFrame = tiempoActual;
            }

            // Tiempo que ha pasado desde el último frame
            // 16.67 ms represents approximately 60 FPS.
            let deltaTime = (tiempoActual - ultimoFrame) /  16.67;
       
            // Avoid enormous movements after a tab is inactive.
            deltaTime = Math.min(deltaTime, 2);

            ultimoFrame = tiempoActual;

             // Comprobamos si el personaje ha muerto
            if (muriendo) {
                if (tiempoActual - tiempoMuerte >= 2000) {
                    reiniciarJuego();
                    return; 
                } 
            } else {
                actualizarFondo(deltaTime);
                actualizarObstaculos(deltaTime);
                actualizarObjetosEspeciales(deltaTime);
                actualizarPersonaje(deltaTime);
                comprobarColisiones();
            }

            // Solicitamos el siguiente fotograma
            animationFrameId = requestAnimationFrame(bucleJuego);
         }

    }

    function actualizarFondo(deltaTime) {

        // Antes movías +0,01 por cada milisegundo. Ahora es lo mismo * 16 (cada FPS)
        posicionFondo += 0.01 * deltaTime * 16;
        posicionSuelo -= 0.5 * deltaTime * 5;

        contenedorJuego.style.backgroundPositionX =
            posicionFondo + '%';

        suelo.style.backgroundPositionX =
            posicionSuelo + '%';
    }

    function actualizarObstaculos(deltaTime) {

        let iteraciones = [0, 0, 0];

        const bloques = document.querySelectorAll('.bloque');
        const topBloques = document.querySelectorAll('.bloqueTop');
        const zarzas = document.querySelectorAll('.zarzas');
        const bandera = document.querySelector('.bandera');

        for (let i = 0; i < estructuraNivel.length; i++) {

            estructuraNivel[i].posicion -= 0.2 * deltaTime * velocidad;

            // if (estructuraNivel[i].visible){
                switch (estructuraNivel[i].nombre) {
                    case 'zarzas':
                        zarzas[iteraciones[0]].style.left = estructuraNivel[i].posicion + 'rem';
                        // eliminarElemento(i, zarzas[iteraciones[0]]);
                        iteraciones[0]++;
                        break;
                    case 'bloque':
                        bloques[iteraciones[1]].style.left = estructuraNivel[i].posicion + 'rem';
                        // eliminarElemento(i, bloques[iteraciones[1]]);
                        iteraciones[1]++;
                        break;
                    case 'bloqueTop':
                        topBloques[iteraciones[2]].style.left = estructuraNivel[i].posicion + 'rem';
                        // eliminarElemento(i, topBloques[iteraciones[2]]);
                        iteraciones[2]++;
                        break;
                    case 'bandera':
                        bandera.style.left = estructuraNivel[i].posicion + 'rem';
                        break;
                }

            // }

        }
    }

    function actualizarObjetosEspeciales(deltaTime) {

        // Caja
        posicionCaja -= 0.2 * deltaTime * velocidad;
        caja.style.left = posicionCaja + 'rem';

        // Espejo
        posicionEspejo -= 0.2 * deltaTime * velocidad;
        espejo.style.left = posicionEspejo + 'rem';

        // Baya
        posicionBaya -= 0.2 * deltaTime * velocidad;
        baya.style.left = posicionBaya + 'rem';

        // Trampolín
        posicionTrampolin -= 0.2 * deltaTime * velocidad;
        trampolin.style.left = posicionTrampolin + 'rem';
}

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
            case 'volando':
                if (!cambioGravedad) {
                    posicionPersonaje += 0.02 * deltaTime * velocidad;
                }
                break;
        }
        personaje.style.bottom = posicionPersonaje + 'rem';
    }


    function eliminarElemento(iteracionEstructura, elemento) {
        if (estructuraNivel[iteracionEstructura].posicion <= -10 && estructuraNivel[iteracionEstructura].visible) {
            estructuraNivel[iteracionEstructura].visible = false;
            contenedorJuego.removeChild(elemento);
        }
    }

    /// REVISAR: NO SE USA (tampoco en el original)
    function agregarElemento(iteracionEstructura) {
        if (estructuraNivel[iteracionEstructura].posicion > -10 && 
            estructuraNivel[iteracionEstructura].posicion <= 300 &&
            !estructuraNivel[iteracionEstructura].visible
        ) {
            estructuraNivel[iteracionEstructura].visible = true;
            let elemento;
            if (estructuraNivel[iteracionEstructura].nombre != 'bloqueTop') {
                elemento = document.createElement('img');
                elemento.classList.add(estructuraNivel[iteracionEstructura].nombre);
                switch(estructuraNivel[iteracionEstructura].nombre) {
                    case 'zarzas':
                        elemento.src = '../GeOsometryDash/imagenes/Zarzas.png';
                        break;
                    case 'bloque':
                        elemento.src = '../GeOsometryDash/imagenes/Bloque.png';
                        break;
                    case 'bandera':
                        elemento.src = '../GeOsometryDash/imagenes/Bandera.png';
                        break;
                }
            } else {
                elemento = document.createElement('div');
            }
            elemento.style.left = estructuraNivel[iteracionEstructura].posicion + 'rem';
            contenedorJuego.appendChild(elemento);
            if (estructuraNivel[iteracionEstructura]?.bloquesEncima) {
                let posicionBottom = 5;
                for (let i = 0; i < estructuraNivel[iteracionEstructura].bloquesEncima; i++) {
                    posicionBottom += 3.5;
                    const bloqueEncima = document.createElement('img');
                    bloqueEncima.classList.add('bloque');
                    bloqueEncima.src = '../GeOsometryDash/imagenes/Bloque.png';
                    bloqueEncima.style.left = estructuraNivel[iteracionEstructura].posicion + 'rem';
                    bloqueEncima.style.bottom = posicionBottom + 'rem';
                    contenedorJuego.appendChild(bloqueEncima);
                }
            }
        }
    }

    function personajeCaido() {
        if (muriendo) return;

        audio.pause();

        muriendo = true;
        tiempoMuerte = performance.now();

        estadoPersonaje = 'quieto';
        enAire = false;
    }

    function reiniciarJuego() {
        quitarElementos();
        estructuraNivel = getEstructuraStereoso();
        crearEstructura();
        comenzarJuego();
    }

  

    function realizarSalto() {
        enAire = true;
        sueloPersonaje = 5;
        
        if(!prohibidoSaltar) {
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

     // NUEVO --> cambiar estado del personaje
    // Ahora la función "Actualizar personaje" es la que mueve arriba y abajo el pj
    function nave() {
         estadoPersonaje = 'volando';
    }

    window.addEventListener('keydown', function(event) {
        switch(event.key){
            case 'Escape':
                if (!pause && pantallaActual === 'Juego') {
                    audio.pause();
                    pararIntervalos();
                    pantallaPausa.style.display = 'flex';
                    pause = true;
                } else if (pause && pantallaActual === 'Juego'){
                    pantallaPausa.style.display = 'none';
                    pause = false;
                    pararIntervalos();
                    establecerNiveles();
                    quitarElementos();
                } else {
                    establecerMenu();
                }
                break;
            case ' ':
                if (pantallaActual === 'Menu') {
                    establecerNiveles();
                } else if(pause) {
                    pause = false;
                    pantallaPausa.style.display = 'none';
                    audio.play();
                    arrancarJuego();
                    if (enAire) {
                        realizarCaida();
                    }
                } else {
                    if (modoActual === 'Cubo') {
                        realizarSalto();
                    } else if (modoActual == 'Nave') {
                        nave();
                    }
                }
                break;
            case 'r':
                if (!pause) {
                    reiniciarJuego();
                }
                break;
        }
    })

    function comprobarColisiones() {
        // Zarzas
        const zarzas = document.querySelectorAll('.zarzas');
        const bloques = document.querySelectorAll('.bloque');
        const bloquesTop = document.querySelectorAll('.bloqueTop');
        const trampolines = document.querySelectorAll('.trampolin');
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
            if (colision(personaje, bloqueTop)){
                sueloPersonaje = parseFloat(personaje.style.bottom);
            }
        })

        if (colisionBaya(personaje, baya)) {
            prohibidoSaltar = false;
        }

        trampolines.forEach(trampolin => {
            if (colision(personaje, trampolin)) {
                realizarSalto();
            }
        })
    }

})


/**  ARREGLAR POSTERIORMENTE
 * 
 * Dos detalles que quiero que tengas en cuenta antes de probarlo
En comprobarColisiones() debes evitar que los elementos ya eliminados se sigan comprobando. Además, sería conveniente comprobar que bandera y los demás elementos existen antes de acceder a ellos en actualizarObstaculos(). La implementación actual conserva algunas limitaciones de tu sistema de eliminación original.

Tu getEstructuraStereoso() debería devolver una copia de los datos originales mediante .map(elemento => ({...elemento})), para que reiniciar el nivel no conserve las posiciones modificadas.
 * 
 * 
 * 
 * (??) Hay que tener especial cuidado con las colisiones del trampolín, que ahora pueden llamar a realizarSalto() en varios fotogramas consecutivos.
 * 
 */