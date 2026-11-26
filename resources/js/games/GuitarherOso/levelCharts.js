import { noteTravelDuration, notesByKey, rhythmTypes } from './gameConfig.js';

// null manté el joc aleatori. Per provar un mapa, canvia-ho per 'primer-mapa'.
export const selectedLevelId = null;

// Cada atMs és el moment, en mil·lisegons des de l'inici, en què cal encertar la nota.
// songUrl és una ruta pública opcional, per exemple '/audio/la-meva-canco.mp3'.
export const levelCharts = {
    'primer-mapa': {
        name: 'Primer mapa',
        songUrl: null,
        loopAudio: false,
        notes: [
            { atMs: 3000, note: 'A', rhythm: 'negra' },
            { atMs: 4000, note: 'D', rhythm: 'corchea' },
            { atMs: 5000, note: 'G', rhythm: 'blanca' },
            { atMs: 6500, note: 'C', rhythm: 'negra' }
        ]
    }
};

export function getSelectedLevel() {
    if (selectedLevelId === null) {
        return null;
    }

    const level = levelCharts[selectedLevelId];

    if (!level) {
        throw new Error(`No existeix cap mapa amb l'identificador "${selectedLevelId}".`);
    }

    if (!Array.isArray(level.notes) || level.notes.length === 0) {
        throw new Error(`El mapa "${level.name}" ha de tenir almenys una nota.`);
    }

    const availableNotes = Object.values(notesByKey);
    let previousTime = noteTravelDuration - 1;

    const notes = level.notes.map((chartNote, index) => {
        const note = availableNotes.find((availableNote) => availableNote.note === chartNote.note);
        const rhythm = rhythmTypes.find((availableRhythm) => availableRhythm.name === chartNote.rhythm);

        if (!Number.isFinite(chartNote.atMs) || chartNote.atMs <= previousTime) {
            throw new Error(`La nota ${index + 1} del mapa "${level.name}" necessita un atMs creixent i superior a ${noteTravelDuration - 1}.`);
        }

        if (!note) {
            throw new Error(`La nota ${index + 1} del mapa "${level.name}" ha d'utilitzar una lletra entre A i G.`);
        }

        if (!rhythm) {
            throw new Error(`El ritme de la nota ${index + 1} del mapa "${level.name}" no és vàlid.`);
        }

        previousTime = chartNote.atMs;

        return { atMs: chartNote.atMs, note, rhythm };
    });

    return { ...level, notes };
}

