    let estructuraNivel = [], audio;

    /** NUEVO **/

    let enAire = false;
    let pause = false;
    let cambioGravedad = false;
    let prohibidoSaltar = false;
    let dobleSalto = false;

    let pantallaActual = 'Menu';
    let modoActual = 'Cubo';
    let segundosActual = 0;
    let minutosActual = 0;

    // Main animation loop
    let animationFrameId = null;
    let ultimoFrame = 0;
    let tiempoSuma;

    // Character movement
    let estadoPersonaje = 'quieto';

    // Death timer
    let tiempoMuerte = null;
    let muriendo = false;

    const teclas = {};

    /** FIN NUEVO */

    let posicionFondo = 0, posicionSuelo = 0, sueloPersonaje = 5, posicionPersonaje = 5, sumaSurf;
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
    
    const tiempo = document.createElement('p');
    const intentos = document.createElement('h2');
    const suelo = document.createElement('div');
    const personaje = document.createElement('img');

    suelo.id = 'sueloJuego';
    // personaje.src = '../GeOsometryDash/imagenes/Oso.jpg';
    personaje.src = '../GeOsometryDash/imagenes/Oso.png';
    personaje.id = 'personaje';
    tiempo.id = 'tiempoJuego';
    intentos.id = 'intentos';

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
                const niveles = new Niveles();
                pantallaActual = 'Juego';
                encabezadoPausa.textContent = nivel.dataset.nombre;
                divNiveles.style.display = 'none';
                switch(nivel.dataset.nombre){
                    case "StereOso Madness":
                        establecerAudio('../GeOsometryDash/audio/stereo_madness.mp3');
                        break;
                    case "Oso Can't Let Go":
                        establecerAudio('../GeOsometryDash/audio/cant_let_go.mp3');
                        break;
                    case "UltraOso":
                        establecerAudio('../GeOsometryDash/audio/sonic_blaster.mp3');
                        break;
                }
                estructuraNivel = niveles.getEstructura(nivel.dataset.nombre);
                crearEstructura();
                comenzarJuego();
            })
        })
    })

    function establecerAudio(ruta) {
        audio = new Audio(ruta);
        audio.volume = 0.1;
    }

    function crearEstructura() {
        let posicionBottom = 5, posicionBottom2;
        let divTopBloque, divBottomBloque;
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
                case 'letrero':
                    switch (elemento.modoOso){
                        case 'cubo':
                            imagen.src = '../GeOsometryDash/imagenes/Letrero\ Cubo.png';
                            break;
                        case 'surf':
                            imagen.src = '../GeOsometryDash/imagenes/Letrero\ Surf.png';
                            break;
                        case 'bola':
                            imagen.src = '../GeOsometryDash/imagenes/Letrero\ Bola.png';
                            break;
                        case 'ufo':
                            imagen.src = '../GeOsometryDash/imagenes/Letrero\ Ufo.png';
                            break;
                    }
                    imagen.dataset.modo = elemento.modoOso;
                    break;
                case 'espejo':
                    imagen.src = '../GeOsometryDash/imagenes/Espejo.png';
                    break;
                case 'baya':
                    imagen.src = '../GeOsometryDash/imagenes/Baya.png';
                    break;
                case 'trampolin':
                    imagen.src = '../GeOsometryDash/imagenes/Trampolin.png';
                    posicionBottom = 3.5;
                    break;
                case 'bandera':
                    imagen.src = '../GeOsometryDash/imagenes/Bandera.png';
                    break;
            }
            imagen.style.left = elemento.posicion + 'rem';
            imagen.style.bottom = elemento?.posicionBottom ? elemento.posicionBottom + 'rem': posicionBottom + 'rem';
            contenedorJuego.appendChild(imagen);
            temp.push(elemento);
            if(elemento?.bloquesEncima) {
                posicionBottom2 = (elemento?.posicionBottom) ? elemento.posicionBottom : null;
                for (let i = 0; i < elemento.bloquesEncima; i++) {
                    posicionBottom += 3.6;
                    posicionBottom2 += 3.6;
                    const bloqueEncima = document.createElement('img');
                    bloqueEncima.classList.add('bloque');
                    bloqueEncima.src = '../GeOsometryDash/imagenes/Bloque.png';
                    bloqueEncima.style.left = elemento.posicion + 'rem';
                    bloqueEncima.style.bottom = (elemento?.posicionBottom) ? posicionBottom2 + 'rem' : posicionBottom + 'rem';
                    contenedorJuego.appendChild(bloqueEncima);
                    temp.push({
                        nombre: bloqueEncima.classList[0],
                        posicion: elemento.posicion
                    });
                }
            }
            if (elemento.nombre === 'bloque') {
                divTopBloque.style.left = elemento.posicion + 'rem';
                divTopBloque.style.bottom = elemento?.posicionBottom ? elemento.posicionBottom + 3.6 + 'rem' : posicionBottom + 3.6 + 'rem';
                contenedorJuego.appendChild(divTopBloque);
                temp.push({ 
                    nombre: divTopBloque.classList[0],
                    posicion: elemento.posicion
                });
                if (elemento?.posicionBottom) {
                    divBottomBloque = document.createElement('div');
                    divBottomBloque.classList.add('bloqueBottom');
                    divBottomBloque.style.left = elemento.posicion + 'rem';
                    divBottomBloque.style.bottom = elemento.posicionBottom + 'rem';
                    contenedorJuego.appendChild(divBottomBloque);
                    temp.push({
                        nombre: divBottomBloque.classList[0],
                        posicion: elemento.posicion
                    })
                }
            }
            if(elemento?.elementoEncima){
                const elementoNuevo = document.createElement('img');
                elementoNuevo.classList.add(elemento.elementoEncima.nombre);
                switch(elemento.elementoEncima.nombre){
                    case 'zarzas':
                        elementoNuevo.src = '../GeOsometryDash/imagenes/Zarzas.png';
                        break;
                    case 'letrero':
                        switch(elemento.elementoEncima.modoOso){
                            case 'cubo':
                                imagen.src = '../GeOsometryDash/imagenes/Letrero\ Cubo.png';
                                break;
                            case 'surf':
                                elementoNuevo.src = '../GeOsometryDash/imagenes/Letrero\ Surf.png';
                                break;
                            case 'bola':
                                elementoNuevo.src = '../GeOsometryDash/imagenes/Letrero\ Bola.png';
                                break;
                            case 'ufo':
                                elementoNuevo.src = '../GeOsometryDash/imagenes/Letrero\ Ufo.png';
                                break;
                        }
                        elementoNuevo.dataset.modo = elemento.elementoEncima.modoOso;
                        break;
                    case 'espejo':
                        elementoNuevo.src = '../GeOsometryDash/imagenes/Espejo.png';
                        break;
                }
                elementoNuevo.style.left = elemento.elementoEncima.posicion + 'rem';
                elementoNuevo.style.bottom = (elemento?.posicionBottom) ? (elemento.posicionBottom + 3.6) + 'rem': (posicionBottom + 3.6) + 'rem';
                contenedorJuego.appendChild(elementoNuevo);
                temp.push({
                    nombre: elementoNuevo.classList[0],
                    posicion: elemento.elementoEncima.posicion
                });
            } else if (elemento?.elementoDebajo) {
                const elementoNuevo = document.createElement('img');
                elementoNuevo.classList.add(elemento.elementoDebajo.nombre);
                switch(elemento.elementoDebajo.nombre){
                    case 'zarzas':
                        elementoNuevo.src = '../GeOsometryDash/imagenes/Zarzas.png';
                        break;
                    case 'espejo':
                        elementoNuevo.src = '../GeOsometryDash/imagenes/Espejo.png';
                        break;
                }
                elementoNuevo.style.left = elemento.elementoDebajo.posicion + 'rem';
                elementoNuevo.style.bottom = elemento.posicionBottom - 3.6 + 'rem';
                elementoNuevo.style.rotate = '180deg';
                contenedorJuego.appendChild(elementoNuevo);
            }
        })
        estructuraNivel = temp;
    }

    function quitarElementos() {
        const zarzas = document.querySelectorAll('.zarzas');
        const bloques = document.querySelectorAll('.bloque');
        const topBloques = document.querySelectorAll('.bloqueTop');
        const bottomBloques = document.querySelectorAll('.bloqueBottom');
        const letreros = document.querySelectorAll('.letrero');
        const espejos = document.querySelectorAll('.espejo');
        const bayas = document.querySelectorAll('.baya');
        const trampolines = document.querySelectorAll('.trampolin');
        const bandera = document.querySelector('.bandera');
        contenedorJuego.removeChild(suelo);
        contenedorJuego.removeChild(personaje);
        contenedorJuego.removeChild(tiempo);
        zarzas.forEach(zarza => {
            contenedorJuego.removeChild(zarza);
        });
        bloques.forEach(bloque => {
            contenedorJuego.removeChild(bloque);
        });
        topBloques.forEach(topBloque => {
            contenedorJuego.removeChild(topBloque);
        });
        bottomBloques.forEach(bottomBloque => {
            contenedorJuego.removeChild(bottomBloque);
        })
        letreros.forEach(letrero => {
            contenedorJuego.removeChild(letrero);
        })
        espejos.forEach(espejo => {
            contenedorJuego.removeChild(espejo);
        });
        bayas.forEach(baya => {
            contenedorJuego.removeChild(baya);
        })
        trampolines.forEach(trampolin => {
            contenedorJuego.removeChild(trampolin);
        })
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
        estadoPersonaje = 'quieto';
        posicionFondo = 0.00, posicionSuelo = 0.00, posicionPersonaje = 5;
        limiteSalto = posicionPersonaje + 10, limiteCaidaLenta = limiteSalto - 1, limiteCaidaMedia = limiteSalto - 2;
        segundosActual = 0, minutosActual = 0;
        cambioGravedad = false;
        enAire = false;
        prohibidoSaltar = false;

        pararIntervalos();
        contenedorJuego.appendChild(personaje);
        contenedorJuego.appendChild(tiempo);
        contenedorJuego.appendChild(pantallaPausa);

        personaje.src = '../GeOsometryDash/imagenes/Oso.png';
        personaje.style.transform = 'scaleX(1) scaleY(1)';

        contenedorJuego.style.backgroundImage = 'url(../GeOsometryDash/imagenes/Fondo_juego.png)';
        contenedorJuego.style.backgroundSize = "";
        contenedorJuego.style.backgroundPosition = '0% center';

        personaje.style.bottom = posicionPersonaje + 'rem';
        tiempo.textContent = '0m 0s';

        boton.setAttribute('hidden', '');

        arrancarJuego();
    }

    function pararIntervalos() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        clearInterval(tiempoSuma);

        ultimoFrame = 0;
    }

    function actualizarTiempo(){
        tiempoSuma = setInterval(function() {
            if (segundosActual < 59) {
                segundosActual += 1;
            } else {
                segundosActual = 0;
                minutosActual++;
            }
            tiempo.textContent = minutosActual + 'm ' + segundosActual + 's';
        }, 999);
    }

    //Funcionamiento juego
    function arrancarJuego() {
        pantallaActual = 'Juego';
        actualizarTiempo();
       
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
                actualizarPersonaje(deltaTime);
                comprobarColisiones(personaje);
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

        //Zarzas, bloques, bloquesTop, bloquesBottom, espejo, letrero, baya, trampolin
        let iteraciones = [0, 0, 0, 0, 0, 0, 0, 0];

        const bloques = document.querySelectorAll('.bloque');
        const topBloques = document.querySelectorAll('.bloqueTop');
        const bottomBloques = document.querySelectorAll('.bloqueBottom');
        const zarzas = document.querySelectorAll('.zarzas');
        const letreros = document.querySelectorAll('.letrero');
        const espejos = document.querySelectorAll('.espejo');
        const bayas = document.querySelectorAll('.baya');
        const trampolines = document.querySelectorAll('.trampolin');
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
                    case 'bloqueBottom':
                        bottomBloques[iteraciones[3]].style.left = estructuraNivel[i].posicion + 'rem';

                        iteraciones[3]++;
                        break;
                    case 'espejo':
                        espejos[iteraciones[4]].style.left = estructuraNivel[i].posicion + 'rem';

                        iteraciones[4]++;
                        break;
                    case 'letrero':
                        letreros[iteraciones[5]].style.left = estructuraNivel[i].posicion + 'rem';
                        
                        iteraciones[5]++;
                        break;
                    case 'baya':
                        bayas[iteraciones[6]].style.left = estructuraNivel[i].posicion + 'rem';

                        iteraciones[6]++;
                        break;
                    case 'trampolin':
                        trampolines[iteraciones[7]].style.left = estructuraNivel[i].posicion + 'rem';
                        
                        iteraciones[7]++;
                        break;
                    case 'bandera':
                        bandera.style.left = estructuraNivel[i].posicion + 'rem';
                        break;
                }

            // }

        }
    }

    function eliminarElemento(iteracionEstructura, elemento) {
        if (estructuraNivel[iteracionEstructura].posicion <= -10) {
            estructuraNivel[iteracionEstructura].eliminado = true;
            contenedorJuego.removeChild(elemento);
        }
    }

    function reiniciarJuego() {
        const encabezadoPausa = document.getElementById('encabezadoPausa');
        const niveles = new Niveles();
        quitarElementos();
        estructuraNivel = niveles.getEstructura(encabezadoPausa.textContent);
        crearEstructura();
        comenzarJuego();
    }

    // NUEVO --> cambiar estado del personaje
    // Ahora la función "Actualizar personaje" es la que mueve arriba y abajo el pj
    function surf() {
        estadoPersonaje = 'surf_subida';
        sumaSurf = 0.1;

        window.addEventListener('keyup', bajadaSurf);

        window.addEventListener('blur', bajadaSurf);
    }

    function bajadaSurf() {
        if (modoActual == 'Surf') {
            estadoPersonaje = 'surf_bajada';
            sumaSurf = 0.01
        } else {
            window.removeEventListener('keyup', bajadaSurf);
            window.removeEventListener('blur', bajadaSurf);
        }
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
                if(pause && (pantallaActual != 'Menu' || pantallaActual != 'Niveles')) {
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
                    } else if (modoActual === 'Surf') {
                        surf();
                    } else if (modoActual === 'Bola' && !prohibidoSaltar) {
                        prohibidoSaltar = true;
                        espejoGravedad();
                        realizarCaida();
                    } else if (modoActual === 'Ufo') {
                        prohibidoSaltar = false;
                        realizarSalto();
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
})


/**  ARREGLAR POSTERIORMENTE
 * 
 * Dos detalles que quiero que tengas en cuenta antes de probarlo
 * En comprobarColisiones() debes evitar que los elementos ya eliminados se sigan comprobando. Además, sería conveniente comprobar que bandera y los demás elementos existen antes de acceder a ellos en actualizarObstaculos(). La implementación actual conserva algunas limitaciones de tu sistema de eliminación original.
 * 
 * 
 * 
 * (??) Hay que tener especial cuidado con las colisiones del trampolín, que ahora pueden llamar a realizarSalto() en varios fotogramas consecutivos.
 * 
 */