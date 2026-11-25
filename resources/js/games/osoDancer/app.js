import { estado } from "./estado.js";
import { createMap, matriz, enemigosNivel } from "./mapa.js";
import { comprobarTiming } from "./timer.js";

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

    let precision = comprobarTiming();

    if (precision === 0) {
        return;
    }

    mediaPrecision += precision;
    pasos++;

    const indiceEnemigo = enemigosNivel.findIndex(enemigo => enemigo.x === newX && enemigo.y === newY);

    if (indiceEnemigo !== -1) {
        const enemigo = enemigosNivel[indiceEnemigo];
        enemigo.vida -= 1;

        if (enemigo.vida <= 0) {
            enemigosNivel.splice(indiceEnemigo, 1);
        }

        // El jugador ataca desde su casilla, incluso si derrota al enemigo.
        createMap();
        return;
    }

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
