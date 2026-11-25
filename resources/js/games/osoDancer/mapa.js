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
const actoresEnemigos = new Map();
let jugador;

export function createMap() {
    if (!jugador) {
        dibujarTerreno();
        jugador = crearActor();
        jugador.imagen.classList.add('player');
        jugador.imagen.appendChild(mensaje);
    }

    posicionarActor(jugador, estado.playerX, estado.playerY);
    animarAtaque(jugador, estado);

    for (const [enemigo, actor] of actoresEnemigos) {
        if (!enemigosNivel.includes(enemigo)) {
            actor.elemento.remove();
            actoresEnemigos.delete(enemigo);
        }
    }

    for (const enemigo of enemigosNivel) {
        let actor = actoresEnemigos.get(enemigo);
        if (!actor) {
            actor = crearActor();
            const imagen = document.createElement('img');
            imagen.src = enemigo.asset;
            imagen.alt = enemigo.nombre;
            imagen.classList.add('enemy');
            actor.imagen.appendChild(imagen);
            actor.corazones = document.createElement('span');
            actor.corazones.classList.add('enemy-health');
            actor.elemento.appendChild(actor.corazones);
            actoresEnemigos.set(enemigo, actor);
        }

        posicionarActor(actor, enemigo.x, enemigo.y);
        animarAtaque(actor, enemigo);

        if (actor.vida !== enemigo.vida) {
            actor.corazones.replaceChildren();
            for (let vida = 0; vida < enemigo.vida; vida++) {
                const corazon = document.createElement('img');
                corazon.src = corazonImg;
                corazon.alt = '';
                actor.corazones.appendChild(corazon);
            }
            actor.corazones.setAttribute('aria-label', `${enemigo.vida} puntos de vida`);
            actor.vida = enemigo.vida;
        }
    }
}

function crearActor() {
    const elemento = document.createElement('div');
    elemento.classList.add('map-actor');
    elemento.style.width = `${100 / matriz[0].length}%`;
    elemento.style.height = `${100 / matriz.length}%`;
    const imagen = document.createElement('div');
    imagen.classList.add('actor-sprite');
    elemento.appendChild(imagen);
    map.appendChild(elemento);
    return { elemento, imagen };
}

function posicionarActor(actor, x, y) {
    if (actor.x === x && actor.y === y) return;

    // La aparición y los reinicios son inmediatos; los pasos se deslizan.
    const esPaso = Math.abs(actor.x - x) + Math.abs(actor.y - y) === 1;
    const posicionAnterior = getComputedStyle(actor.elemento);
    const desde = { left: posicionAnterior.left, top: posicionAnterior.top };
    actor.movimiento?.cancel();
    actor.elemento.style.left = `${x * 100 / matriz[0].length}%`;
    actor.elemento.style.top = `${y * 100 / matriz.length}%`;

    if (esPaso) {
        const posicionNueva = getComputedStyle(actor.elemento);
        const hasta = { left: posicionNueva.left, top: posicionNueva.top };
        const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        actor.movimiento = actor.elemento.animate([desde, hasta], {
            duration: reducirMovimiento ? 80 : 240,
            easing: 'ease-out',
        });
    }
    actor.x = x;
    actor.y = y;
}

function animarAtaque(actor, personaje) {
    if (!personaje.ataque) return;

    const { x, y } = personaje.ataque;
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    actor.animacion?.cancel();
    actor.animacion = actor.imagen.animate([
        { transform: 'translate(0, 0)' },
        { transform: `translate(${x * (reducirMovimiento ? 10 : 30)}%, ${y * (reducirMovimiento ? 10 : 30)}%)` },
        { transform: 'translate(0, 0)' },
    ], { duration: reducirMovimiento ? 80 : 180, easing: 'ease-out' });
    delete personaje.ataque;
}

function dibujarTerreno() {

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

            map.appendChild(cell);
        }
    }
}
