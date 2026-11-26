let comboShakeAnimation = null;
let superPerfectComboTimeout = null;

export function updateCombo(comboElement, combo) {
    comboElement.textContent = `Combo: ${combo}`;
    comboElement.classList.remove('combo-super-perfecto');
    clearTimeout(superPerfectComboTimeout);
    superPerfectComboTimeout = null;
}

export function cancelComboAnimation() {
    comboShakeAnimation?.cancel();
    comboShakeAnimation = null;
}

export function shakeCombo(comboElement, combo) {
    const shakeIntensity = Math.min(combo, 20);
    const shakeDistance = 4 + (shakeIntensity * 0.1);
    const shakeRotation = 4 + (shakeIntensity * 0.1);

    cancelComboAnimation();
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

export function showPrecisionFeedback(pentagram, text, type, noteImage) {
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

export function showHackMessage(gameMessage) {
    gameMessage.textContent = '¡Hack activado! Puntuación perfecta.';
    gameMessage.classList.add('mensaje-juego-visible');

    setTimeout(() => gameMessage.classList.remove('mensaje-juego-visible'), 2500);
}

export function showSuperPerfectCombo(comboElement) {
    comboElement.classList.add('combo-super-perfecto');
    superPerfectComboTimeout = setTimeout(() => {
        comboElement.classList.remove('combo-super-perfecto');
        superPerfectComboTimeout = null;
    }, 900);
}

