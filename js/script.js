let timer;
let totalSeconds = 0;
let isRunning = false;

const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const timerDisplay = document.getElementById('timer-display');

function updateDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesSpan.textContent = String(minutes).padStart(1, '0');
    secondsSpan.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
    if (isRunning) return;
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

function pauseTimer() {
    if (!isRunning) return;
    clearInterval(timer);
    isRunning = false;
}

// Event listener per il singolo click sul documento per avviare/mettere in pausa
/*document.addEventListener('click', () => {
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
});*/

// Event listener per la barra spaziatrice
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Evita lo scorrimento della pagina
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
	
    // Tasto 'A' per 1 minuto
    if (event.key === 'a' || event.key === 'A') {
        event.preventDefault();
		pauseTimer();
        totalSeconds = 0;
        updateDisplay();
        minutesSpan.textContent = '1';
        secondsSpan.textContent = '00';
    }
	
	// Tasto 'S' per 2 minuti
    if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
		pauseTimer();
        totalSeconds = 0;
        updateDisplay();
        minutesSpan.textContent = '2';
        secondsSpan.textContent = '00';
    }
	
	// Tasto 'D' per 3 minuti
    if (event.key === 'd' || event.key === 'D') {
        event.preventDefault();
		pauseTimer();
        totalSeconds = 0;
        updateDisplay();
        minutesSpan.textContent = '3';
        secondsSpan.textContent = '00';
    }
	
	// Tasto 'F' per 5 minuti
    if (event.key === 'f' || event.key === 'F') {
        event.preventDefault();
		pauseTimer();
        totalSeconds = 0;
        updateDisplay();
        minutesSpan.textContent = '5';
        secondsSpan.textContent = '00';
    }
	
	// Tasto 'Q' per 10 minuti
    if (event.key === 'q' || event.key === 'Q') {
        pauseTimer();
        totalSeconds = 0;
        updateDisplay();
        minutesSpan.textContent = '10';
        secondsSpan.textContent = '00';
    }
	
	// Tasto 'W' per 15 minuti
    if (event.key === 'w' || event.key === 'W') {
        pauseTimer();
        totalSeconds = 0;
        updateDisplay();
        minutesSpan.textContent = '15';
        secondsSpan.textContent = '00';
    }
	
	// Tasto 'E' per 30 secondi
    if (event.key === 'e' || event.key === 'E') {
        pauseTimer();
        totalSeconds = 0;
        updateDisplay();
        minutesSpan.textContent = '0';
        secondsSpan.textContent = '30';
    }
	
	// Tasto 'Enter' per reset
    if (event.key === 'Enter' || event.key === 'Enter') {
		event.preventDefault();
        pauseTimer();
        totalSeconds = 0;
        updateDisplay();
        minutesSpan.textContent = '0';
        secondsSpan.textContent = '00';
    }
});

// Double-click per abilitare la modifica
minutesSpan.addEventListener('dblclick', (event) => {
    event.stopPropagation(); // Blocca l'evento prima che raggiunga il documento
    pauseTimer();
    minutesSpan.contentEditable = 'true';
    minutesSpan.focus();
});

secondsSpan.addEventListener('dblclick', (event) => {
    event.stopPropagation(); // Blocca l'evento prima che raggiunga il documento
    pauseTimer();
    secondsSpan.contentEditable = 'true';
    secondsSpan.focus();
});

// Ritorna contenteditable a 'false' quando si perde il focus
minutesSpan.addEventListener('blur', () => {
    minutesSpan.contentEditable = 'false';
});

secondsSpan.addEventListener('blur', () => {
    secondsSpan.contentEditable = 'false';
});

updateDisplay();