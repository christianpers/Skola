export default class VerticalSlider{
	constructor(parentEl, value, valChangeCallback, decimals, settings, name) {

		this.parentEl = parentEl;

		this.valChangeCallback = valChangeCallback;

		this.height = 60;

		this.decimals = decimals;
		this.value = (value - settings.min) / (settings.max - settings.min);
		
		this.settings = settings;

		this.el = document.createElement('div');
		this.el.className = 'vertical-slider prevent-drag';

		const label = document.createElement('h4');
		label.className = 'vertical-slider-label';
		label.innerHTML = name;

		this.el.appendChild(label);
		

		this.rangeInnerContainer = document.createElement('div');
		this.rangeInnerContainer.className = 'range-inner-container prevent-drag';
		this.rangeInnerContainer.style.height = `${this.height}px`;

		this.rangeKnob = document.createElement('div');
		this.rangeKnob.className = 'range-knob prevent-drag';

		this.rangeInnerContainer.appendChild(this.rangeKnob);

		const rangeEl = document.createElement('div');
		rangeEl.appendChild(this.rangeInnerContainer);
		rangeEl.className = 'range-container';


		this.valueEl = document.createElement('div');
		this.valueEl.className = 'value-display';
		this.valueEl.innerHTML = value;

		const valueContainer = document.createElement('div');
		valueContainer.className = 'value-container';

		valueContainer.appendChild(this.valueEl);

		this.el.appendChild(rangeEl);

		this.el.appendChild(valueContainer);

		this.parentEl.appendChild(this.el);

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);
		this.onRangeClickBound = this.onRangeClick.bind(this);

		setTimeout(() => {
			this.setPos(this.height);
		}, 0);

		this.rangeInnerContainer.addEventListener('click', this.onRangeClickBound);
		this.rangeKnob.addEventListener('mousedown', this.onMouseDownBound);
		// this.el.addEventListener('mousedown', this.onMouseDownBound);
	}

	remove() {

		this.rangeInnerContainer.removeEventListener('click', this.onRangeClickBound);
		this.rangeKnob.removeEventListener('mousedown', this.onMouseDownBound);
		this.parentEl.removeChild(this.el);
	}

	setValue(value) {
		this.value = value;
		
		this.setPos(this.height);
		const val = this.getValue().toFixed(this.decimals);
		this.valueEl.innerHTML = val;

		if (this.valChangeCallback) {

			this.valChangeCallback(val);
		}
	}

	getValue() {
		const minMax = this.settings;
		return this.value * (minMax.max - minMax.min) + minMax.min;
	}

	getReadyValue() {
		return parseFloat(this.getValue().toFixed(this.decimals));
	}

	onRangeClick(e) {

		const sliderHeight = this.height;

		const sliderBgRect = this.rangeInnerContainer.getBoundingClientRect();

		const y = Math.round((e.y - sliderBgRect.top) * 100) / 100;
		const val = 1 - (y / sliderHeight);

		this.value = val > 1 ? 1 : val < 0 ? 0 : val;
		// this.value = Math.min(val, 1.0);

		this.setPos(sliderHeight);

		this.valueEl.innerHTML = this.getValue().toFixed(this.decimals);
	}

	onMouseDown(e) {

		e.preventDefault();
		e.stopPropagation();

		const sliderHeight = this.height;

		const sliderBgRect = this.rangeInnerContainer.getBoundingClientRect();


		const y = Math.round((e.y - sliderBgRect.top) * 100) / 100;
		const val = 1 - (y / sliderHeight);

		this.value = val > 1 ? 1 : val < 0 ? 0 : val;

		this.setPos(sliderHeight);
		if (this.valChangeCallback) {

			this.valChangeCallback(parseFloat(this.getValue().toFixed(this.decimals)));
		}
		

		this.valueEl.innerHTML = this.getValue().toFixed(this.decimals);

		window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);

	}

	onMouseMove(e) {

		const sliderHeight = this.height;

		const sliderBgRect = this.rangeInnerContainer.getBoundingClientRect();


		const y = Math.round((e.y - sliderBgRect.top) * 100) / 100;
		const val = 1 - (y / sliderHeight);

		this.value = val > 1 ? 1 : val < 0 ? 0 : val;

		this.setPos(sliderHeight);
		if (this.valChangeCallback) {

			this.valChangeCallback(parseFloat(this.getValue().toFixed(this.decimals)));
		}
		

		this.valueEl.innerHTML = this.getValue().toFixed(this.decimals);
	}

	onMouseUp(e) {

		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);
	}

	setPos(sliderHeight) {

		const pos = sliderHeight - this.value * sliderHeight;
		const height = this.value * sliderHeight;

		// this.knobEl.style.height = `${height}px`;

		this.rangeKnob.style[window.NS.transform] = `translate3d(0px, ${pos}px, 0)`;
	}
}