const State = {
    IDLE : 0,
    ACTIVE : 1,
    LOST : 2,
    PAUSED : 3,
    FOUL : 4,
}

const COOKIES = {
    TIME : 'time',
    INCREMENT : 'increment',
    DECREMENT : 'decrement',
}


class Timer {
    constructor(time, increment, decrement, timerElement) {
        this._time = time;
        this.increment = increment;
        this.decrement = decrement;
        this.timerElement = timerElement;
        this.timerParent = timerElement.closest('.player');
        this.interval = null;
        this.state = State.IDLE;
        this.reset();
    }

    start() {
        if (this.state === State.ACTIVE) {
            return;
        }
        this.state = State.ACTIVE;
        this.timerParent.classList.add('active');
        this.interval = setInterval(() => {
            if (this.time >= 100) {
                this.time -= 100;
                this.timerElement.innerHTML = formatTime(this.time);
            } else {
                this.state = State.LOST;
                this.timerParent.classList.add('lost');
                this.stop();
            }
        }, 100);
    }

    get time() {
        return this._time;
    }
    set time(time) {
        this._time = time;
        this.timerElement.innerHTML = formatTime(this.time);
    }

    stop() {
        clearInterval(this.interval);
        this.timerParent.classList.remove('active');
        this.active = false;
    }

    pot() {
        this.time += this.increment;
    }

    foul() {
        this.timerParent.classList.add('foul');
        if (this.time >= this.decrement) {
            this.time -= this.decrement;
        } else {
            this.state = State.LOST;
            this.timerParent.classList.add('lost');
            this.time = 0;
            this.stop();
        }
    }

    reset() {
        this.stop();
        this.timerParent.classList.remove('lost');
        this.timerParent.classList.remove('active');
        this.timerParent.classList.remove('foul');
        this.timerParent.classList.remove('paused');
        this.time = TIME;
        this.state = State.IDLE;
        this.increment = INCREMENT;
        this.decrement = DECREMENT;
    }
}

class TimerController {
    constructor(timer1, timer2) {
        this.timer1 = timer1;
        this.timer2 = timer2;
        this.potButton = document.getElementById('pot-button');
        this.potButton.addEventListener('click', e => this.pot(e));
        this.foulButton = document.getElementById('foul-button');
        this.foulButton.addEventListener('click', e => this.foul(e));
        this.clickedTimer = null;
        this.otherTimer = null;
        this.timer1Button = this.timer1.timerParent;
        this.timer2Button = this.timer2.timerParent;
        this.timer1Button.addEventListener('click', e => this.toggleTimer(e));
        this.timer2Button.addEventListener('click', e => this.toggleTimer(e));
    }

    pauseTimers() {
        if(this.timer1.state === State.ACTIVE) {
            this.timer1.state = State.PAUSED;
            this.timer1.timerParent.classList.add('paused');
        }
        if(this.timer2.state === State.ACTIVE) {
            this.timer2.state = State.PAUSED;
            this.timer2.timerParent.classList.add('paused');
        }
        this.timer1.stop();
        this.timer2.stop();
    }

    reset() {
        this.timer1.reset();
        this.timer2.reset();
    }

    toggleTimer = (event) => {
        let clickedTimer, otherTimer;
        if (event.target.classList.contains('player1')) {
            clickedTimer = this.timer1;
            otherTimer = this.timer2;
        } else if (event.target.classList.contains('player2')) {
            clickedTimer = this.timer2;
            otherTimer = this.timer1;
        }
        
        switch (clickedTimer.state) {
            case State.IDLE:
            case State.ACTIVE:
                clickedTimer.state = State.IDLE;
                
                clickedTimer.timerParent.classList.remove('paused');
                otherTimer.timerParent.classList.remove('paused');
                
                clickedTimer.stop();
                otherTimer.start();
                break;
            case State.LOST:
                break;
            case State.PAUSED:
                break;
            case State.FOUL:
                this.timer1.timerParent.classList.remove('foul');
                this.timer2.timerParent.classList.remove('foul');
                this.fouledTimer.stop();
                this.otherTimer.start();
                break;
        }
    }

    pot = (e) => {
        e.preventDefault();
        if (this.timer1.state === State.ACTIVE) {
            this.timer1.pot();
        } else if (this.timer2.state === State.ACTIVE) {
            this.timer2.pot();
        }
    }

    foul = (e) => {
        e.preventDefault();
        if (this.timer1.state === State.ACTIVE) {
            this.fouledTimer = this.timer1;
            this.otherTimer = this.timer2;
            this.timer1.foul();
        } else if (this.timer2.state === State.ACTIVE) {
            this.fouledTimer = this.timer2;
            this.otherTimer = this.timer1;
            this.timer2.foul();
        }
        
        this.timer1.state = State.FOUL;
        this.timer2.state = State.FOUL;
        this.timer1.stop();
        this.timer2.stop();
    }

}


const DEFAULT_TIME = 90 * 1000;
const DEFAULT_INCREMENT = 7 * 1000;
const DEFAULT_DECREMENT = 5 * 1000;
let TIME = getCookie(COOKIES.TIME) || DEFAULT_TIME;
let DECREMENT = getCookie(COOKIES.DECREMENT) || DEFAULT_DECREMENT;
let INCREMENT = getCookie(COOKIES.INCREMENT) || DEFAULT_INCREMENT;
const timer1 = document.getElementById('timer1');
const timer2 = document.getElementById('timer2');
const settingsPane = document.getElementById('settings-popup');
const settingsBackground = document.getElementById('settings-background');
const startStopButton = document.getElementById('start-stop-button');

timerObject1 = new Timer(TIME, INCREMENT, DECREMENT, timer1);
timerObject2 = new Timer(TIME, INCREMENT, DECREMENT, timer2);

timerController = new TimerController(timerObject1, timerObject2);

settingsBackground.addEventListener('click', e => {
    e.preventDefault();
    toggleSettings();
});


// center settings popup vertically
settingsPane.style.top = `calc(50% - (${settingsPane.clientHeight} / 2))`;
settingsPane.style.display = 'none';


function resetTimers() {
    timerController.reset();
}

function pot(){
    if (timerObject1.active){
        timerObject1.pot();
    } else if(timerObject2.active){
        timerObject2.pot();
    }
}


function foul(){
    timerController.foul();
}

function toggleSettings() {
    if(settingsPane.style.display == "none"){
        document.getElementById('time').value = TIME / 1000 / 60;
        document.getElementById('increment').value = INCREMENT / 1000;
        document.getElementById('decrement').value = DECREMENT / 1000;
        timerController.pauseTimers();
    }
    else{
    }
    settingsPane.style.display =
        settingsPane.style.display != "none" ? 'none' : "flex";
    settingsBackground.style.display = settingsPane.style.display;
}

function saveAndCloseSettings() {
    // get values from settings
    const time = document.getElementById('time').value;
    const increment = document.getElementById('increment').value;
    const decrement = document.getElementById('decrement').value;

    // set time, increment and decrement
    TIME = time ? time * 60 * 1000  : DEFAULT_TIME;
    DECREMENT = decrement ? decrement * 1000: DEFAULT_DECREMENT;
    INCREMENT = increment ? increment * 1000: DEFAULT_INCREMENT;

    // reset timers
    timerObject1.reset();
    timerObject2.reset();

    // set cookie
    saveCookies();

    // close settings
    settingsPane.style.display = 'none';
    settingsBackground.style.display = 'none';
}

function formatTime(time) {
    // format ms to mm:ss left pad 0
    const minutes = Math.floor(time / 1000 / 60);
    const seconds = Math.floor(time / 1000) % 60;
    const hundredths = Math.floor(time / 10) % 100;
    if (seconds < 10 && minutes === 0) {
        return `${seconds}.${hundredths < 10 ? '0' : ''}${hundredths}`;
    }    
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// save settings to cookie
function saveCookies(){
    document.cookie = `${COOKIES.TIME}=${TIME};${COOKIES.INCREMENT}=${INCREMENT};${COOKIES.DECREMENT}=${DECREMENT}`;
}


function getCookie(name){
    const cookie = document.cookie.split(';').find(c => c.includes(name));
    return cookie ? cookie.split('=')[1] : null;
}
