export default class RangeSlider{
	constructor(parentEl, title, value, settings, valChangeCallback, parameter, decimals) {

		this.parentEl = parentEl;

		this.valChangeCallback = valChangeCallback;
		this.parameter = parameter;
		this.decimals = decimals;

		this.value = (value - settings.min) / (settings.max - settings.min);
		this.settings = settings;

		this.el = document.createElement('div');
		this.el.className = 'node-control node-range';

		const titleEl = document.createElement('h5');
		titleEl.innerHTML = title;
		titleEl.className = 'node-range-title';

		this.el.appendChild(titleEl);

		this.sliderBg = document.createElement('div');
		this.sliderBg.className = 'node-range-slider-bg';

		this.knobEl = document.createElement('div');
		this.knobEl.className = 'node-range-knob';

		this.sliderBg.appendChild(this.knobEl);

		this.el.appendChild(this.sliderBg);

		this.valueEl = document.createElement('p');
		this.valueEl.className = 'node-range-value';
		this.valueEl.innerHTML = value;

		this.el.appendChild(this.valueEl);

		this.parentEl.appendChild(this.el);

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);

		setTimeout(() => {
			this.setPos(this.sliderBg.clientHeight);
		}, 0);

		this.knobEl.addEventListener('mousedown', this.onMouseDownBound);
	}

	remove() {

		this.knobEl.removeEventListener('mousedown', this.onMouseDownBound);
		this.parentEl.removeChild(this.el);
	}

	getValue() {

		return this.value * (this.settings.max - this.settings.min) + this.settings.min;
	}

	getReadyValue() {
		return parseFloat(this.getValue().toFixed(this.decimals));
	}

	onMouseDown(e) {

		e.preventDefault();
		e.stopPropagation();

		window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);

	}

	onMouseMove(e) {

		const sliderBgRect = this.sliderBg.getBoundingClientRect();

		const sliderHeight = this.sliderBg.clientHeight;

		const y = Math.round((e.y - sliderBgRect.top) * 100) / 100;
		const val = 1 - (y / sliderHeight);

		this.value = val > 1 ? 1 : val < 0 ? 0 : val;

		this.setPos(sliderHeight);
		if (this.valChangeCallback) {

			this.valChangeCallback(parseFloat(this.getValue().toFixed(this.decimals)), this.parameter);
		}
		

		this.valueEl.innerHTML = this.getValue().toFixed(this.decimals);
	}

	onMouseUp(e) {

		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);
	}

	setPos(sliderHeight) {

		const pos = sliderHeight - this.value * sliderHeight;

		this.knobEl.style[window.NS.transform] = `translate3d(0px, ${pos}px, 0)`;
	}
}