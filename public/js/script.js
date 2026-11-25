document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('form[data-submitting-text]').forEach(form => {
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.textContent;

        form.addEventListener('submit', function(event) {
            if (button.disabled) {
                event.preventDefault();
                return;
            }

            button.disabled = true;
            button.textContent = form.dataset.submittingText;
        });

        window.addEventListener('pageshow', function() {
            button.disabled = false;
            button.textContent = originalText;
        });
    });

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
