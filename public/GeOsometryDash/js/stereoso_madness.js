document.addEventListener("DOMContentLoaded", function() {
    const estructuraJuego = [
        { nombre: 'zarzas', posicion: 100 },
        { nombre: 'zarzas', posicion: 200 },
        { nombre: 'zarzas', posicion: 201 },
        { nombre: 'bloque', posicion: 300 },
        { nombre: 'zarzas', posicion: 301 },
        { nombre: 'zarzas', posicion: 302 },
    ];

    function generarEstructura() {
        estructuraJuego.forEach(function(elemento) {
            const div = document.createElement('img');
            div.classList.add(elemento.nombre);
            switch (elemento.nombre) {
                case 'zarzas':
                    div.src = '../GeOsometryDash/imagenes/Zarzas.png';
                    break;
                case 'bloque':
                    div.src = '../GeOsometryDash/imagenes/Bloque.png';
                    break;
            }
            div.style.left = elemento.posicion + 'rem';
            contenedorJuego.appendChild(div);
        });
    }
})
