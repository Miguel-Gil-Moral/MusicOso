import { perderVida } from "./vidas.js";

const duracion = 1000;
const margen = 100;
let inicio = performance.now();

export function reiniciarAnimacion() {
    const tiempo = performance.now() - inicio;

    let porcentajeAcierto = Math.max(0, 100 - (Math.abs(tiempo - duracion) / margen) * 100);

    document.documentElement.style.setProperty("--duracion", duracion + "ms");
    const mensaje = document.getElementById("mensaje");

    if (porcentajeAcierto >= 95) {
        mensaje.style.color = "#60a5fa";
        mensaje.textContent = "PERFECTO";
    } else if (porcentajeAcierto >= 80) {
        mensaje.style.color = "#4ade80";
        mensaje.textContent = "BIEN";
    } else if (porcentajeAcierto >= 50) {
        mensaje.style.color = "#facc15";
        mensaje.textContent = "OK";
    } else if (porcentajeAcierto < 50 && porcentajeAcierto > 0) {
        mensaje.style.color = "#fb923c";
        mensaje.textContent = "AJUSTADO";
    } else {
        mensaje.style.color = "#f87171";
        mensaje.textContent = "FALLO";
        perderVida();
    }

    console.log(mensaje.textContent + " | " + porcentajeAcierto.toFixed(2) + "%" + " | " + tiempo.toFixed(2) + "ms");

    const izquierda = document.querySelector(".izquierda");
    const derecha = document.querySelector(".derecha");
    izquierda.style.animation = "none";
    derecha.style.animation = "none";
    izquierda.offsetWidth;
    izquierda.style.animation = "";
    derecha.style.animation = "";

    inicio = performance.now();
    return porcentajeAcierto;
}
