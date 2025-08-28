let timer;
let totalSeconds = 0;
let isRunning = false;
let isEditing = false;
let hundredth = 0;

const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const hundredthSpan = document.getElementById('hundredth');
const editButton = document.getElementById('edit-button');

// Funzione per aggiornare il display del timer
function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesSpan.textContent = String(minutes).padStart(1, '0');
    secondsSpan.textContent = String(seconds).padStart(2, '0');
    hundredthSpan.textContent = String(hundredth).padStart(2, '0');
}

// Funzione per avviare il timer
function startTimer() {
    if (isRunning || isEditing) return;
    isRunning = true;
    timer = setInterval(() => {
        hundredth--;

        if (hundredth < 0) {
            hundredth = 99;
            totalSeconds--;
        }

        if (totalSeconds <= 0 && hundredth <= 0) {
            clearInterval(timer);
            isRunning = false;
            hundredth = 0;
            totalSeconds = 0;
            updateDisplay();
            return;
        }
        updateDisplay();
    }, 10);
}

// Funzione per mettere in pausa il timer
function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timer);
    isRunning = false;
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
    hundredth = 0;
    updateDisplay();
}


// Funzione per resettare il timer
function resetTimer() {
    pauseTimer();
    totalSeconds = 0;
    hundredth = 0;
    updateDisplay();
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
                if (totalSeconds > 0 || hundredth > 0) {
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
            hundredth = 0;
            updateDisplay();
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
            if (totalSeconds > 0 || hundredth > 0) {
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
updateDisplay();
