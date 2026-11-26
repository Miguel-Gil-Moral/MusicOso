import {
    gameSpeed,
    konamiCode,
    levelStep,
    noteHitWindowMs,
    notesByKey,
    quarterNoteDuration
} from './gameConfig.js';
import { getAccuracyPercentage, getTimingFeedback, isNoteInHitWindow } from './noteTiming.js';
import {
    cancelComboAnimation,
    shakeCombo,
    showHackMessage,
    showPrecisionFeedback,
    showSuperPerfectCombo,
    updateCombo
} from './noteVisuals.js';
import {
    createNoteImage,
    createRandomNoteData,
    getNoteHitTime,
    renderGhostNotes
} from './noteElements.js';
import { getSelectedLevel } from './levelCharts.js';

const activeNotes = new Set();
const ghostImages = [];
const noteMetrics = [];
const activeChart = getSelectedLevel();
const gameMusic = document.getElementById('musica-joc');
const levelMarker = document.getElementById('marcador-nivel');
const gameMessage = document.getElementById('mensaje-juego');
const comboElement = document.getElementById('combo');
const pentagram = document.getElementById('Pentagrama');
let nextNoteTimeout = null;
let level = 50;
let combo = 0;
let konamiProgress = 0;
let autoHitEnabled = false;
let gameStarted = false;
let chartStartedAt = 0;
let chartNoteIndex = 0;
const missTimeouts = new Map();
const autoHitTimeouts = new Map();

window.noteMetrics = noteMetrics;

pentagram.style.setProperty('--quarter-note-duration', `${quarterNoteDuration}ms`);
levelMarker.style.setProperty('--nivel', '50%');

if (activeChart?.songUrl) {
    gameMusic.src = activeChart.songUrl;
    gameMusic.loop = activeChart.loopAudio;
}

function startGameMusic() {
    if (!gameMusic.src) {
        return;
    }

    gameMusic.play().catch(() => {
        document.addEventListener('keydown', () => {
            gameMusic.play();
        }, { once: true });
    });
}

function updateLevel(change) {
    level = Math.max(0, Math.min(100, level + change));
    levelMarker.style.setProperty('--nivel', `${100 - level}%`);
    levelMarker.setAttribute('aria-valuenow', level);

    if (level === 0) {
        resetGame();
    }
}

function resetGame() {
    clearTimeout(nextNoteTimeout);
    gameStarted = false;
    autoHitEnabled = false;
    konamiProgress = 0;
    chartStartedAt = 0;
    chartNoteIndex = 0;
    gameMusic.pause();

    if (gameMusic.readyState > 0) {
        gameMusic.currentTime = 0;
    }

    cancelComboAnimation();
    activeNotes.forEach((noteImage) => noteImage.remove());
    missTimeouts.forEach((timeout) => clearTimeout(timeout));
    missTimeouts.clear();
    autoHitTimeouts.forEach((timeout) => clearTimeout(timeout));
    autoHitTimeouts.clear();
    activeNotes.clear();
    renderGhostNotes(activeNotes, ghostImages, pentagram);
    combo = 0;
    updateCombo(comboElement, combo);
    level = 50;
    levelMarker.style.setProperty('--nivel', '50%');
    levelMarker.setAttribute('aria-valuenow', level);
    gameMessage.textContent = '¡Has perdido! Pulsa cualquier tecla para volver a jugar.';
    gameMessage.classList.add('mensaje-juego-visible');
}

function finishChartIfComplete() {
    if (!activeChart || !gameStarted || chartNoteIndex < activeChart.notes.length || activeNotes.size > 0) {
        return;
    }

    clearTimeout(nextNoteTimeout);
    gameStarted = false;
    autoHitEnabled = false;
    gameMusic.pause();

    if (gameMusic.readyState > 0) {
        gameMusic.currentTime = 0;
    }

    gameMessage.textContent = '¡Nivel completado! Pulsa cualquier tecla para volver a jugar.';
    gameMessage.classList.add('mensaje-juego-visible');
}

function scheduleChartNote() {
    const chartNote = activeChart.notes[chartNoteIndex];

    if (!chartNote) {
        return;
    }

    const noteSpawnTime = chartNote.atMs - getNoteHitTime(pentagram);
    const elapsedTime = performance.now() - chartStartedAt;
    const remainingTime = Math.max(0, noteSpawnTime - elapsedTime);

    nextNoteTimeout = setTimeout(() => {
        chartNoteIndex += 1;
        createNote(chartNote);
    }, remainingTime);
}

function scheduleNextNote(rhythm) {
    clearTimeout(nextNoteTimeout);

    if (activeChart) {
        scheduleChartNote();
        return;
    }

    const refreshTime = (rhythm.beats * quarterNoteDuration) / gameSpeed;
    nextNoteTimeout = setTimeout(createNote, refreshTime);
}

function registerNoteMetric(noteImage, timingFeedback) {
    const timingDifference = timingFeedback.timingDifference ?? 0;
    const metric = {
        note: noteImage.dataset.key,
        timing: timingFeedback.type,
        accuracyPercentage: Number(getAccuracyPercentage(timingDifference).toFixed(2)),
        timingDifferenceMs: Math.round(timingDifference),
        registeredAt: new Date().toISOString()
    };

    noteMetrics.push(metric);
}

function scheduleAutoHit(noteImage) {
    if (!autoHitEnabled || !activeNotes.has(noteImage)) {
        return;
    }

    clearTimeout(autoHitTimeouts.get(noteImage));
    const elapsedTime = performance.now() - Number(noteImage.dataset.createdAt);
    const remainingTime = Math.max(0, Number(noteImage.dataset.hitTime) - elapsedTime);
    const timeout = setTimeout(() => {
        autoHitTimeouts.delete(noteImage);

        if (autoHitEnabled && activeNotes.has(noteImage)) {
            registerSuccessfulHit(noteImage, {
                text: 'SUPER PERFECT',
                type: 'super-perfecto',
                timingDifference: 0,
                isPerfect: true
            });
        }
    }, remainingTime);

    autoHitTimeouts.set(noteImage, timeout);
}

function activateAutoHit() {
    autoHitEnabled = true;
    activeNotes.forEach((noteImage) => scheduleAutoHit(noteImage));
    showHackMessage(gameMessage);
}

function handleKonamiInput(key) {
    if (key !== konamiCode[konamiProgress]) {
        konamiProgress = 0;
        return;
    }

    konamiProgress += 1;

    if (konamiProgress === konamiCode.length) {
        konamiProgress = 0;
        activateAutoHit();
    }
}

function renderCurrentGhostNotes() {
    renderGhostNotes(activeNotes, ghostImages, pentagram);
}

function initializeNoteQueue() {
    if (!activeChart) {
        createNote();
        return;
    }

    chartStartedAt = performance.now();
    chartNoteIndex = 0;
    scheduleChartNote();
}

function createNote(chartNote = null) {
    const { note, rhythm } = chartNote ?? createRandomNoteData();
    const noteImage = createNoteImage(note, rhythm, pentagram);
    const hitTime = Number(noteImage.dataset.hitTime);
    const missTimeout = setTimeout(() => {
        if (!activeNotes.has(noteImage)) {
            return;
        }

        updateLevel(-levelStep);
        combo = 0;
        updateCombo(comboElement, combo);
        activeNotes.delete(noteImage);
        missTimeouts.delete(noteImage);
        noteImage.remove();
        renderCurrentGhostNotes();
        finishChartIfComplete();
    }, hitTime + noteHitWindowMs);

    missTimeouts.set(noteImage, missTimeout);
    activeNotes.add(noteImage);
    pentagram.append(noteImage);
    renderCurrentGhostNotes();
    scheduleAutoHit(noteImage);
    scheduleNextNote(rhythm);
}

function registerSuccessfulHit(noteImage, timingFeedback) {
    clearTimeout(missTimeouts.get(noteImage));
    missTimeouts.delete(noteImage);
    clearTimeout(autoHitTimeouts.get(noteImage));
    autoHitTimeouts.delete(noteImage);
    activeNotes.delete(noteImage);
    registerNoteMetric(noteImage, timingFeedback);
    updateLevel(levelStep);
    combo += 1;
    updateCombo(comboElement, combo);

    if (timingFeedback.isPerfect) {
        shakeCombo(comboElement, combo);
    }

    if (timingFeedback.type === 'super-perfecto') {
        showSuperPerfectCombo(comboElement);
    }

    noteImage.style.animationPlayState = 'paused';
    noteImage.src = timingFeedback.type === 'super-perfecto'
        ? noteImage.dataset.yellowImage
        : timingFeedback.type === 'perfecto'
            ? noteImage.dataset.greenImage
            : noteImage.dataset.redImage;
    showPrecisionFeedback(pentagram, timingFeedback.text, timingFeedback.type, noteImage);
    setTimeout(() => noteImage.remove(), 900);
    renderCurrentGhostNotes();
    finishChartIfComplete();
}

document.addEventListener('keydown', (event) => {
    if (event.repeat) {
        return;
    }

    if (!gameStarted) {
        gameStarted = true;
        gameMessage.textContent = '';
        gameMessage.classList.remove('mensaje-juego-visible');

        if (event.code === 'Space' || event.key.startsWith('Arrow')) {
            event.preventDefault();
        }

        startGameMusic();
        initializeNoteQueue();

        return;
    }

    const konamiKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
    if (konamiKeys.includes(event.key)) {
        event.preventDefault();
        handleKonamiInput(event.key);
    } else {
        konamiProgress = 0;
    }

    const note = notesByKey[event.key.toLowerCase()];
    const oldestNote = activeNotes.values().next().value;
    const matchingNote = note && oldestNote?.dataset.key === note.note
        ? oldestNote
        : null;

    if (matchingNote && isNoteInHitWindow(matchingNote)) {
        const timingFeedback = getTimingFeedback(matchingNote);
        registerSuccessfulHit(matchingNote, timingFeedback);
    } else {
        updateLevel(-levelStep);
        combo = 0;
        updateCombo(comboElement, combo);
    }

    if (note) {
        const control = document.getElementById(note.control);
        control.classList.add('control-actiu');

        setTimeout(() => {
            control.classList.remove('control-actiu');
        }, 180);
    }
});
