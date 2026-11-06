function colisionesPincho(elemento, elemento2) {
        const el1 = elemento.getBoundingClientRect();
        const el2 = elemento2.getBoundingClientRect();

        return !(
            el2.right < el1.left ||
            el2.left > el1.right ||
            el2.bottom < el1.top ||
            el2.top > el1.bottom
        );
    }

    function colisionMuerteBloque(elemento, elemento2) {
        const el1 = elemento.getBoundingClientRect();
        const el2 = elemento2.getBoundingClientRect();
        let colision;

        if (
            el2.right < el1.left ||
            el2.left > el1.right ||
            el2.bottom < el1.top ||
            el2.top > el1.bottom
        ) {
            colision = false;
        } else {
            colision = true;
        }

        return colision;
    }