document.addEventListener('DOMContentLoaded', function() {
    const panelesLogin = document.querySelectorAll('.panelLogin'); 
    const botonCambiar = document.querySelectorAll('.cambiarPanel');
    const oculto = "hidden";

    botonCambiar.forEach(element => {
        element.addEventListener('click', function() {
            panelesLogin.forEach(element2 => {
                if(element2.classList.contains(oculto)){
                    element2.classList.remove(oculto);
                } else {
                    element2.classList.add(oculto);
                }
            })
        })
    })

    const botones_como_jugar = document.querySelectorAll('#botones-comoJugar button');

    botones_como_jugar.forEach(boton => {
        boton.addEventListener('click', function() {
            
        })
    })
})