import { noteHitWindowMs, perfectWindowMs, pixelPerfectWindowMs } from './gameConfig.js';

export function isNoteInHitWindow(noteImage) {
    const elapsedTime = performance.now() - Number(noteImage.dataset.createdAt);
    const hitTime = Number(noteImage.dataset.hitTime);

    return elapsedTime >= hitTime - noteHitWindowMs
        && elapsedTime <= hitTime + noteHitWindowMs;
}

export function getTimingFeedback(noteImage) {
    const elapsedTime = performance.now() - Number(noteImage.dataset.createdAt);
    const timingDifference = elapsedTime - Number(noteImage.dataset.hitTime);

    if (timingDifference < -perfectWindowMs) {
        return { text: 'Pronto', type: 'pronto', timingDifference };
    }

    if (Math.abs(timingDifference) <= pixelPerfectWindowMs) {
        return {
            text: 'SUPER PERFECT',
            type: 'super-perfecto',
            isPerfect: true,
            timingDifference
        };
    }

    if (timingDifference <= perfectWindowMs) {
        return { text: 'Perfecto', type: 'perfecto', isPerfect: true, timingDifference };
    }

    return { text: 'Tarde', type: 'tarde', timingDifference };
}

export function getAccuracyPercentage(timingDifference) {
    return Math.max(0, Math.min(100, 100 * (1 - (Math.abs(timingDifference) / noteHitWindowMs))));
}

