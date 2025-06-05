let isExpanded = false;

const expandableBtn = document.getElementById('expandableBtn');
const expandablePanel = document.getElementById('expandablePanel');

const btn = document.getElementById('expandableBtn');
const icon = btn.querySelector('.material-symbols-outlined');

function togglePanel() {
    isExpanded = !isExpanded;

    icon.textContent = isExpanded ? 'expand_more' : 'expand_less';
    expandablePanel.classList.toggle('expanded', isExpanded);
    expandableBtn.classList.toggle('collapsed', !isExpanded);
}

expandableBtn.addEventListener('click', togglePanel);

document.querySelectorAll('.inpt1, .inpt2').forEach(input => {
    input.addEventListener('input', () => {
        input.value = input.value.replace(/[^0-9]/g, '');
if (input.value.length > 2) input.value = input.value.slice(0, 2);
    });
});   

function initZIndexManager() {
    const blurBox = document.querySelectorAll('.blur-box');
    let zIsExpanded = false;

    function updateZIndex() {
        if (zIsExpanded) {
            blurBox.forEach(element => {
                element.style.zIndex = '1';
            });
            if (expandablePanel) {
                expandablePanel.style.zIndex = '1000';
            }
        } 
        else {
            if (expandablePanel) {
            expandablePanel.style.zIndex = '1000';
            }
            setTimeout(() => {
                blurBox.forEach(element => {
                    element.style.zIndex = '999';
                });
                if (expandablePanel) {
                    expandablePanel.style.zIndex = '1';
                }
            }, 300);
        }
    }
    if (expandableBtn) {
        expandableBtn.addEventListener('click', function() {
            setTimeout(() => {
                zIsExpanded = expandablePanel.classList.contains('expanded');
                updateZIndex();
            }, 10);
        });
    }
    updateZIndex();
}

let promodoro = document.getElementById('regularTimer');
let short = document.getElementById('shortTimer');
let long = document.getElementById('longTimer');
let timers = document.querySelectorAll('.timer');
let session = document.getElementById('promodoro-session');
let shortBreak = document.getElementById('short-break');
let longBreak = document.getElementById('long-break');
let startBtn = document.getElementById('start');
let pauseBtn = document.getElementById('pause');
let resetBtn = document.getElementById('reset');

let currentTimer = null;
let myInterval = null;
let isPaused = false;
let remainingTime = 0;

const notifPromo = document.getElementById('notif-promoToBreak');  
const notifBreak = document.getElementById('notif-breakToPromo');
const linkPromo  = document.getElementById('link-promoToBreak');
const linkBreak  = document.getElementById('link-breakToPromo'); 

function showDefaultTimer(){
    promodoro.style.display = 'block';
    short.style.display = 'none';
    long.style.display = 'none';
    currentTimer = promodoro;
}
showDefaultTimer();

function hideAll() {
    timers.forEach(timer => {
        timer.style.display = 'none';
    });
}  

function startTimer(timeDisplay){
    if (myInterval) clearInterval(myInterval);

    const container = timeDisplay.parentElement;
    let timerDuration;

    if (isPaused && remainingTime > 0) {
        timerDuration = Math.ceil(remainingTime / 60000);
    } 
    else {
        const durationStr = container.getAttribute('data-duration');
        timerDuration = parseFloat(durationStr);
    }

    const durationInMilSec = timerDuration * 60 * 1000;
    let endTimestamp = Date.now() + durationInMilSec;

    myInterval = setInterval(() =>{
        const timeRemnng = endTimestamp - Date.now();

        if (timeRemnng <= 0){
            clearInterval(myInterval);
            const display = currentTimer.querySelector('.time');
            display.textContent = '00:00';

            if (currentTimer.id === 'regularTimer') {
                notifPromo.classList.remove('hidden');
                notifPromo.classList.add('visible');
            } 
            else {
                notifBreak.classList.remove('hidden');
                notifBreak.classList.add('visible');
            }

            alarmSound.currentTime = 0;
            alarmSound.play().catch(err => console.warn('Alarma:', err));

            isPaused = false;
            remainingTime = 0;

            return;
        }

        const mins = Math.floor(timeRemnng / 60000);
        const secs = Math.floor((timeRemnng % 60000) / 1000);

        timeDisplay.textContent = 
            `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        
        remainingTime = timeRemnng;
    }, 1000);
}

function pauseTimer(){
    if (myInterval){
        clearInterval(myInterval);
        myInterval = null;
        isPaused = true;
    }
}

function resetTimer() {
    if (myInterval) {
        clearInterval(myInterval);
        myInterval = null;
    }
    isPaused = false;
    remainingTime = 0;
    
    if (currentTimer) {
        const container = currentTimer;
        const durationStr = container.getAttribute('data-duration');
        const duration = parseFloat(durationStr);
        const display = currentTimer.querySelector('.time');
        
        const mins = Math.floor(duration);
        const secs = Math.floor((duration % 1) * 60);
        display.textContent = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    }
}

const colorButtons = document.querySelectorAll('.color-btn');
const bgColor = document.querySelector('.main-section');
const title = document.querySelector('.main-title');
const input1 = document.querySelector('.inpt1');
const input2 = document.querySelector('.inpt2');
const rootStyles = getComputedStyle(document.documentElement);
const getColorVar = (varName) => rootStyles.getPropertyValue(varName).trim();
const alarmSound = new Audio('assets/alarmSound.wav');
alarmSound.preload = 'auto';

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const color = button.dataset.color;

        const lightColor = getColorVar(`--${color}-clr`);
        const darkColor = getColorVar(`--dark-${color}-clr`);

        bgColor.style.backgroundColor = lightColor;
        title.style.color = darkColor;

        input1.style.backgroundColor = lightColor;
        input2.style.backgroundColor = lightColor;

        document.documentElement.style.setProperty('--main-title', darkColor);

        colorButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

startBtn.addEventListener('click', () => {
    if (!currentTimer) return;
    const display = currentTimer.querySelector('.time');
    startTimer(display);
    isPaused = false;
    alarmSound.pause();
    alarmSound.currentTime = 0;
});

pauseBtn.addEventListener('click', () => {
    pauseTimer();
    alarmSound.pause();
    alarmSound.currentTime = 0;
});

resetBtn.addEventListener('click', () => {
    resetTimer();
    alarmSound.pause();
    alarmSound.currentTime = 0;
});

linkPromo.addEventListener('click', e => {
    e.preventDefault();
    notifPromo.classList.remove('visible');
    notifPromo.classList.add('hidden');
    alarmSound.pause();
    alarmSound.currentTime = 0;
    shortBreak.click();
});

linkBreak.addEventListener('click', e => {
    e.preventDefault();
    notifBreak.classList.remove('visible');
    notifBreak.classList.add('hidden');
    alarmSound.pause();
    alarmSound.currentTime = 0;
    session.click();
});

session.addEventListener('click', () => {
    notifPromo.classList.remove('visible');
    notifPromo.classList.add('hidden');
    notifBreak.classList.remove('visible');
    notifBreak.classList.add('hidden');

    alarmSound.pause();
    alarmSound.currentTime = 0;

    hideAll();
    promodoro.style.display = 'block';
    session.classList.add('active');
    shortBreak.classList.remove('active');
    longBreak.classList.remove('active');
    currentTimer = promodoro;
    resetTimer();
    loadCurrentTimerValues();
})

shortBreak.addEventListener('click', () => {
    notifPromo.classList.remove('visible');
    notifPromo.classList.add('hidden');
    notifBreak.classList.remove('visible');
    notifBreak.classList.add('hidden');

    alarmSound.pause();
    alarmSound.currentTime = 0;
    
    hideAll();
    short.style.display = 'block';
    shortBreak.classList.add('active');
    session.classList.remove('active');
    longBreak.classList.remove('active');
    currentTimer = short;
    resetTimer();
    loadCurrentTimerValues();
})

longBreak.addEventListener('click', () => {
    notifPromo.classList.remove('visible');
    notifPromo.classList.add('hidden');
    notifBreak.classList.remove('visible');
    notifBreak.classList.add('hidden');

    alarmSound.pause();
    alarmSound.currentTime = 0;

    hideAll();
    long.style.display = 'block';
    longBreak.classList.add('active');
    session.classList.remove('active');
    shortBreak.classList.remove('active');
    currentTimer = long;
    resetTimer();
    loadCurrentTimerValues();
})

let minutesInput = document.querySelector('.inpt1');
let secondsInput = document.querySelector('.inpt2');

function initTimeInputs() {
    minutesInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 2) this.value = this.value.slice(0, 2);
        if (parseInt(this.value) > 99) this.value = '99';
        updateTimerFromInputs();
    });
    
    secondsInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value.length > 2) {
        this.value = this.value.slice(0, 2);
        }
        if (parseInt(this.value) > 59) {
        this.value = '59';
        }
        updateTimerFromInputs();
    });

    minutesInput.addEventListener('blur', function() {
        if (this.value === '' || this.value === '0') {
            this.value = '01';
        }
        if (this.value.length === 1) {
            this.value = '0' + this.value;
        } 
        updateTimerFromInputs();
    });

    secondsInput.addEventListener('blur', function () {
        if (this.value === '') {
            this.value = '00';
        }
        if (this.value.length === 1) {
            this.value = '0' + this.value;
        }
        updateTimerFromInputs();
    });
}

function updateTimerFromInputs() {
    if (!currentTimer) return;

    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    const totalMinutes = minutes + (seconds / 60);

    currentTimer.setAttribute('data-duration', totalMinutes.toFixed(2));

    if (!myInterval) {
        const display = currentTimer.querySelector('.time');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        display.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }
}

function loadCurrentTimerValues() {
    if (!currentTimer) return;

    const durationStr = currentTimer.getAttribute('data-duration');
    const duration = parseFloat(durationStr);

    const minutes = Math.floor(duration);
    const seconds = Math.floor((duration % 1) * 60);

    minutesInput.value = minutes.toString().padStart(2, '0');
    secondsInput.value = seconds.toString().padStart(2, '0');
}

// const toggleBtn = document.getElementById('menu-toggle');
// const mobileMenu = document.getElementById('mobile-menu');

// toggleBtn.addEventListener('click', () => {
// mobileMenu.classList.toggle('show');
// });

document.addEventListener('DOMContentLoaded', function() {
    initZIndexManager();
    initTimeInputs(); 
    loadCurrentTimerValues();
});
