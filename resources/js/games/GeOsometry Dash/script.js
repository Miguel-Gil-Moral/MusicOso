document.addEventListener('DOMContentLoaded', function() {
    const contenedorJuego = document.getElementById('contenedorJuego');
    const boton = document.getElementById('botonJuego');

    const suelo = document.createElement('div');
    const pantallaPausa = document.createElement('div');
    const personaje = document.createElement('img');
    const bloque = document.createElement('img');
    const zarzas = document.createElement('img');

    bloque.className = 'bloque';
    bloque.src = './imagenes/Bloque.png';
    zarzas.className = 'zarzas';
    zarzas.src = './imagenes/Zarzas.png';

    suelo.id = 'sueloJuego';
    pantallaPausa.id = 'pantallaPausa';
    personaje.src = './imagenes/Oso.jpg';
    personaje.id = 'personaje';

    establecerMenu();

    var salto, enAire = false, limiteSaltoLlegado;
    var pantallaActual = 'Menu';
    var moverFondo, moverSuelo, moverBloque, moverZarza;
    var posicionFondo = 0, posicionSuelo = 0, posicionPersonaje = 5.0, posicionBloque = 150, posicionZarza = 95;
    var pause = false;

    function establecerMenu() {
        pantallaActual = 'Menu';
        this.clearInterval(moverFondo);
        this.clearInterval(moverSuelo);
        contenedorJuego.style.backgroundImage = 'url(./imagenes/Fondo_menu.jpg)';
        pantallaPausa.setAttribute('hidden', '');
        contenedorJuego.style.backgroundSize = 'cover';
        boton.removeAttribute('hidden');
    }

    //Comenzar Juego
    boton.addEventListener('click', function() {
        comenzarJuego();
    });

    function comenzarJuego() {
        posicionFondo = 0.00, posicionSuelo = 0.00;
        posicionPersonaje = 5.0, posicionBloque = 150, posicionZarza = 96;

        clearInterval(salto);
        clearInterval(moverFondo);
        clearInterval(moverSuelo);
        clearInterval(moverBloque);
        clearInterval(moverZarza);
        contenedorJuego.appendChild(suelo);
        contenedorJuego.appendChild(bloque);
        contenedorJuego.appendChild(zarzas);
        contenedorJuego.appendChild(personaje);
        contenedorJuego.appendChild(pantallaPausa);

        contenedorJuego.style.backgroundImage = 'url(./imagenes/Fondo_juego.png';
        contenedorJuego.style.backgroundSize = "";
        contenedorJuego.style.backgroundPosition = '0% center';

        personaje.style.bottom = posicionPersonaje + 'rem';

        boton.setAttribute('hidden', '');

        arrancarJuego();
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
            if(colisionMuerteBloque(personaje, bloque)){
                enAire = false;
                comenzarJuego();
            }
        }, 1);

        moverZarza = setInterval(function() {
            posicionZarza -= 0.2;

            zarzas.style.left = posicionZarza + 'rem';
            if(colisionesPincho(personaje, zarzas)){
                enAire = false;
                comenzarJuego();
            }
        }, 1);
    }

    function realizarSalto() {
        limiteSaltoLlegado = false;
        enAire = true;
        salto = this.setInterval(function() {

            switch(limiteSaltoLlegado) {
                case true:
                    if(posicionPersonaje >= 14 && posicionPersonaje < 15) {
                        posicionPersonaje -= 0.07
                    } else if (posicionPersonaje >= 13 && posicionPersonaje < 14) {
                        posicionPersonaje -= 0.17;
                    } else {
                        posicionPersonaje -= 0.27;
                    }
                    break;
                case false:
                    if (posicionPersonaje >= 14 && posicionPersonaje < 15){
                        posicionPersonaje += 0.07;
                    } else if (posicionPersonaje >= 13 && posicionPersonaje < 14) {
                        posicionPersonaje += 0.17;
                    } else {
                        posicionPersonaje += 0.27;
                    }
                    break;
            }
            personaje.style.bottom = posicionPersonaje + 'rem';
            
            if (posicionPersonaje >= 15) {
                limiteSaltoLlegado = true;
            } else if (posicionPersonaje <= 5.0) {
                clearInterval(salto);
                personaje.style.bottom = 5 + 'rem';
                enAire = false;
                limiteSaltoLlegado = false;
            }
        }, 1);
    }

    //Acciones de teclado
    window.addEventListener('keydown', function(event) {
        switch (event.key) {
            case ' ':
                if (!pause && pantallaActual == 'Juego' && !enAire) {
                    realizarSalto();
                } else if (pause && pantallaActual == 'Juego'){
                    arrancarJuego();
                    pause = false;
                    pantallaPausa.setAttribute('hidden', '');
                    if (enAire) {
                        realizarSalto();
                    }
                } else if (pantallaActual == 'Menu') {
                    comenzarJuego();
                }
                break;
            case 'Escape':
                if (event.key === 'Escape' && !pause && pantallaActual == 'Juego') {
                    this.clearInterval(moverFondo);
                    this.clearInterval(moverSuelo);
                    this.clearInterval(salto);
                    this.clearInterval(moverBloque);
                    this.clearInterval(moverZarza);
                    pause = true;
                    pantallaPausa.removeAttribute('hidden');   
                } else if (event.key === 'Escape' && pause && pantallaActual == 'Juego') {
                    pantallaActual = 'Menu';
                    establecerMenu();
                    pause = false;
                    enAire = false;
                    limiteSaltoLlegado = false;
                    contenedorJuego.removeChild(suelo);
                    contenedorJuego.removeChild(bloque);
                    contenedorJuego.removeChild(zarzas);
                    contenedorJuego.removeChild(personaje);
                }
                break;
            case 'r':
                if (pantallaActual == 'Juego'){
                    enAire = false;
                    if(pause) {
                        pantallaPausa.setAttribute('hidden', '');
                        pause = false;
                    }
                    comenzarJuego();
                }
                break;

        }
    })
})