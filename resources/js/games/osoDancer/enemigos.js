import corchea from '../../../assets/corchea.png';
import negra from '../../../assets/negra.png';
import blanca from '../../../assets/blanca.png';
import redonda from '../../../assets/redonda.png';

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

export function actualizarEnemigo(enemigo, jugadorX, jugadorY, mapa, enemigosNivel) {
    const distancia =
        Math.abs(enemigo.x - jugadorX) +
        Math.abs(enemigo.y - jugadorY);

    if (distancia <= 5) {
        moverEnemigo(enemigo, jugadorX, jugadorY, mapa, enemigosNivel);
    } else {
        patrullar(enemigo, mapa, enemigosNivel);
    }
}

export function moverEnemigo(enemigo, x, y, mapa, enemigosNivel) {

    let distanciaX = Math.abs(enemigo.x - x);
    let distanciaY = Math.abs(enemigo.y - y);

    let nuevaX = enemigo.x;
    let nuevaY = enemigo.y;

    if (distanciaX > distanciaY) {
        if (enemigo.x < x) {
            nuevaX += 1;
        } else if (enemigo.x > x) {
            nuevaX -= 1;
        }
    } else {
        if (enemigo.y < y) {
            nuevaY += 1;
        } else if (enemigo.y > y) {
            nuevaY -= 1;
        }
    }

    if (puedeMover(enemigo, nuevaX, nuevaY, mapa, enemigosNivel)) {
        enemigo.x = nuevaX;
        enemigo.y = nuevaY;
    }
}

function puedeMover(enemigo, x, y, mapa, enemigosNivel) {

    if (mapa[y]?.[x] === undefined) return false;
    if (mapa[y][x] === 1) return false;

    for (const otro of enemigosNivel) {
        if (otro !== enemigo && otro.x === x && otro.y === y) {
            return false;
        }
    }

    return true;
}

export function patrullar(enemigo, mapa, enemigosNivel) {
    const random = Math.floor(Math.random() * 4);

    let nuevaX = enemigo.x;
    let nuevaY = enemigo.y;

    if (random == 0) nuevaX += 1;
    else if (random == 1) nuevaX -= 1;
    else if (random == 2) nuevaY += 1;
    else if (random == 3) nuevaY -= 1;

    if (puedeMover(enemigo, nuevaX, nuevaY, mapa, enemigosNivel)) {
        enemigo.x = nuevaX;
        enemigo.y = nuevaY;
    }
}
