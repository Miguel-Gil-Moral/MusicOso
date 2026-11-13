document.addEventListener('DOMContentLoaded', function() {
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
    const bloque = document.createElement('img');
    const zarzas = document.createElement('img');
    const caja = document.createElement('img');
    const espejo = document.createElement('img');
    const baya = document.createElement('img');
    const trampolin = document.createElement('img');

    bloque.className = 'bloque';
    bloque.src = '../GeOsometryDash/imagenes/Bloque.png';
    zarzas.className = 'zarzas';
    zarzas.src = '../GeOsometryDash/imagenes/Zarzas.png';
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

    var iteracionBloques, iteracionZarzas;
    var estructuraNivel = [], audio;
    var salto, caida, personajeChocado, volar, enAire = false, pause, cambioGravedad = false, prohibidoSaltar = false;
    var pantallaActual = 'Menu', modoActual = 'Cubo';
    var moverFondo, moverElementos, moverEspejo, moverCaja, moverBaya, moverTrampolin;
    var posicionFondo = 0, posicionSuelo = 0, sueloPersonaje = 5,
    posicionPersonaje = 5, posicionEspejo = 450, posicionCaja = 250, posicionBaya = 200, posicionTrampolin = 225, posicionBandera = 1000;
    limiteSalto = posicionPersonaje + 10, limiteCaidaLenta = limiteSalto - 1, limiteCaidaMedia = limiteSalto - 2;
    
    
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
                if (nivel.dataset.nombre === 'StereOso Madness') {
                    audio = new Audio('../GeOsometryDash/audio/stereo_madness.mp3');
                    audio.volume = 0.05;
                    audio.play();
                    estructuraNivel = getEstructuraStereoso();
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
            if(elemento?.bloquesEncima) {
                if(!elemento?.bloquesDetras) {
                    for (let i = 0; i < elemento.bloquesEncima; i++) {
                        posicionBottom += 3.5;
                        const bloqueEncima = document.createElement('img');
                        bloqueEncima.classList.add('bloque');
                        bloqueEncima.src = '../GeOsometryDash/imagenes/Bloque.png';
                        bloqueEncima.style.left = elemento.posicion + 'rem';
                        bloqueEncima.style.bottom = posicionBottom + 'rem';
                        contenedorJuego.appendChild(bloqueEncima);
                    }
                }
            }
            if(elemento.nombre === 'bloque'){
                divTopBloque.style.left = elemento.posicion + 'rem';
                divTopBloque.style.bottom = posicionBottom + 3.5 + 'rem';
                contenedorJuego.appendChild(divTopBloque);
            }
        })
    }

    function quitarElementos() {
        const bloques = document.querySelectorAll('.bloque');
        const zarzas = document.querySelectorAll('.zarzas');
        contenedorJuego.removeChild(suelo);
        contenedorJuego.removeChild(personaje);
        zarzas.forEach(zarza => {
            contenedorJuego.removeChild(zarza);
        });
        bloques.forEach(bloque => {
            contenedorJuego.removeChild(bloque);
        });
        contenedorJuego.removeChild(espejo);
        contenedorJuego.removeChild(caja);
        contenedorJuego.removeChild(baya);
        contenedorJuego.removeChild(trampolin);
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
        // audio.play();
        pantallaPausa.style.display = 'none';
        arrancarJuego();
        if (enAire) {
            realizarCaida();
        }
    })

    botonReiniciar.addEventListener('click', function() {
        pantallaPausa.style.display = 'none';
        pause = false;
        pararIntervalos();
        comenzarJuego();
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
        clearInterval(moverFondo);
        clearInterval(moverElementos);
        clearInterval(moverEspejo);
        clearInterval(moverCaja);
        clearInterval(moverBaya);
        clearInterval(moverTrampolin);
        clearInterval(salto);
        clearInterval(caida);
        clearInterval(volar);
        clearInterval(personajeChocado);
    }

    //Funcionamiento juego
    function arrancarJuego() {
        pantallaActual = 'Juego';
        let posicionBloques, posicionZarzas;
        moverFondo = setInterval(function() {
            posicionFondo += 0.01;
            posicionSuelo -= 0.5;

            contenedorJuego.style.backgroundPositionX = posicionFondo + '%';
            suelo.style.backgroundPositionX = posicionSuelo + '%';
        }, 1);

        moverElementos = setInterval(function() {
            iteracionBloques = 0, iteracionZarzas = 0;
            posicionBloques = [], posicionZarzas = [];
            const bloques = document.querySelectorAll('.bloque');
            const topBloques = document.querySelectorAll('.bloqueTop');
            const zarzas = document.querySelectorAll('.zarzas');
            const bandera = document.querySelector('.bandera');
            estructuraNivel.forEach(elemento => {
                elemento.posicion -= 0.2;
                switch (elemento.nombre) {
                    case 'zarzas':
                        zarzas[iteracionZarzas].style.left = elemento.posicion + 'rem';
                        
                        if(colision(personaje, zarzas[iteracionZarzas])){
                            audio.pause();
                            prohibidoSaltar = true;
                            pararIntervalos();
                            clearInterval(salto);
                            personajeChocado = setInterval(function() {
                                enAire = false;
                                crearEstructura();
                                comenzarJuego();
                            }, 2000)
                        }
                        iteracionZarzas++;
                        break;
                    case 'bloque':
                        bloques[iteracionBloques].style.left = elemento.posicion + 'rem';

                        iteracionBloques++;
                        break;
                    case 'bandera':
                        bandera.style.left = elemento.posicion + 'rem';
                        break;
                }
                // if (elemento.nombre === 'bloque') {
                //     elemento.posicion -= 0.2;
                //     if(elemento?.bloquesEncima) {
                //         for (let i = 0; i < elemento.bloquesEncima; i++) {
                //             posicionBloques.push(elemento.posicion);
                //         }
                //     }
                //     posicionBloques.push(elemento.posicion);
                // }
            });

            for (let i = 0; i < bloques.length; i++) {
                bloques[i].style.left = posicionBloques[i] + 'rem';
                // if (colision(personaje, topBloques[i])) {
                //     console.log('Ha chocado');
                // } else if (colisionBloque(personaje, bloques[i])) {
                //     console.log('Ha chocado X');
                // }
            }
            
        }, 1);

        moverCaja = setInterval(function() {
            posicionCaja -= 0.2;

            caja.style.left = posicionCaja + 'rem';
            // if(colision(personaje, caja)) {
            //     modoActual = 'Nave';
            // }
        }, 1);

        moverEspejo = setInterval(function() {
            posicionEspejo -= 0.2;

            espejo.style.left = posicionEspejo + 'rem';

            // if(colision(personaje, espejo)) {
            //     cambioGravedad = true;
            //     realizarCaida();
            // }
        }, 1);

        moverBaya = setInterval(function() {
            posicionBaya -= 0.2;

            baya.style.left = posicionBaya + 'rem';
            if(colision(personaje, baya)) {
                prohibidoSaltar = false;
            }
        }, 1);

        moverTrampolin = setInterval(function() {
            posicionTrampolin -= 0.2;
            
            trampolin.style.left = posicionTrampolin + 'rem';
            if(colision(personaje, trampolin)) {
                realizarSalto();
            }
        }, 1);
    }

    function nave() {
        volar = setInterval(function() {
            if(!cambioGravedad) {
                posicionPersonaje += 0.02;
                realizarSalto();
            }

            personaje.style.bottom = posicionPersonaje + 'rem';
        }, 1);
    }

    function realizarSalto() {
        enAire = true;
        
        if(!prohibidoSaltar) {
            limiteSalto = posicionPersonaje + 10;
            limiteCaidaLenta = limiteSalto - 1;
            limiteCaidaMedia = limiteSalto - 2;
            clearInterval(salto);
            clearInterval(caida);
            prohibidoSaltar = true;
            salto = this.setInterval(function() {

                if (posicionPersonaje >= limiteCaidaLenta && posicionPersonaje < limiteSalto) {
                    posicionPersonaje += 0.07;
                } else if (posicionPersonaje >= limiteCaidaMedia && posicionPersonaje < limiteCaidaLenta) {
                    posicionPersonaje += 0.17;
                } else {
                    posicionPersonaje += 0.27;
                }

                personaje.style.bottom = posicionPersonaje + 'rem';
                
                if (posicionPersonaje >= limiteSalto) {
                    clearInterval(salto);
                    realizarCaida();
                }
            }, 1);
        }
    }

    function realizarCaida() {
        clearInterval(caida);
        caida = setInterval(function() {

            if (!cambioGravedad) {
                if(posicionPersonaje >= limiteCaidaLenta && posicionPersonaje < limiteSalto) {
                    posicionPersonaje -= 0.07
                } else if (posicionPersonaje >= limiteCaidaMedia && posicionPersonaje < limiteCaidaLenta) {
                    posicionPersonaje -= 0.17;
                } else {
                    posicionPersonaje -= 0.27;
                }
            } else {
                limiteCaidaLenta = posicionPersonaje + 1;
                limiteCaidaMedia = posicionPersonaje + 2;
                if(posicionPersonaje >= limiteCaidaLenta){
                    posicionPersonaje += 0.07;
                } else if (posicionPersonaje >= limiteCaidaMedia) {
                    posicionPersonaje += 0.17;
                } else {
                    posicionPersonaje += 0.27;
                }
            }

            personaje.style.bottom = posicionPersonaje + 'rem';

            if (posicionPersonaje <= sueloPersonaje) {
                clearInterval(caida);
                personaje.style.bottom = sueloPersonaje + 'rem';
                enAire = false;
                prohibidoSaltar = false;
            }
        }, 1);
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
                    pararIntervalos();
                    comenzarJuego();
                }
                break;

        }
    })
})