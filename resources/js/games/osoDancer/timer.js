import { perderVida } from "./vidas.js";
import { actualizarEnemigo } from "./enemigos.js";
import { createMap, enemigosNivel, matriz } from "./mapa.js";
import barraImg from "../../../assets/osoDancer/barra.svg";

const duracionTick = 500;
const duracionJugador = duracionTick * 2;
const margen = 100;

let tick = 0;
let inicio = performance.now();

const mensaje = document.getElementById("mensaje");
const barraIzquierda = document.querySelector(".izquierda");
const barraDerecha = document.querySelector(".derecha");

document.documentElement.style.setProperty("--duracion", `${duracionJugador}ms`);


// RELOJ GLOBAL
function gameTick() {
    tick++;

    for (const enemigo of enemigosNivel) {
        if (tick % enemigo.velocidad === 0) {
            actualizarEnemigo(
                enemigo,
                matriz,
                enemigosNivel
            );
        }
    }

    createMap();

    if (tick % 2 === 0) {
        reiniciarBarra();
    }
}
setInterval(gameTick, duracionTick);


// ANIMACIÓN DE LA BARRA
function reiniciarBarra() {
    barraIzquierda.style.animation = "none";
    barraDerecha.style.animation = "none";

    void barraIzquierda.offsetWidth;

    barraIzquierda.style.animation = "";
    barraDerecha.style.animation = "";
}

reiniciarBarra();


// COMPROBAR PRECISIÓN DEL JUGADOR
export function comprobarTiming() {
    const tiempo = performance.now() - inicio;
    const turno = Math.max(1, Math.round(tiempo / duracionJugador));

    const precision = Math.max(0, 100 - (Math.abs(tiempo - turno * duracionJugador) / margen) * 100
    );

    if (precision >= 95) {
        mensaje.style.color = "#60a5fa";
        mensaje.textContent = "PERFECTO";
    } else if (precision >= 80) {
        mensaje.style.color = "#4ade80";
        mensaje.textContent = "BIEN";
    } else if (precision >= 50) {
        mensaje.style.color = "#facc15";
        mensaje.textContent = "OK";
    } else if (precision > 0) {
        mensaje.style.color = "#fb923c";
        mensaje.textContent = "AJUSTADO";
    } else {
        mensaje.style.color = "#f87171";
        mensaje.textContent = "FALLO";
        perderVida();
    }

    console.log(
        mensaje.textContent +
        " | Precisión: " +
        precision.toFixed(2) + "%"
    );

    return precision;
}
