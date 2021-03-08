export default class SpaceTimeController{
    constructor() {
        this.currentDay = 0;
        this.currentYear = 0;
        this.multiplier = 1; //SPEED

        this.isRunning = false;

        this.counter = 0;

        this._secondsCounter = 0;
        this._timestamp = performance.now();
        
        this.update = this.update.bind(this);
    }

    reset() {
        this.currentDay = 0;
        this.currentYear = 1;
        this.multiplier = 0;
        this.counter = 0;
    }

    start() {
        this._timestamp = performance.now();
        this.isRunning = true;
        this.animFrame = requestAnimationFrame(this.update);
    }

    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.animFrame);
    }

    update() {
        this.animFrame = requestAnimationFrame(this.update);
        const now = performance.now();
        const diff = now - this._timestamp;
        this._timestamp = now;
        const seconds = (diff / 1000) % 60;
        this.counter += seconds * this.secondsMultiplier;
        // console.log(diff, '  : ', seconds);
    }

    getNormalizedCurrentHourInDay(rotationCycle /* rotationHours / 24 */) {
        return Math.abs(this.counter % rotationCycle / rotationCycle);
    }

    getCurrentHourInDay() {
        return this.counter % 1 * 24;
    }

    getCurrentDay() {
        return Math.floor(this.counter % 365);
    }

    getNormalizedPositionInYear(days) {
        return Math.min(this.counter % days / days, 1);
    }

    getCurrentYear() {
        return Math.floor(this.counter / 365);
    }

    set multiplier(value) {
        this._multiplier = value;
        this.secondsMultiplier = value;
    }

    get multiplier() {
        return this._multiplier;
    }

    set secondsMultiplier(value) {
        this._secondsMultiplier = value / 24;
    }

    get secondsMultiplier() {
        return this._secondsMultiplier;
    }
}
