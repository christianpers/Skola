import HorizontalSlider from '../../../../views/Nodes/NodeComponents/HorizontalSlider';

import './index.scss';

export default class SpaceTimeUI{
    constructor(parentEl) {
        const html = `
            <div class="time-container">
                <div class="value-container">
                    <h4 class="hour-visual type">Timme:</h4>
                    <h4 class="hour value"></h4>
                    <h4 class="day-visual type">Dygn:</h4>
                    <h4 class="day value"></h4>
                    <h4 class="year-visual type">År:</h4>
                    <h4 class="year value"></h4>
                </div>
                <button><h4>Start</h4></button>
            </div>
            <div class="speed-slider-container"></div>
        `;

        this.el = document.createElement('space-time-ui');
        this.el.insertAdjacentHTML('beforeend', html);

        parentEl.appendChild(this.el);

        this.onControlBtnClick = this.onControlBtnClick.bind(this);

        const hourValueEl = this.el.querySelector('.hour.value');
        const dayValueEl = this.el.querySelector('.day.value');
        const yearValueEl = this.el.querySelector('.year.value');
        const sliderContainer = this.el.querySelector('.speed-slider-container');
        this._controlButton = this.el.querySelector('button');
        this._controlBtnLabel = this.el.querySelector('button > h4');
        this._controlButton.addEventListener('click', this.onControlBtnClick);

        this.timeUI = {
            'hours': {
                'domEl': hourValueEl,
            },
            'days': {
                'domEl': dayValueEl,
            },
            'years': {
                'domEl': yearValueEl,
            }
        };

        this.onSpeedSettingChangeBound = this.onSpeedSettingChange.bind(this);

        this.speedSetting = new HorizontalSlider(
            sliderContainer,
            window.NS.singletons.LessonManager.space.spaceTimeController.multiplier,
            this.onSpeedSettingChangeBound,
            2,
            { min: -12, max: 480 },
            'speed-settings settings-item',
            'Timmar per sekund'
        );
	

        this.parentEl = parentEl;

        this.update = this.update.bind(this);

        this.setUI(0, 0, 0);
    }

    onSpeedSettingChange(val) {
        window.NS.singletons.LessonManager.space.spaceTimeController.multiplier = val;
    }

    onControlBtnClick() {
        if (window.NS.singletons.LessonManager.space.spaceTimeController.isRunning) {
            this.onStop();
        } else {
            this.onStart();
        }
    }

    onStart() {
        this._controlBtnLabel.innerHTML = 'Pausa';
        window.NS.singletons.LessonManager.space.spaceTimeController.start();
        this.animFrame = requestAnimationFrame(this.update);
    }

    onStop() {
        this._controlBtnLabel.innerHTML = 'Starta';
        cancelAnimationFrame(this.animFrame);
        window.NS.singletons.LessonManager.space.spaceTimeController.stop();
    }

    update() {
        this.animFrame = requestAnimationFrame(this.update);

        const hours = window.NS.singletons.LessonManager.space.spaceTimeController.getCurrentHourInDay();
        const days = window.NS.singletons.LessonManager.space.spaceTimeController.getCurrentDay();
        const year = window.NS.singletons.LessonManager.space.spaceTimeController.getCurrentYear();

        this.setUI(hours, days, year);
    }

    setUI(hours, days, year) {
        this.timeUI.hours.domEl.innerHTML = Math.floor(hours);
        this.timeUI.days.domEl.innerHTML = days;
        this.timeUI.years.domEl.innerHTML = year;
    }
}