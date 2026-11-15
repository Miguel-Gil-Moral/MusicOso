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

    var estructuraNivel = [], audio;
    var salto, caida, personajeChocado, volar, enAire = false, pause, cambioGravedad = false, prohibidoSaltar = false;
    var pantallaActual = 'Menu', modoActual = 'Cubo';
    var moverFondo, moverElementos, moverEspejo, moverCaja, moverBaya, moverTrampolin;
    var posicionFondo = 0, posicionSuelo = 0, sueloPersonaje = 5,
    posicionPersonaje = 5, posicionEspejo = 450, posicionCaja = 250, posicionBaya = 200, posicionTrampolin = 225;
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
            if (elemento.posicion <= 300) {
                elemento.visible = true;
                imagen.style.left = elemento.posicion + 'rem';
                contenedorJuego.appendChild(imagen);
            } else {
                elemento.visible = false;
            }
            temp.push(elemento);
            if(elemento?.bloquesEncima && elemento.visible) {
                for (let i = 0; i < elemento.bloquesEncima; i++) {
                    posicionBottom += 3.5;
                    const bloqueEncima = document.createElement('img');
                    bloqueEncima.classList.add('bloque');
                    bloqueEncima.src = '../GeOsometryDash/imagenes/Bloque.png';
                    bloqueEncima.style.left = elemento.posicion + 'rem';
                    bloqueEncima.style.bottom = posicionBottom + 'rem';
                    contenedorJuego.appendChild(bloqueEncima);
                    temp.push({
                        nombre: bloqueEncima.classList[0],
                        posicion: elemento.posicion,
                        visible: elemento.visible
                    });
                }
            }
            if (elemento.nombre === 'bloque') {
                if (elemento.visible) {
                    divTopBloque.style.left = elemento.posicion + 'rem';
                    divTopBloque.style.bottom = posicionBottom + 3.5 + 'rem';
                    contenedorJuego.appendChild(divTopBloque);
                }
                temp.push({ 
                    nombre: divTopBloque.classList[0],
                    posicion: elemento.posicion,
                    visible: elemento.visible
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
        moverFondo = setInterval(function() {
            posicionFondo += 0.01;
            posicionSuelo -= 0.5;

            contenedorJuego.style.backgroundPositionX = posicionFondo + '%';
            suelo.style.backgroundPositionX = posicionSuelo + '%';
        }, 1);
        let iteraciones = [0, 0, 0]; //Zarzas, bloques, bloquesTop
        let bloques = document.querySelectorAll('.bloque');
        let topBloques = document.querySelectorAll('.bloqueTop');
        let zarzas = document.querySelectorAll('.zarzas');
        let bandera = document.querySelector('.bandera');
        moverElementos = setInterval(function() {
            iteraciones = [0, 0, 0];
            for (let i = 0; i < estructuraNivel.length; i++){
                estructuraNivel[i].posicion -= 0.2;
                agregarElemento(i, estructuraNivel[i].nombre);
                if (estructuraNivel[i].visible){
                    switch (estructuraNivel[i].nombre) {
                        case 'zarzas':
                            zarzas[iteraciones[0]].style.left = estructuraNivel[i].posicion + 'rem';
                            if(colision(personaje, zarzas[iteraciones[0]])){
                                personajeCaido();
                            }
                            eliminarElemento(i, zarzas[iteraciones[0]]);
                            iteraciones[0]++;
                            break;
                        case 'bloque':
                            bloques[iteraciones[1]].style.left = estructuraNivel[i].posicion + 'rem';
                            eliminarElemento(i, zarzas[iteraciones[1]]);
                            iteraciones[1]++;
                            break;
                        case 'bloqueTop':
                            topBloques[iteraciones[2]].style.left = estructuraNivel[i].posicion + 'rem';
                            if (colisionTopBloque(personaje, topBloques[iteraciones[2]])){
                                console.log('Ha chocado');
                            }
                            eliminarElemento(i, zarzas[iteraciones[2]]);
                            iteraciones[2]++;
                            break;
                        case 'bandera':
                            bandera.style.left = estructuraNivel[i].posicion - 0.2 + 'rem';
                            break;
                    }
                }
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

    function eliminarElemento(iteracionEstructura, elemento) {
        if (estructuraNivel[iteracionEstructura].posicion <= -10 && estructuraNivel[iteracionEstructura].visible) {
            estructuraNivel[iteracionEstructura].visible = false;
            contenedorJuego.removeChild(elemento);
        }
    }

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
        }
    }

    function personajeCaido() {
        audio.pause();
        pararIntervalos();
        clearInterval(salto);
        personajeChocado = setInterval(function() {
            enAire = false;
            reiniciarJuego();
        }, 2000)
    }

    function reiniciarJuego() {
        quitarElementos();
        estructuraNivel = getEstructuraStereoso();
        crearEstructura();
        comenzarJuego();
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
})