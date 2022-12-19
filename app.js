class Timer {
    constructor(time, increment, timerElement) {
        this.time = time;
        this.increment = increment;
        this.timerElement = timerElement;
        this.timerElement.addEventListener('click', this.toggle);
        this.interval = null;
    }

    start() {
        this.interval = setInterval(() => {
            this.time -= 100;
            this.timerElement.innerHTML = formatTime(this.time);
        }, 100);
    }

    toggle = () => {
        if (this.interval) {
            this.stop();
        } else {
            this.start();
        }
    }

    stop() {
        clearInterval(this.interval);
    }

    reset() {
        this.time = DEFAULT_TIME;
        this.increment = DEFAULT_INCREMENT;
        this.timerElement.innerHTML = formatTime(this.time);
    }
}

class TimerController{
    constructor(timer1, timer2){
        this.timer1 = timer1;
        this.timer2 = timer2;
    }
    
    

}

const DEFAULT_TIME = 60 * 2 * 1000;
const DEFAULT_INCREMENT = 2 * 1000;
const timer1 = document.getElementById('timer1');
const timer2 = document.getElementById('timer2');
const settingsPane = document.getElementById('settings-popup');
const settingsButton = document.getElementById('settings-button');
const settingsCancelButton = document.getElementById('cancel-button');
const settingsSaveButton = document.getElementById('save-button');

// center settings popup vertically
settingsPane.style.top = `calc(50% - ${settingsPane.clientHeight} / 2)`;
settingsPane.style.display = 'none';

settingsButton.onclick = toggleSettings;
settingsCancelButton.onclick = toggleSettings;
settingsSaveButton.onclick = saveAndCloseSettings;

timerObject1 = new Timer(DEFAULT_TIME, DEFAULT_INCREMENT, timer1);
timerObject2 = new Timer(DEFAULT_TIME, DEFAULT_INCREMENT, timer2);

function toggleSettings() {
    settingsPane.style.display =
        settingsPane.style.display != "none" ? 'none' : "flex";
}

function saveAndCloseSettings() {
    // save settings
    settingsPane.style.display = 'none';
}

function formatTime(time) {
    // format ms to mm:ss left pad 0
    const minutes = Math.floor(time / 1000 / 60);
    const seconds = Math.floor(time / 1000) % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
