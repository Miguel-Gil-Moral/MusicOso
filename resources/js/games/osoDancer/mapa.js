import { estado } from "./estado.js";
import { crearEnemigo } from "./enemigos.js";
import corazonImg from '../../../assets/osoDancer/corazonEntero.png';

export const matriz = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export let enemigosNivel = [
    crearEnemigo("blanca", 5, 3),
    crearEnemigo("negra", 8, 7)
];

const map = document.getElementById("map");
const mensaje = document.getElementById("mensaje");

export function createMap() {
    map.replaceChildren();

    for (let y = 0; y < matriz.length; y++) {
        for (let x = 0; x < matriz[y].length; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            if (matriz[y][x] === 1) {
                cell.classList.add("wall");
                if ((x + y) % 2 === 1) {
                    cell.classList.add("wall-dark");
                }
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
                for (const enemigo of enemigosNivel) {
                    if (enemigo.x === x && enemigo.y === y) {
                        const imagen = document.createElement("img");
                        imagen.src = enemigo.asset;
                        imagen.alt = enemigo.nombre;
                        imagen.classList.add("enemy");
                        cell.appendChild(imagen);
                        const corazones = document.createElement('span');
                        corazones.classList.add('enemy-health');
                        for (let vida = 0; vida < enemigo.vida; vida++) {
                            const corazon = document.createElement('img');
                            corazon.src = corazonImg;
                            corazon.alt = '';
                            corazones.appendChild(corazon);
                        }
                        corazones.setAttribute('aria-label', `${enemigo.vida} puntos de vida`);
                        cell.appendChild(corazones);
                    }
                }
            map.appendChild(cell);
        }
    }
}
