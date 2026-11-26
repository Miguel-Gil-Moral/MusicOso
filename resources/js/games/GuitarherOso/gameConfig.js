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

export const notesByKey = {
    a: { note: 'A', control: '1' },
    s: { note: 'B', control: '2' },
    d: { note: 'C', control: '3' },
    f: { note: 'D', control: '4' },
    g: { note: 'E', control: '5' },
    h: { note: 'F', control: '6' },
    j: { note: 'G', control: '7' }
};
export const noteTypes = Object.values(notesByKey);

export const quarterNoteDuration = 500;
export const gameSpeed = 1;
export const noteTravelDuration = 2500;
export const noteHitWindowMs = 750;
export const perfectWindowMs = 150;
export const pixelPerfectWindowMs = 30;
export const ghostNoteCount = 3;
export const levelStep = 5;

export const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'
];

export const rhythmTypes = [
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

