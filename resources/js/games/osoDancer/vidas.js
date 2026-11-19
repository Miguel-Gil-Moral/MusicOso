import { estado } from "./estado.js";
import cartelImg from "../../../assets/osoDancer/cartel.svg";

const header = document.getElementById("header");
let cartelContainer = document.getElementById("cartel-container");

if (!cartelContainer && header) {
    cartelContainer = document.createElement("div");
    cartelContainer.id = "cartel-container";

    const cartel = document.createElement("img");
    cartel.id = "cartel-img";
    cartel.src = cartelImg;
    cartel.alt = "Cartel MusicOso";

    const cartelTexto = document.createElement("div");
    cartelTexto.id = "cartel-texto";

    const textoTitulo = document.createElement("h1");
    const textoSubtitulo = document.createElement("h2");

    textoTitulo.id = "titulo";
    textoTitulo.textContent = "MusicOso";
    textoSubtitulo.id = "subtitulo";
    textoSubtitulo.textContent = "osoDancer";

    cartelTexto.append(textoTitulo, textoSubtitulo);
    cartelContainer.append(cartel, cartelTexto);
    header.prepend(cartelContainer);
}

let textovidas = document.getElementById("vidas-texto");
if (!textovidas && header) {
    textovidas = document.createElement("p");
    textovidas.id = "vidas-texto";
    textovidas.textContent = "Vidas: " + estado.vidas;
    header.append(textovidas);
}

function actualizarCorazones() {
    const corazones = document.querySelectorAll("#vidas .vida");
    corazones.forEach((corazon, index) => {
        if (index < estado.vidas) {
            corazon.style.opacity = "1";
        } else {
            corazon.style.opacity = "0.2";
        }
    });
}

export function perderVida() {
    estado.vidas--;
    if (estado.vidas <= 0) {
        estado.vidas = 3;
        estado.playerX = 2;
        estado.playerY = 2;
    }
    if (textovidas) {
        textovidas.textContent = "Vidas: " + estado.vidas;
    }
    actualizarCorazones();
}
