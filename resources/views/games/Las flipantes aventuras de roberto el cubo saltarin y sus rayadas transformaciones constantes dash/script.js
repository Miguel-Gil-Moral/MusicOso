document.addEventListener('DOMContentLoaded', function() {
    const contenedorJuego = document.getElementById('contenedorJuego');
    const boton = document.getElementById('botonJuego');
    const pantallaPausa = document.getElementById('pantallaPausa');
    const botonMenu = document.getElementById('botonMenu');
    const botonReanudar = document.getElementById('botonReanudar');
    const botonReiniciar = document.getElementById('botonReiniciar');
    const niveles = document.getElementById('niveles');
    
    const suelo = document.createElement('div');
    const personaje = document.createElement('img');
    const bloque = document.createElement('img');
    const zarzas = document.createElement('img');
    const caja = document.createElement('img');
    const espejo = document.createElement('img');

    bloque.className = 'bloque';
    bloque.src = './imagenes/Bloque.png';
    zarzas.className = 'zarzas';
    zarzas.src = './imagenes/Zarzas.png';
    espejo.className = 'espejo';
    espejo.src = './imagenes/Espejo.png';
    caja.className = 'caja';
    caja.src = './imagenes/Caja.png';

    suelo.id = 'sueloJuego';
    personaje.src = './imagenes/Oso.jpg';
    personaje.id = 'personaje';

    establecerMenu();

    var salto, caida, personajeChocado, volar, enAire = false, pause, cambioGravedad = false, prohibidoSaltar = false;
    var pantallaActual = 'Menu', modoActual = 'Cubo';
    var moverFondo, moverSuelo, moverBloque, moverZarza, moverEspejo, moverCaja;
    var posicionFondo = 0, posicionSuelo = 0, sueloPersonaje = 5,
    posicionPersonaje = 5, posicionBloque = 150, posicionZarza = 95, posicionEspejo = 450, posicionCaja = 250,
    limiteCaidaLenta, limiteCaidaMedia;
    
    
    function establecerMenu() {
        niveles.style.display = 'none';
        pantallaActual = 'Menu';
        pararIntervalos();
        contenedorJuego.style.backgroundImage = 'url(./imagenes/Fondo_menu.jpg)';
        pantallaPausa.style.display = 'none';
        contenedorJuego.style.backgroundSize = 'cover';
        boton.removeAttribute('hidden');
    }

    function establecerNiveles() {
        niveles.style.display = 'flex';
        pantallaActual = 'Niveles';
    }

    //Comenzar Juego
    boton.addEventListener('click', function() {
        comenzarJuego();
    });

    botonMenu.addEventListener('click', function() {
        pantallaActual = 'Menu';
        pantallaPausa.style.display = 'none';
        pause = false;
        contenedorJuego.removeChild(suelo);
        contenedorJuego.removeChild(personaje);
        contenedorJuego.removeChild(zarzas);
        contenedorJuego.removeChild(bloque);
        contenedorJuego.removeChild(espejo);
        contenedorJuego.removeChild(caja);
        pararIntervalos();
        establecerMenu();
    })

    botonReanudar.addEventListener('click', function(){
        pause = false;
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
        modoActual = 'Cubo';
        posicionFondo = 0.00, posicionSuelo = 0.00;
        posicionPersonaje = 5, posicionBloque = 150, posicionZarza = 96, posicionEspejo = 450, posicionCaja = 250;
        cambioGravedad = false;
        enAire = false;
        prohibidoSaltar = false;

        pararIntervalos();
        contenedorJuego.appendChild(suelo);
        contenedorJuego.appendChild(bloque);
        contenedorJuego.appendChild(zarzas);
        contenedorJuego.appendChild(personaje);
        contenedorJuego.appendChild(espejo);
        contenedorJuego.appendChild(caja);
        contenedorJuego.appendChild(pantallaPausa);

        contenedorJuego.style.backgroundImage = 'url(./imagenes/Fondo_juego.png)';
        contenedorJuego.style.backgroundSize = "";
        contenedorJuego.style.backgroundPosition = '0% center';

        personaje.style.bottom = posicionPersonaje + 'rem';

        boton.setAttribute('hidden', '');

        arrancarJuego();
    }

    function pararIntervalos() {
        clearInterval(moverFondo);
        clearInterval(moverSuelo);
        clearInterval(moverBloque);
        clearInterval(moverZarza);
        clearInterval(moverEspejo);
        clearInterval(moverCaja);
        clearInterval(salto);
        clearInterval(caida);
        clearInterval(volar);
        clearInterval(personajeChocado);
    }

    //Funcionamiento juego
    function arrancarJuego() {
        pantallaActual = 'Juego';
        moverFondo = setInterval(function() {
            posicionFondo += 0.01;

            contenedorJuego.style.backgroundPositionX = posicionFondo + '%';
        }, 1);

        moverSuelo = setInterval(function() {
            posicionSuelo -= 0.5;

            suelo.style.backgroundPositionX = posicionSuelo + '%';
        }, 1);

        moverBloque = setInterval(function() {
            posicionBloque -= 0.2;

            bloque.style.left = posicionBloque + 'rem';
            // if (colisionBloque(personaje, bloque, posicionPersonaje) == 'Chocado'){
            //     pararIntervalos();
            //     clearInterval(salto);
            //     personajeChocado = setInterval(function() {
            //         enAire = false;
            //         comenzarJuego();
            //     }, 2000)
            // }
            // else if (colisionBloque(personaje, bloque) == 'Encima') {
            //     clearInterval(caida);
            // }
        }, 1);

        moverZarza = setInterval(function() {
            posicionZarza -= 0.2;

            zarzas.style.left = posicionZarza + 'rem';
            if(colision(personaje, zarzas)){
                prohibidoSaltar = true;
                pararIntervalos();
                clearInterval(salto);
                personajeChocado = setInterval(function() {
                    enAire = false;
                    comenzarJuego();
                }, 2000)
            }
        }, 1);

        moverCaja = setInterval(function() {
            posicionCaja -= 0.2;

            caja.style.left = posicionCaja + 'rem';
            if(colision(personaje, caja)) {
                modoActual = 'Nave';
            }
        }, 1);

        moverEspejo = setInterval(function() {
            posicionEspejo -= 0.2;

            espejo.style.left = posicionEspejo + 'rem';

            if(colision(personaje, espejo)) {
                cambioGravedad = true;
                realizarCaida();
            }
        }, 1);
    }

    function nave() {
        volar = setInterval(function() {
            if(!cambioGravedad) {
                posicionPersonaje += 0.02;
            }

            personaje.style.bottom = posicionPersonaje + 'rem';
        }, 1);
    }

    function realizarSalto() {
        enAire = true;
        
        if(!prohibidoSaltar) {
            prohibidoSaltar = true;
            salto = this.setInterval(function() {

                if (posicionPersonaje >= 14 && posicionPersonaje < 15){
                    posicionPersonaje += 0.07;
                } else if (posicionPersonaje >= 13 && posicionPersonaje < 14) {
                    posicionPersonaje += 0.17;
                } else {
                    posicionPersonaje += 0.27;
                }

                personaje.style.bottom = posicionPersonaje + 'rem';
                
                if (posicionPersonaje >= 15) {
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
                if(posicionPersonaje >= 14 && posicionPersonaje < 15) {
                    posicionPersonaje -= 0.07
                } else if (posicionPersonaje >= 13 && posicionPersonaje < 14) {
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
                if (!pause) {
                    pararIntervalos();
                    pantallaPausa.style.display = 'flex';
                    pause = true;
                } else {
                    pantallaActual = 'Menu';
                    pantallaPausa.style.display = 'none';
                    pause = false;
                    pararIntervalos();
                    establecerMenu();
                    contenedorJuego.removeChild(suelo);
                    contenedorJuego.removeChild(personaje);
                    contenedorJuego.removeChild(zarzas);
                    contenedorJuego.removeChild(bloque);
                    contenedorJuego.removeChild(espejo);
                    contenedorJuego.removeChild(caja);
                }
                break;
            case ' ':
                if (pantallaActual === 'Menu') {
                    pantallaActual = 'Juego';
                    comenzarJuego();
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