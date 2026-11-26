import { ghostNoteCount, noteTravelDuration, noteTypes, rhythmTypes } from './gameConfig.js';

export function createRandomNoteData() {
    const note = noteTypes[Math.floor(Math.random() * noteTypes.length)];
    const rhythm = rhythmTypes[Math.floor(Math.random() * rhythmTypes.length)];

    return { note, rhythm };
}

export function getNoteHitTime(pentagram) {
    const startPosition = pentagram.clientWidth - 70;
    const endPosition = -35;
    const hitPosition = (pentagram.clientWidth * 0.075) - 35;

    return noteTravelDuration * ((startPosition - hitPosition) / (startPosition - endPosition));
}

export function createNoteImage(note, rhythm, pentagram) {
    const noteImage = document.createElement('img');
    const createdAt = performance.now();
    const startPosition = pentagram.clientWidth - 70;
    const endPosition = -35;
    const hitTime = getNoteHitTime(pentagram);

    noteImage.src = rhythm.normalImage;
    noteImage.alt = `Nota ${note.note}`;
    noteImage.className = `figura-musical figura-${note.note}`;
    noteImage.dataset.key = note.note;
    noteImage.dataset.blueImage = rhythm.blueImage;
    noteImage.dataset.redImage = rhythm.redImage;
    noteImage.dataset.greenImage = rhythm.greenImage;
    noteImage.dataset.yellowImage = rhythm.yellowImage;
    noteImage.dataset.createdAt = createdAt;
    noteImage.dataset.hitTime = hitTime;
    noteImage.style.setProperty('--note-travel-duration', `${noteTravelDuration}ms`);
    noteImage.style.setProperty('--note-travel-distance', `${endPosition - startPosition}px`);

    return noteImage;
}

export function renderGhostNotes(activeNotes, ghostImages, pentagram) {
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

