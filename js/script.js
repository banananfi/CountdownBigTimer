let timer;
let totalSeconds = 0;
let isRunning = false;
let isEditing = false;
let timeoutId;

const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const timerDisplay = document.getElementById('timer-display');
const editButton = document.getElementById('edit-button');
const controlsContainer = document.querySelector('.controls');

// Funzione per aggiornare il display del timer
function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesSpan.textContent = String(minutes).padStart(1, '0');
    secondsSpan.textContent = String(seconds).padStart(2, '0');
}

// Funzione per avviare il timer
function startTimer() {
    if (isRunning || isEditing) return;
    isRunning = true;
    timer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            isRunning = false;
            return;
        }
        totalSeconds--;
        updateDisplay();
    }, 1000);
}

// Funzione per mettere in pausa il timer
function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timer);
    isRunning = false;
}

// Funzione per nascondere i controlli
function hideControls() {
    if (!isEditing) {
        controlsContainer.classList.add('hidden');
    }
}

// Funzione per mostrare i controlli
function showControls() {
    clearTimeout(timeoutId);
    controlsContainer.classList.remove('hidden');
    timeoutId = setTimeout(hideControls, 3000);
}

// Funzione per attivare la modalità di modifica
function enableEditing() {
    pauseTimer();
    isEditing = true;
    minutesSpan.contentEditable = 'true';
    secondsSpan.contentEditable = 'true';
    minutesSpan.focus();
    showControls();
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
    updateDisplay();
    hideControls();
}

// Event listeners per la visibilità dei controlli
document.addEventListener('mousemove', showControls);
document.addEventListener('keydown', showControls);

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

// Aggiungi la nuova logica per il click su tutto il documento
document.addEventListener('click', () => {
    if (!isEditing) {
        if (isRunning) {
            pauseTimer();
        } else {
            const minutes = parseInt(minutesSpan.textContent) || 0;
            const seconds = parseInt(secondsSpan.textContent) || 0;
            totalSeconds = (minutes * 60) + seconds;
            if (totalSeconds > 0) {
                startTimer();
            }
        }
    }
});

// Aggiungi la nuova logica per il doppio click su tutto il documento
document.addEventListener('dblclick', (event) => {
    // Evita il doppio click quando si fa doppio click sul pulsante "modifica"
    if (event.target !== editButton && !isEditing) {
        event.preventDefault();
        pauseTimer();
        totalSeconds = 0;
        updateDisplay();
    }
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
                const minutes = parseInt(minutesSpan.textContent) || 0;
                const seconds = parseInt(secondsSpan.textContent) || 0;
                totalSeconds = (minutes * 60) + seconds;
                if (totalSeconds > 0) {
                    startTimer();
                }
            }
        }

        const presets = {
            'a': 60,
            's': 120,
            'd': 180,
            'f': 300,
            'q': 600,
            'w': 900,
            'e': 30,
        };

        const key = event.key.toLowerCase();
        if (presets[key]) {
            event.preventDefault();
            pauseTimer();
            totalSeconds = presets[key];
            updateDisplay();
        }

        if (key === 'r') {
            event.preventDefault();
            pauseTimer();
            totalSeconds = 0;
            updateDisplay();
        }
    }
});

// Inizializza il display e i controlli
updateDisplay();
showControls();
