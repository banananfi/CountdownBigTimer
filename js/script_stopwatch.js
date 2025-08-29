let timer;
let totalMilliseconds = 0;
let isRunning = false;
let startTime;
let elapsedPauseTime = 0;
let lapTimes = [];

const minutesSpan = document.getElementById('minutes');
const secondsSpan = document.getElementById('seconds');
const hundredthSpan = document.getElementById('hundredth');
const lapTimesTable = document.getElementById('lap-times-table');
const lapTimesButton = document.getElementById('lap-times-button');

// Assuming the separators are siblings of the spans inside the timer display container
const timerDisplay = document.getElementById('timer-display');
const separatorColon = timerDisplay.querySelector('.separator:nth-child(2)'); // ":" separator
const separatorDot = timerDisplay.querySelector('.separator:nth-child(4)');   // "." separator

// Function to update the timer display
function updateDisplay() {
    const elapsedMilliseconds = isRunning ? (Date.now() - startTime + elapsedPauseTime) : elapsedPauseTime;
    totalMilliseconds = elapsedMilliseconds;
    const totalSeconds = Math.floor(elapsedMilliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const hundredths = Math.floor((elapsedMilliseconds % 1000) / 10);

    minutesSpan.textContent = String(minutes).padStart(2, '0');
    secondsSpan.textContent = String(seconds).padStart(2, '0');
    hundredthSpan.textContent = String(hundredths).padStart(2, '0');

    // Show/hide logic:
    if (minutes === 0) {
        // Hide minutes and colon, show seconds.hundredths with dot
        minutesSpan.style.display = 'none';
        separatorColon.style.display = 'none';
        hundredthSpan.style.display = '';
        separatorDot.style.display = '';
    } else {
        // Show minutes and colon, show hundredths and dot
        minutesSpan.style.display = '';
        separatorColon.style.display = '';
        hundredthSpan.style.display = '';
        separatorDot.style.display = '';
    }
}

// Function to start the stopwatch
function startStopwatch() {
    if (isRunning) return;
    isRunning = true;
    startTime = Date.now();
    timer = setInterval(updateDisplay, 10);
}

// Function to pause the stopwatch
function pauseStopwatch() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timer);
    elapsedPauseTime += Date.now() - startTime;
    saveLapTime(); // Saves lap time when the timer is paused
    updateDisplay(); // Ensure display updates immediately after pause
}

// Function to reset the stopwatch
function resetStopwatch() {
    pauseStopwatch();
    totalMilliseconds = 0;
    elapsedPauseTime = 0;
    lapTimes = [];
    updateLapTimesTable();
    updateDisplay();
}

// Function to save a lap time
function saveLapTime() {
    const lapTime = totalMilliseconds;
    lapTimes.push(lapTime);
    updateLapTimesTable();
}

// Function to update the lap times table
function updateLapTimesTable() {
    if (!lapTimesTable) return;
    lapTimesTable.innerHTML = ''; // Clear the table
    lapTimes.forEach((time, index) => {
        const totalSeconds = Math.floor(time / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const hundredths = Math.floor((time % 1000) / 10);
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
        const row = lapTimesTable.insertRow();
        const lapCell = row.insertCell(0);
        const timeCell = row.insertCell(1);
        lapCell.textContent = `${index + 1}.`;
        timeCell.textContent = formattedTime;
    });
}

// Event listeners
document.body.addEventListener('click', (event) => {
    // Avoid interfering with the 'a' and 'button' elements
    if (event.target.closest('a') || event.target.closest('button')) {
        return;
    }
    if (isRunning) {
        pauseStopwatch();
    } else {
        startStopwatch();
    }
});

document.body.addEventListener('dblclick', (event) => {
    event.preventDefault();
    resetStopwatch();
});

document.body.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (isRunning) {
        saveLapTime();
    }
});

lapTimesButton.addEventListener('click', () => {
    if (isRunning) {
        saveLapTime();
    }
});

// Event listener for keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();
        if (isRunning) {
            pauseStopwatch();
        } else {
            startStopwatch();
        }
    }
    if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        resetStopwatch();
    }
});

// Initialize display and lap table
updateDisplay();
updateLapTimesTable();
