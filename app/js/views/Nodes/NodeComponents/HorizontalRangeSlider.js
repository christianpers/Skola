export default class HorizontalRangeSlider{
	constructor(parentEl, value, valChangeCallback, decimals, onInputChangeCallback) {

		this.parentEl = parentEl;

		this.valChangeCallback = valChangeCallback;
		this.onInputChangeCallback = onInputChangeCallback;

		this.decimals = decimals;
		// this.value = (value - settings.min) / (settings.max - settings.min);
		
		// this.settings = settings;

		this.onInputChangeBound = this.onInputChange.bind(this);

		this.el = document.createElement('div');
		this.el.className = 'horizontal-range-slider';
		
		const inputLowContainer = document.createElement('div');
		inputLowContainer.className = 'input-container';

		const inputLowLabel = document.createElement('p');
		inputLowLabel.innerHTML = 'Min';
		inputLowContainer.appendChild(inputLowLabel);

		this.inputLowEl = document.createElement('input');
		this.inputLowEl.type = 'number';
		this.inputLowEl.value = -2;
		this.inputLowEl.step = 1;
		this.inputLowEl.min = -10;
		this.inputLowEl.max = 1;
		this.inputLowEl.addEventListener('change', this.onInputChangeBound);

		inputLowContainer.appendChild(this.inputLowEl);

		const inputHighContainer = document.createElement('div');
		inputHighContainer.className = 'input-container';

		const inputHighLabel = document.createElement('p');
		inputHighLabel.innerHTML = 'Max';
		inputHighContainer.appendChild(inputHighLabel);
		
		this.inputHighEl = document.createElement('input');
		this.inputHighEl.type = 'number';
		this.inputHighEl.value = 2;
		this.inputHighEl.step = .1;
		this.inputHighEl.min = 2;
		this.inputHighEl.max = 10;
		this.inputHighEl.addEventListener('change', this.onInputChangeBound);

		inputHighContainer.appendChild(this.inputHighEl);

		this.rangeInnerContainer = document.createElement('div');
		this.rangeInnerContainer.className = 'range-inner-container prevent-drag';

		this.rangeKnob = document.createElement('div');
		this.rangeKnob.className = 'range-knob prevent-drag';

		this.rangeInnerContainer.appendChild(this.rangeKnob);

		const rangeEl = document.createElement('div');
		rangeEl.appendChild(inputLowContainer);
		rangeEl.appendChild(this.rangeInnerContainer);
		rangeEl.appendChild(inputHighContainer);
		rangeEl.className = 'range-container';

		this.valueEl = document.createElement('div');
		this.valueEl.className = 'value-display';
		this.valueEl.innerHTML = this.inputLowEl.value;

		const valueContainer = document.createElement('div');
		valueContainer.className = 'value-container';

		const valueLabel = document.createElement('p');
		valueLabel.innerHTML = 'Value';

		valueContainer.appendChild(valueLabel);
		valueContainer.appendChild(this.valueEl);

		this.el.appendChild(rangeEl);

		this.el.appendChild(valueContainer);

		this.parentEl.appendChild(this.el);

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);
		this.onRangeClickBound = this.onRangeClick.bind(this);
		

		this.value = 0;

		setTimeout(() => {
			this.setPos(100);
		}, 0);

		this.rangeInnerContainer.addEventListener('click', this.onRangeClickBound);
		this.rangeKnob.addEventListener('mousedown', this.onMouseDownBound);
		// this.el.addEventListener('mousedown', this.onMouseDownBound);
	}

	onInputChange(e) {
		
		this.onInputChangeCallback();
	}

	setDefaultValues(param) {
		const obj = param.minMax;
		this.inputLowEl.value = obj.min;
		this.inputLowEl.min = obj.min - 20;
		this.inputLowEl.max = obj.max + 20;

		this.inputHighEl.value = obj.max;
		this.inputHighEl.min = obj.max - 20;
		this.inputHighEl.max = obj.max + 20;

		const value = param.defaultVal;

		this.value = (value - obj.min) / (obj.max - obj.min);

		this.valueEl.innerHTML = value;

		this.setPos(100);

		if (this.valChangeCallback) {

			this.valChangeCallback(parseFloat(this.getValue().toFixed(this.decimals)));
		}
	}

	getMinMaxValue() {

		return {
			min: parseFloat(this.inputLowEl.value),
			max: parseFloat(this.inputHighEl.value),
		};
	}

	remove() {

		this.el.removeEventListener('mousedown', this.onMouseDownBound);
		this.parentEl.removeChild(this.el);
	}

	setValue(value) {
		this.value = value;
		
		this.setPos(100);
		const val = this.getValue().toFixed(this.decimals);
		this.valueEl.innerHTML = val;

		if (this.valChangeCallback) {

			this.valChangeCallback(val);
		}
	}

	getValue() {
		const minMax = this.getMinMaxValue();
		return this.value * (minMax.max - minMax.min) + minMax.min;
	}

	getReadyValue() {
		return parseFloat(this.getValue().toFixed(this.decimals));
	}

	onRangeClick(e) {

		const sliderHeight = 100;

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

		const sliderHeight = 100;

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

		const sliderHeight = 100;

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