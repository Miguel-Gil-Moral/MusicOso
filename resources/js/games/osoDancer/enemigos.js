import corchea from '../../../assets/corchea.png';
import negra from '../../../assets/negra.png';
import blanca from '../../../assets/blanca.png';
import redonda from '../../../assets/redonda.png';
import { estado } from './estado.js';
import { perderVida } from './vidas.js';

export const enemigos = [
    { nombre: "corchea", velocidad: 1, vida: 1, daño: 1, asset: corchea },
    { nombre: "negra", velocidad: 2, vida: 2, daño: 2, asset: negra },
    { nombre: "blanca", velocidad: 4, vida: 4, daño: 4, asset: blanca },
    { nombre: "redonda", velocidad: 8, vida: 8, daño: 8, asset: redonda }
];

export function crearEnemigo(tipo, x, y) {

    for (const enemigo of enemigos) {
        if (enemigo.nombre === tipo) {
            return {
                nombre: enemigo.nombre,
                velocidad: enemigo.velocidad,
                vida: enemigo.vida,
                daño: enemigo.daño,
                asset: enemigo.asset,
                x: x,
                y: y,
                spawnX: x,
                spawnY: y
            };
        }
    }

    return null;
}

export function actualizarEnemigo(enemigo, mapa, enemigosNivel) {
    patrullar(enemigo, mapa, enemigosNivel);
}

export function patrullar(enemigo, mapa, enemigosNivel) {
    const direcciones = [0, 1, 2, 3];

    // Prueba cada dirección como máximo una vez.
    while (direcciones.length > 0) {
        const indice = Math.floor(Math.random() * direcciones.length);
        const direccion = direcciones[indice];
        direcciones.splice(indice, 1);

        let nuevaX = enemigo.x;
        let nuevaY = enemigo.y;

        if (direccion === 0) nuevaX += 1;
        else if (direccion === 1) nuevaX -= 1;
        else if (direccion === 2) nuevaY += 1;
        else if (direccion === 3) nuevaY -= 1;

        if (puedeMover(enemigo, nuevaX, nuevaY, mapa, enemigosNivel)) {
            // Atacar consume el turno: el enemigo conserva su posición.
            if (nuevaX === estado.playerX && nuevaY === estado.playerY) {
                enemigo.ataque = { x: nuevaX - enemigo.x, y: nuevaY - enemigo.y };
                perderVida(enemigo.daño);
                return;
            }

            enemigo.x = nuevaX;
            enemigo.y = nuevaY;
            return; // Ya se ha movido: termina este turno.
        }
    }
}

function puedeMover(enemigo, nuevaX, nuevaY, mapa, enemigosNivel) {
    // Primero comprueba que la fila y la casilla existen.
    const fila = mapa[nuevaY];
    if (fila === undefined) {
        return false;
    }

    const casilla = fila[nuevaX];
    if (casilla === undefined || casilla === 1) {
        return false;
    }

    // Después comprueba que ningún otro enemigo ocupa la casilla.
    for (const otro of enemigosNivel) {
        if (otro !== enemigo && otro.x === nuevaX && otro.y === nuevaY) {
            return false;
        }
    }

    return true;
}
