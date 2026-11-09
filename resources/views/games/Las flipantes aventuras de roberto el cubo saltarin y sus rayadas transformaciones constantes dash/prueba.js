document.addEventListener('DOMContentLoaded', function() {
    const bloque1 = document.getElementById('bloque1');
    const bloque2 = document.getElementById('bloque2');

    var posicionBloque1 = 0;

    // setInterval(function() {
    //     posicionBloque1 += 1;

    //     bloque1.style.left = posicionBloque1 + 'px';

    //     if (colisiones()) {
    //         console.log('Han colisionado');
    //     } else {
    //         console.log('No han colisionado');
    //     }
    // }, 1)

    document.addEventListener('mousemove', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        bloque1.style.left = `${x}px`;
        bloque1.style.top = `${y}px`;

        // const b1 = bloque1.getBoundingClientRect();
        // const b2 = bloque2.getBoundingClientRect();

        // console.log("top bloque2: " + b2.top);
        // console.log("bottom bloque1: " + b1.bottom);

        // colisionBloque(bloque1, bloque2);

        // if(colisionBloque(bloque1, bloque2)){
        //     console.log('Han chocado');
        // }

        // if (
        //     b1.right < b2.left ||
        //     b1.left > b2.right ||
        //     b1.top > b2.bottom ||
        //     b1.bottom < b2.top
        // ) {
        //     console.log('No han chocado');
        // } else if (x >= b2.top) {
        //     console.log('Si han chocado')
        // } else {
        //     console.log('Ha cochado en los laterales o abajo')
        // }

        // if(colisiones) {
        //     console.log('No Han chocado');
        // } else {
        //     console.log('Han chocado')
        // }
    })
        
    // function colisiones() {
    //     const b1 = bloque1.getBoundingClientRect();
    //     const b2 = bloque2.getBoundingClientRect();

    //     return !(
    //         b1.right < b2.left ||
    //         b1.left > b2.right ||
    //         b1.bottom > b2.top ||
    //         b1.top > b2.bottom
    //     );
    // }

    // function colisionBloque() {
    //     const b1 = bloque1.getBoundingClientRect();
    //     const b2 = bloque2.getBoundingClientRect();

    //     posicionTopB2 = b2.top;

    //     if (b1.bottom >= posicionTopB2) {
    //         console.log('Han Chocado')
    //     }
    // }

    // function colisionBloque(personaje, bloque, posicionAnterior) {
    //     const el1 = personaje.getBoundingClientRect();
    //     const el2 = bloque.getBoundingClientRect();

    //     // Comprobar si no existe intersección
    //     if (
    //         el1.right <= el2.left ||
    //         el1.left >= el2.right ||
    //         el1.bottom <= el2.top ||
    //         el1.top >= el2.bottom
    //     ) {
    //         console.log("Nada");
    //         return "Nada";
    //     }

    //     // Comprobar si ha aterrizado encima del bloque
    //     if (
    //         posicionAnterior.bottom <= el2.top &&
    //         el1.bottom >= el2.top
    //     ) {
    //         console.log("Arriba");
    //         return "Arriba";
    //     }

    //     // Cualquier otro contacto: laterales o parte inferior
    //     console.log("Laterales y abajo");
    //     return "Laterales y abajo";
    // }

    function colisionBloque(bloque1, bloque2) {
        const bl1 = bloque1.getBoundingClientRect();
        const bl2 = bloque1.getBoundingClientRect();

        return (bl1.x + bl1.width >= bl2.x);
    }
})