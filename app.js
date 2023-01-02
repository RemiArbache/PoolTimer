const State = {
    IDLE : 0,
    ACTIVE : 1,
    LOST : 2,
    PAUSED : 3,
    FOUL : 4,
}

class Timer {
    constructor(time, increment, decrement, timerElement) {
        this._time = time;
        this.increment = increment;
        this.decrement = decrement;
        this.timerElement = timerElement;
        this.timerParent = timerElement.closest('.player');
        this.timerParent.addEventListener('click', this.toggle);
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
        this.potButton.addEventListener('click', this.pot);
        this.foulButton = document.getElementById('foul-button');
        this.foulButton.addEventListener('click', this.foul);
        this.clickedTimer = null;
        this.otherTimer = null;
        this.timer1Button = this.timer1.timerParent;
        this.timer2Button = this.timer2.timerParent;
        this.timer1Button.addEventListener('click', e => this.toggleTimer(e));
        this.timer2Button.addEventListener('click', e => this.toggleTimer(e));
    }

    pauseTimers() {
        this.timer1.stop();
        this.timer2.stop();
    }

    reset() {
        this.timer1.reset();
        this.timer2.reset();
    }

    toggleTimer = (event) => {
        console.log(this);
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
                clickedTimer.state = State.PAUSED;
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

    pot = () => {

        if (this.timer1.state === State.ACTIVE) {
            this.timer1.pot();
        } else if (this.timer2.state === State.ACTIVE) {
            this.timer2.pot();
        }
    }

    foul = () => {
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

const DEFAULT_TIME = 15 * 1000;
const DEFAULT_INCREMENT = 3 * 1000;
const DEFAULT_DECREMENT = 5 * 1000;
let TIME = DEFAULT_TIME;
let DECREMENT = DEFAULT_DECREMENT;
let INCREMENT = DEFAULT_INCREMENT;
const timer1 = document.getElementById('timer1');
const timer2 = document.getElementById('timer2');
const settingsPane = document.getElementById('settings-popup');
const startStopButton = document.getElementById('start-stop-button');

timerObject1 = new Timer(TIME, INCREMENT, DECREMENT, timer1);
timerObject2 = new Timer(TIME, INCREMENT, DECREMENT, timer2);

timerController = new TimerController(timerObject1, timerObject2);


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
    settingsPane.style.display =
        settingsPane.style.display != "none" ? 'none' : "flex";
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

    // close settings
    settingsPane.style.display = 'none';
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
