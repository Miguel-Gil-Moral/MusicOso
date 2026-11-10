import { estado } from "./estado.js";
import { createMap, matriz } from "./mapa.js";
import { reiniciarAnimacion } from "./timer.js";

let pasos = 0;
let mediaPrecision = 0;

document.addEventListener("keydown", (event) => {
    let newX = estado.playerX;
    let newY = estado.playerY;

    switch (event.key) {
        case "ArrowUp":
            newY--;
            break;
        case "ArrowDown":
            newY++;
            break;
        case "ArrowLeft":
            newX--;
            break;
        case "ArrowRight":
            newX++;
            break;
        default:
            return;
    }

    event.preventDefault();

    let precision = reiniciarAnimacion();

    if (precision === 0) {
        return;
    }

    mediaPrecision += precision;
    pasos++;

    const cell = matriz[newY]?.[newX];

    if (cell === undefined || cell === 1) {
        return;
    } else if (cell === 2) {
        estado.playerX = 2;
        estado.playerY = 2;
    } else if (cell === 3) {
        alert("¡Has llegado a la salida!" + "\n Pasos usados: " + pasos + "\n Porcentaje acierto: " + (mediaPrecision / pasos).toFixed(2));
        pasos = 0;
        mediaPrecision = 0;
        estado.playerX = 2;
        estado.playerY = 2;
    } else {
        estado.playerX = newX;
        estado.playerY = newY;
    }

    createMap();
});

createMap();
