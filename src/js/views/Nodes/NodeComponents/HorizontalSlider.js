export default class HorizontalSlider{
	constructor(parentEl, value, valChangeCallback, decimals, settings, containerClassName, name) {

		this.parentEl = parentEl;

		this.valChangeCallback = valChangeCallback;

		this.decimals = decimals;
		this.value = (value - settings.min) / (settings.max - settings.min);
		
		this.settings = settings;

		this.el = document.createElement('div');
		this.el.className = 'horizontal-slider prevent-drag ' + containerClassName;

		const label = document.createElement('h4');
		label.className = 'horizontal-slider-label';
		label.innerHTML = name;

		this.el.appendChild(label);
	
		this.rangeInnerContainer = document.createElement('div');
		this.rangeInnerContainer.className = 'range-inner-container prevent-drag';

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
			this.setPos(120);
		}, 0);

		this.rangeInnerContainer.addEventListener('click', this.onRangeClickBound);
		this.rangeKnob.addEventListener('mousedown', this.onMouseDownBound);
		// this.el.addEventListener('mousedown', this.onMouseDownBound);
	}

	remove() {

		this.el.removeEventListener('mousedown', this.onMouseDownBound);
		this.parentEl.removeChild(this.el);
	}

	setValue(value) {
		this.value = value;
		
		this.setPos(120);
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

		const sliderWidth = 120;

		const sliderBgRect = this.rangeInnerContainer.getBoundingClientRect();

		const x = Math.round((e.x - sliderBgRect.left) * 100) / 100;
		const val = x / sliderWidth;

		this.value = val > 1 ? 1 : val < 0 ? 0 : val;
		// this.value = Math.min(val, 1.0);

		this.setPos(sliderWidth);

		this.valueEl.innerHTML = this.getValue().toFixed(this.decimals);
	}

	onMouseDown(e) {

		e.preventDefault();
		e.stopPropagation();

		const sliderWidth = 120;

		const sliderBgRect = this.rangeInnerContainer.getBoundingClientRect();

		const x = Math.round((e.x - sliderBgRect.left) * 100) / 100;
		const val = x / sliderWidth;

		this.value = val > 1 ? 1 : val < 0 ? 0 : val;
		// this.value = Math.min(val, 1.0);

		this.setPos(sliderWidth);

		if (this.valChangeCallback) {

			this.valChangeCallback(parseFloat(this.getValue().toFixed(this.decimals)));
		}
		

		this.valueEl.innerHTML = this.getValue().toFixed(this.decimals);

		window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);

	}

	onMouseMove(e) {

		const sliderWidth = 120;

		const sliderBgRect = this.rangeInnerContainer.getBoundingClientRect();

		const x = Math.round((e.x - sliderBgRect.left) * 100) / 100;
		const val = x / sliderWidth;

		this.value = val > 1 ? 1 : val < 0 ? 0 : val;
		// this.value = Math.min(val, 1.0);

		this.setPos(sliderWidth);
		if (this.valChangeCallback) {

			this.valChangeCallback(parseFloat(this.getValue().toFixed(this.decimals)));
		}
		

		this.valueEl.innerHTML = this.getValue().toFixed(this.decimals);
	}

	onMouseUp(e) {

		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);
	}

	setPos(sliderWidth) {

		const pos = this.value * sliderWidth;
		const width = this.value * sliderWidth;

		this.rangeKnob.style[window.NS.transform] = `translate3d(${pos}px, 0px, 0)`;
	}
}