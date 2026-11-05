const notesByKey = {
    a: { note: 'A', control: '1' },
    s: { note: 'B', control: '2' },
    d: { note: 'C', control: '3' },
    f: { note: 'D', control: '4' },
    g: { note: 'E', control: '5' },
    h: { note: 'F', control: '6' },
    j: { note: 'G', control: '7' }
};

const activeNotes = new Set();
const noteTypes = Object.values(notesByKey);
const gameMusic = document.getElementById('musica-joc');
const scoreElement = document.getElementById('contador-notas');
let score = 0;

function startGameMusic() {
    gameMusic.play().catch(() => {
        document.addEventListener('keydown', () => {
            gameMusic.play();
        }, { once: true });
    });
}

startGameMusic();

function createNote() {
    const note = noteTypes[Math.floor(Math.random() * noteTypes.length)];
    const pentagram = document.getElementById('Pentagrama');
    const noteImage = document.createElement('img');
    const rhythmImages = [
        'src/redonda.png',
        'src/blanca.png',
        'src/negra.png',
        'src/corchea.png'
    ];

    noteImage.src = rhythmImages[Math.floor(Math.random() * rhythmImages.length)];
    noteImage.alt = `Nota ${note.note}`;
    noteImage.className = `figura-musical figura-${note.note}`;
    noteImage.dataset.key = note.note;
    noteImage.addEventListener('animationend', () => {
        activeNotes.delete(noteImage);
        noteImage.remove();
    });
    activeNotes.add(noteImage);
    pentagram.append(noteImage);
}

createNote();
setInterval(createNote, 1200);

document.addEventListener('keydown', (event) => {
    const note = notesByKey[event.key.toLowerCase()];

    if (!note || event.repeat) {
        return;
    }

    const control = document.getElementById(note.control);
    control.classList.add('control-actiu');

    const matchingNote = [...activeNotes].find((noteImage) => noteImage.dataset.key === note.note);
    if (matchingNote) {
        matchingNote.remove();
        activeNotes.delete(matchingNote);
        score += 1;
        scoreElement.textContent = score;
    }

    setTimeout(() => {
        control.classList.remove('control-actiu');
    }, 180);
});