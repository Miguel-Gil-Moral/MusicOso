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

    var estructuraNivel = [];
    var salto, caida, personajeChocado, volar, enAire = false, pause, cambioGravedad = false, prohibidoSaltar = false;
    var pantallaActual = 'Menu', modoActual = 'Cubo';
    var moverFondo, moverSuelo, moverBloque, moverZarza, moverEspejo, moverCaja, moverBaya, moverTrampolin, moverBandera;
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
                        console.log(elemento.posicion, posicionBottom);
                        const bloqueEncima = document.createElement('img');
                        bloqueEncima.classList.add('bloque');
                        bloqueEncima.src = '../GeOsometryDash/imagenes/Bloque.png';
                        bloqueEncima.style.left = elemento.posicion + 'rem';
                        bloqueEncima.style.bottom = posicionBottom + 'rem';
                        contenedorJuego.appendChild(bloqueEncima);
                        console.log('Bloque encima creado en posición:', elemento.posicion, 'con bottom:', posicionBottom);
                    }
                }
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
        posicionPersonaje = 5, posicionEspejo = 450, posicionCaja = 250, posicionBaya = 200, posicionTrampolin = 225;
        limiteSalto = posicionPersonaje + 10, limiteCaidaLenta = limiteSalto - 1, limiteCaidaMedia = limiteSalto - 2;
        cambioGravedad = false;
        enAire = false;
        prohibidoSaltar = false;

        pararIntervalos();
        contenedorJuego.appendChild(suelo);
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
        clearInterval(moverSuelo);
        clearInterval(moverBloque);
        clearInterval(moverZarza);
        clearInterval(moverEspejo);
        clearInterval(moverCaja);
        clearInterval(moverBaya);
        clearInterval(moverTrampolin);
        clearInterval(moverBandera);
        clearInterval(salto);
        clearInterval(caida);
        clearInterval(volar);
        clearInterval(personajeChocado);
    }

    //Funcionamiento juego
    function arrancarJuego() {
        pantallaActual = 'Juego';
        let posicionBloques = [];
        moverFondo = setInterval(function() {
            posicionFondo += 0.01;

            contenedorJuego.style.backgroundPositionX = posicionFondo + '%';
        }, 1);

        moverSuelo = setInterval(function() {
            posicionSuelo -= 0.5;

            suelo.style.backgroundPositionX = posicionSuelo + '%';
        }, 1);

        moverBloque = setInterval(function() {
            posicionBloques = [];
            const bloques = document.querySelectorAll('.bloque');
            estructuraNivel.forEach(elemento => {
                if (elemento.nombre === 'bloque') {
                    elemento.posicion -= 0.2;
                    if(elemento?.bloquesEncima) {
                        for (let i = 0; i < elemento.bloquesEncima; i++) {
                            posicionBloques.push(elemento.posicion);
                        }
                    }
                    posicionBloques.push(elemento.posicion);
                }
            });
            console.log('Posiciones de bloques actualizadas:', posicionBloques);
            for (let i = 0; i < bloques.length; i++) {
                bloques[i].style.left = posicionBloques[i] + 'rem';
            }
            
            // if (colision(personaje, bloque)) {
            //     console.log('Chocado');
            // } else if (colisionTopBloque(personaje, bloque)) {
            //     clearInterval(caida);
            // }

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
            const zarzas = document.querySelectorAll('.zarzas');
            let posicionZarzas = [];
            estructuraNivel.forEach(elemento => {
                if (elemento.nombre === 'zarzas') {
                    elemento.posicion -= 0.2;
                    posicionZarzas.push(elemento.posicion);
                }
            });

            for (let i = 0; i < zarzas.length; i++) {
                zarzas[i].style.left = posicionZarzas[i] + 'rem';

                // if(colision(personaje, zarzas[i])){
                //     prohibidoSaltar = true;
                //     pararIntervalos();
                //     clearInterval(salto);
                //     personajeChocado = setInterval(function() {
                //         enAire = false;
                //         comenzarJuego();
                //     }, 2000)
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

        moverBandera = setInterval(function() {
            const bandera = document.querySelector('.bandera');
            posicionBandera -= 0.2;

            bandera.style.left = posicionBandera + 'rem';
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