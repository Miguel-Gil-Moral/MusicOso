import { estado } from "./estado.js";

export const matriz = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const map = document.getElementById("map");
const mensaje = document.getElementById("mensaje");
const VISTA_COLUMNAS = 19;
const VISTA_FILAS = 11;

function limitar(valor, minimo, maximo) {
    return Math.max(minimo, Math.min(valor, maximo));
}

function actualizarCamara() {
    const cameraX = limitar(
        estado.playerX - Math.floor(VISTA_COLUMNAS / 2),
        0,
        matriz[0].length - VISTA_COLUMNAS,
    );
    const cameraY = limitar(
        estado.playerY - Math.floor(VISTA_FILAS / 2),
        0,
        matriz.length - VISTA_FILAS,
    );

    map.style.setProperty("--camera-x", cameraX);
    map.style.setProperty("--camera-y", cameraY);
}

export function createMap() {
    map.replaceChildren();

    for (let y = 0; y < matriz.length; y++) {
        for (let x = 0; x < matriz[y].length; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (matriz[y][x] === 1) {
                cell.classList.add("wall");
            } else if (matriz[y][x] === 2) {
                cell.classList.add("tower");
            } else if (matriz[y][x] === 3) {
                cell.classList.add("exit");
            } else {
                cell.classList.add("floor");
                cell.classList.add((x + y) % 2 === 0 ? "floor-light" : "floor-dark");
            }

            if (x === estado.playerX && y === estado.playerY) {
                const player = document.createElement("div");
                player.appendChild(mensaje);
                player.classList.add("player");
                cell.appendChild(player);
            }

            map.appendChild(cell);
        }
    }

    actualizarCamara();
}
