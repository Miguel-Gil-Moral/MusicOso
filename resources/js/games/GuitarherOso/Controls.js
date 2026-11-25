import blancaBlueImage from '../../../src/blanca(Azul).png';
import blancaYellowImage from '../../../src/blanca(Amarillo).png';
import blancaGreenImage from '../../../src/blanca(Verde).png';
import blancaRedImage from '../../../src/blanca(Roja).png';
import blancaNormalImage from '../../../src/blanca(Negra).png';
import corcheaBlueImage from '../../../src/corchea(Azul).png';
import corcheaYellowImage from '../../../src/corchea(Amarillo).png';
import corcheaGreenImage from '../../../src/corchea(Verde).png';
import corcheaRedImage from '../../../src/corchea(Roja).png';
import corcheaNormalImage from '../../../src/corchea(Negra).png';
import negraBlueImage from '../../../src/negra(Azul).png';
import negraYellowImage from '../../../src/negra(Amarillo).png';
import negraGreenImage from '../../../src/negra(Verde).png';
import negraRedImage from '../../../src/negra(Roja).png';
import negraNormalImage from '../../../src/negra(Negra).png';
import redondaBlueImage from '../../../src/redonda(Azul).png';
import redondaYellowImage from '../../../src/redonda(Amarillo).png';
import redondaGreenImage from '../../../src/redonda(Verde).png';
import redondaRedImage from '../../../src/redonda(Roja).png';
import redondaNormalImage from '../../../src/redonda(Negra).png';

const notesByKey = {
    a: { note: 'A', control: '1' },
    s: { note: 'B', control: '2' },
    d: { note: 'C', control: '3' },
    f: { note: 'D', control: '4' },
    g: { note: 'E', control: '5' },
    h: { note: 'F', control: '6' },
    j: { note: 'G', control: '7' }
};

const quarterNoteDuration = 500;
const gameSpeed = 1;
const noteTravelDuration = 2500;
const noteHitWindowMs = 750;
const perfectWindowMs = 150;
const pixelPerfectWindowMs = 30;
const ghostNoteCount = 3;
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
const rhythmTypes = [
    {
        name: 'redonda',
        normalImage: redondaNormalImage,
        redImage: redondaRedImage,
        greenImage: redondaGreenImage,
        yellowImage: redondaYellowImage,
        blueImage: redondaBlueImage,
        beats: 4
    },
    {
        name: 'blanca',
        normalImage: blancaNormalImage,
        redImage: blancaRedImage,
        greenImage: blancaGreenImage,
        yellowImage: blancaYellowImage,
        blueImage: blancaBlueImage,
        beats: 2
    },
    {
        name: 'negra',
        normalImage: negraNormalImage,
        redImage: negraRedImage,
        greenImage: negraGreenImage,
        yellowImage: negraYellowImage,
        blueImage: negraBlueImage,
        beats: 1
    },
    {
        name: 'corchea',
        normalImage: corcheaNormalImage,
        redImage: corcheaRedImage,
        greenImage: corcheaGreenImage,
        yellowImage: corcheaYellowImage,
        blueImage: corcheaBlueImage,
        beats: 0.5
    }
];
const activeNotes = new Set();
const ghostImages = [];
const noteMetrics = [];
const noteTypes = Object.values(notesByKey);
const gameMusic = document.getElementById('musica-joc');
const levelMarker = document.getElementById('marcador-nivel');
const gameMessage = document.getElementById('mensaje-juego');
const comboElement = document.getElementById('combo');
const pentagram = document.getElementById('Pentagrama');
const levelStep = 5;
let nextNoteTimeout = null;
let level = 50;
let combo = 0;
let konamiProgress = 0;
let autoHitEnabled = false;
let gameStarted = false;
let comboShakeAnimation = null;
let superPerfectComboTimeout = null;
const missTimeouts = new Map();
const autoHitTimeouts = new Map();

window.noteMetrics = noteMetrics;

pentagram.style.setProperty('--quarter-note-duration', `${quarterNoteDuration}ms`);

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
    gameMusic.pause();
    if (gameMusic.readyState > 0) {
        gameMusic.currentTime = 0;
    }

    comboShakeAnimation?.cancel();
    comboShakeAnimation = null;
    activeNotes.forEach((noteImage) => noteImage.remove());
    missTimeouts.forEach((timeout) => clearTimeout(timeout));
    missTimeouts.clear();
    autoHitTimeouts.forEach((timeout) => clearTimeout(timeout));
    autoHitTimeouts.clear();
    activeNotes.clear();
    combo = 0;
    updateCombo();
    level = 50;
    levelMarker.style.setProperty('--nivel', '50%');
    levelMarker.setAttribute('aria-valuenow', level);
    gameMessage.textContent = '¡Has perdido! Pulsa cualquier tecla para volver a jugar.';
    gameMessage.classList.add('mensaje-juego-visible');
}

function scheduleNextNote(rhythm) {
    clearTimeout(nextNoteTimeout);
    const refreshTime = (rhythm.beats * quarterNoteDuration) / gameSpeed;
    nextNoteTimeout = setTimeout(createNote, refreshTime);
}

function isNoteInHitWindow(noteImage) {
    const elapsedTime = performance.now() - Number(noteImage.dataset.createdAt);
    const hitTime = Number(noteImage.dataset.hitTime);

    return elapsedTime >= hitTime - noteHitWindowMs
        && elapsedTime <= hitTime + noteHitWindowMs;
}

levelMarker.style.setProperty('--nivel', '50%');

function updateCombo() {
    comboElement.textContent = `Combo: ${combo}`;
    comboElement.classList.remove('combo-super-perfecto');
    clearTimeout(superPerfectComboTimeout);
    superPerfectComboTimeout = null;
}

function shakeCombo() {
    const shakeIntensity = Math.min(combo, 20);
    const shakeDistance = 4 + (shakeIntensity * 0.1);
    const shakeRotation = 4 + (shakeIntensity * 0.1);

    comboShakeAnimation?.cancel();
    const animation = comboElement.animate([
        {
            translate: '0px 0px',
            rotate: '0deg',
            scale: '1',
            offset: 0
        },
        {
            translate: `${-shakeDistance}px ${shakeDistance}px`,
            rotate: `${-shakeRotation}deg`,
            scale: '1.15',
            offset: 0.2
        },
        {
            translate: `${shakeDistance}px ${-shakeDistance}px`,
            rotate: `${shakeRotation}deg`,
            scale: '1.25',
            offset: 0.4
        },
        {
            translate: `${-shakeDistance}px 0px`,
            rotate: `${-shakeRotation * 0.75}deg`,
            scale: '1.1',
            offset: 0.6
        },
        {
            translate: `${shakeDistance}px ${shakeDistance}px`,
            rotate: `${shakeRotation * 0.5}deg`,
            scale: '1.15',
            offset: 0.8
        },
        {
            translate: '0px 0px',
            rotate: '0deg',
            scale: '1',
            offset: 1
        }
    ], { duration: 500, easing: 'ease-in-out' });
    comboShakeAnimation = animation;
    animation.onfinish = () => {
        if (comboShakeAnimation === animation) {
            comboShakeAnimation = null;
        }
    };
}

function showPrecisionFeedback(text, type, noteImage) {
    const feedback = document.createElement('span');
    const noteBounds = noteImage.getBoundingClientRect();
    const pentagramBounds = pentagram.getBoundingClientRect();

    feedback.textContent = text;
    feedback.className = `feedback-precision feedback-${type}`;
    feedback.style.left = `${noteBounds.left - pentagramBounds.left + (noteBounds.width / 2)}px`;
    feedback.style.top = `${noteBounds.top - pentagramBounds.top - 8}px`;
    pentagram.append(feedback);

    setTimeout(() => feedback.remove(), 900);
}

function getTimingFeedback(noteImage) {
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

function getAccuracyPercentage(timingDifference) {
    return Math.max(0, Math.min(100, 100 * (1 - (Math.abs(timingDifference) / noteHitWindowMs))));
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

function showHackMessage() {
    gameMessage.textContent = '¡Hack activado! Puntuación perfecta.';
    gameMessage.classList.add('mensaje-juego-visible');

    setTimeout(() => gameMessage.classList.remove('mensaje-juego-visible'), 2500);
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
    showHackMessage();
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

function createNoteData() {
    const note = noteTypes[Math.floor(Math.random() * noteTypes.length)];
    const rhythm = rhythmTypes[Math.floor(Math.random() * rhythmTypes.length)];

    return { note, rhythm };
}

function renderGhostNotes() {
    const visibleNotes = [...activeNotes].slice(0, ghostNoteCount);
    const rowCounts = new Map();

    visibleNotes.forEach((noteImage, index) => {
        let ghostImage = ghostImages[index];

        if (!ghostImage) {
            ghostImage = document.createElement('img');
            ghostImage.alt = '';
            ghostImages[index] = ghostImage;
            pentagram.append(ghostImage);
        }

        const row = noteImage.dataset.key;
        const rowIndex = rowCounts.get(row) || 0;
        const ghostOpacity = `${-0.12 + ((ghostNoteCount - index) * 0.32)}`;
        const ghostRowOffset = `${rowIndex * -42}px`;

        rowCounts.set(row, rowIndex + 1);
        const ghostClassName = `figura-musical nota-fantasma figura-${row}`;

        if (ghostImage.className !== ghostClassName) {
            ghostImage.className = ghostClassName;
        }

        if (ghostImage.getAttribute('src') !== noteImage.dataset.blueImage) {
            ghostImage.src = noteImage.dataset.blueImage;
        }

        if (ghostImage.style.getPropertyValue('--ghost-opacity') !== ghostOpacity) {
            ghostImage.style.setProperty('--ghost-opacity', ghostOpacity);
        }

        if (ghostImage.style.getPropertyValue('--ghost-row-offset') !== ghostRowOffset) {
            ghostImage.style.setProperty('--ghost-row-offset', ghostRowOffset);
        }

        ghostImage.hidden = false;
    });

    ghostImages.slice(visibleNotes.length).forEach((ghostImage) => {
        ghostImage.hidden = true;
    });
}

function initializeNoteQueue() {
    createNote();
}

function createNote() {
    const { note, rhythm } = createNoteData();
    const noteImage = document.createElement('img');

    noteImage.src = rhythm.normalImage;
    noteImage.alt = `Nota ${note.note}`;
    noteImage.className = `figura-musical figura-${note.note}`;
    noteImage.dataset.key = note.note;
    noteImage.dataset.blueImage = rhythm.blueImage;
    noteImage.dataset.redImage = rhythm.redImage;
    noteImage.dataset.greenImage = rhythm.greenImage;
    noteImage.dataset.yellowImage = rhythm.yellowImage;
    const createdAt = performance.now();
    const startPosition = pentagram.clientWidth - 70;
    const endPosition = -35;
    const hitPosition = (pentagram.clientWidth * 0.075) - 35;
    const hitTime = noteTravelDuration * ((startPosition - hitPosition) / (startPosition - endPosition));
    noteImage.dataset.createdAt = createdAt;
    noteImage.dataset.hitTime = hitTime;
    noteImage.style.setProperty('--note-travel-duration', `${noteTravelDuration}ms`);
    noteImage.style.setProperty('--note-travel-distance', `${endPosition - startPosition}px`);
    const missTimeout = setTimeout(() => {
        if (!activeNotes.has(noteImage)) {
            return;
        }

        updateLevel(-levelStep);
        combo = 0;
        updateCombo();
        activeNotes.delete(noteImage);
        missTimeouts.delete(noteImage);
        noteImage.remove();
        renderGhostNotes();
    }, hitTime + noteHitWindowMs);
    missTimeouts.set(noteImage, missTimeout);
    activeNotes.add(noteImage);
    pentagram.append(noteImage);
    renderGhostNotes();
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
    updateCombo();

    if (timingFeedback.isPerfect) {
        shakeCombo();
    }
    if (timingFeedback.type === 'super-perfecto') {
        comboElement.classList.add('combo-super-perfecto');
        superPerfectComboTimeout = setTimeout(() => {
            comboElement.classList.remove('combo-super-perfecto');
            superPerfectComboTimeout = null;
        }, 900);
    }

    noteImage.style.animationPlayState = 'paused';
    noteImage.src = timingFeedback.type === 'super-perfecto'
        ? noteImage.dataset.yellowImage
        : timingFeedback.type === 'perfecto'
            ? noteImage.dataset.greenImage
            : noteImage.dataset.redImage;
    showPrecisionFeedback(timingFeedback.text, timingFeedback.type, noteImage);
    setTimeout(() => noteImage.remove(), 900);
    renderGhostNotes();
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
        updateCombo();
    }

    if (note) {
        const control = document.getElementById(note.control);
        control.classList.add('control-actiu');

        setTimeout(() => {
            control.classList.remove('control-actiu');
        }, 180);
    }
});