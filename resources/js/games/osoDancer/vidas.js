import { estado } from "./estado.js";

const header = document.getElementById("header");
const textoTitulo = document.createElement("h1");
const textovidas = document.createElement("p");

textoTitulo.textContent = "MusicOso";
textovidas.textContent = "Vidas: " + estado.vidas;
header.append(textoTitulo, textovidas);

export function perderVida() {
    estado.vidas--;
    if (estado.vidas <= 0) {
        estado.vidas = 3;
        estado.playerX = 2;
        estado.playerY = 2;
    }
    textovidas.textContent = "Vidas: " + estado.vidas;
}
