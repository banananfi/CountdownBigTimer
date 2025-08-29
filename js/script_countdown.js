let timerId;
let totalSeconds = 0;
let isRunning = false;
let isEditing = false;

const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const hundredthSpan = document.getElementById('hundredth');
const editButton = document.getElementById('edit-button');
const separatorColon = document.querySelector('#timer-display .separator:nth-child(2)'); // the ":" separator
const separatorDot = document.querySelector('#timer-display .separator:nth-child(4)'); // the "." separator

let endTime = 0; // timestamp when countdown ends

// Funzione per aggiornare il display del timer
function updateDisplayFromMilliseconds(msRemaining) {
    if (msRemaining < 0) msRemaining = 0;

    const totalHundredths = Math.floor(msRemaining / 10);
    const minutes = Math.floor(totalHundredths / 6000);
    const seconds = Math.floor((totalHundredths % 6000) / 100);
    const hundredth = totalHundredths % 100;

    minutesSpan.textContent = String(minutes).padStart(1, '0');
    secondsSpan.textContent = String(seconds).padStart(2, '0');
    hundredthSpan.textContent = String(hundredth).padStart(2, '0');

    // Show/hide logic for minutes, colon separator, hundredth, and dot separator
    if (minutes === 0 && seconds === 0 && hundredth === 0) {
        // Clock reset or reached zero: show minutes and colon, hide hundredth and dot
        minutesSpan.style.display = '';
        separatorColon.style.display = '';
        hundredthSpan.style.display = 'none';
        separatorDot.style.display = 'none';
    } else if (minutes > 0) {
        // Minutes not zero: show minutes and colon, hide hundredth and dot
        minutesSpan.style.display = '';
        separatorColon.style.display = '';
        hundredthSpan.style.display = 'none';
        separatorDot.style.display = 'none';
    } else {
        // Minutes zero: hide minutes and colon, show hundredth and dot
        minutesSpan.style.display = 'none';
        separatorColon.style.display = 'none';
        hundredthSpan.style.display = '';
        separatorDot.style.display = '';
    }
}

// Funzione per aggiornare il display in base a totalSeconds e hundredth (usata per editing and presets)
function updateDisplay() {
    // Convert totalSeconds and hundredth to milliseconds
    const msRemaining = (totalSeconds * 1000) + (hundredthSpan.style.display === 'none' ? 0 : 0);
    updateDisplayFromMilliseconds(msRemaining);
}

// Funzione per avviare il timer
function startTimer() {
    if (isRunning || isEditing) return;
    if (totalSeconds <= 0) return;

    isRunning = true;
    endTime = performance.now() + totalSeconds * 1000;

    function tick() {
        if (!isRunning) return;

        const now = performance.now();
        let msRemaining = endTime - now;

        if (msRemaining <= 0) {
            msRemaining = 0;
            isRunning = false;
        }

        updateDisplayFromMilliseconds(msRemaining);

        if (isRunning) {
            timerId = requestAnimationFrame(tick);
        } else {
            // Timer finished, reset totalSeconds and hundredth
            totalSeconds = 0;
            hundredthSpan.textContent = '00';
            minutesSpan.style.display = '';
            separatorColon.style.display = '';
            hundredthSpan.style.display = 'none';
            separatorDot.style.display = 'none';
        }
    }

    timerId = requestAnimationFrame(tick);
}

// Funzione per mettere in pausa il timer
function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    if (timerId) {
        cancelAnimationFrame(timerId);
        timerId = null;
    }
    // Update totalSeconds based on remaining time
    const now = performance.now();
    let msRemaining = endTime - now;
    if (msRemaining < 0) msRemaining = 0;
    totalSeconds = Math.floor(msRemaining / 1000);
    // hundredth is not used separately now, so no update needed
    updateDisplayFromMilliseconds(msRemaining);
}

// Funzione per attivare la modalità di modifica
function enableEditing() {
    pauseTimer();
    isEditing = true;
    minutesSpan.contentEditable = 'true';
    secondsSpan.contentEditable = 'true';
    minutesSpan.focus();
}

// Funzione per disattivare la modalità di modifica
function disableEditing() {
    isEditing = false;
    minutesSpan.contentEditable = 'false';
    secondsSpan.contentEditable = 'false';
    const minutes = parseInt(minutesSpan.textContent) || 0;
    const seconds = parseInt(secondsSpan.textContent) || 0;

    const newSeconds = seconds % 60;
    const addedMinutes = Math.floor(seconds / 60);

    totalSeconds = ((minutes + addedMinutes) * 60) + newSeconds;
    updateDisplayFromMilliseconds(totalSeconds * 1000);
}

// Funzione per resettare il timer
function resetTimer() {
    pauseTimer();
    totalSeconds = 0;
    updateDisplayFromMilliseconds(0);
}

// Event listener per il pulsante "Modifica"
if (editButton) {
    editButton.addEventListener('click', enableEditing);
}

// Event listeners per uscire dalla modalità di modifica
minutesSpan.addEventListener('blur', (event) => {
    if (event.relatedTarget === secondsSpan) {
        return;
    }
    disableEditing();
});

secondsSpan.addEventListener('blur', (event) => {
    if (event.relatedTarget === minutesSpan) {
        return;
    }
    disableEditing();
});

// Gestione dei tasti
document.addEventListener('keydown', (event) => {
    if (isEditing && event.key === 'Enter') {
        event.preventDefault();
        if (document.activeElement === minutesSpan) {
            secondsSpan.focus();
        } else {
            disableEditing();
        }
        return;
    }

    if (!isEditing) {
        if (event.code === 'Space') {
            event.preventDefault();
            if (isRunning) {
                pauseTimer();
            } else {
                if (totalSeconds > 0) {
                    startTimer();
                }
            }
        }

        const presets = {
            'a': 60, 's': 120, 'd': 180, 'f': 300,
            'q': 600, 'w': 900, 'e': 30,
        };

        const key = event.key.toLowerCase();
        if (presets[key]) {
            event.preventDefault();
            pauseTimer();
            totalSeconds = presets[key];
            updateDisplayFromMilliseconds(totalSeconds * 1000);
        }

        if (key === 'r') {
            event.preventDefault();
            resetTimer();
        }
    }
});

// Aggiungi un event listener per il click su tutto lo schermo
document.body.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
        return;
    }

    if (!isEditing) {
        if (isRunning) {
            pauseTimer();
        } else {
            if (totalSeconds > 0) {
                startTimer();
            }
        }
    }
});

// Aggiungi un event listener per il doppio click su tutto lo schermo
document.body.addEventListener('dblclick', (event) => {
    event.preventDefault();
    if (!isEditing) {
        resetTimer();
    }
});

// Inizializza il display
updateDisplayFromMilliseconds(totalSeconds * 1000);
