import './index.scss';

export default class InputComponent{
	constructor(parentEl, name, inputSettings, callback, disabled, hideMinMax, callbackOnChange) {
		this.callback = callback;
		const container = document.createElement('div');
		container.className = `input-setting`;

		const label = document.createElement('h4');
		label.className = `input-label`;
		label.innerHTML = `${name}`;

		this._name = name;

		const minLabel = document.createElement('h4');
		minLabel.className = 'range';
		minLabel.innerHTML = `Min: ${inputSettings.min}`;

		const maxLabel = document.createElement('h4');
		maxLabel.className = 'range';
		maxLabel.innerHTML = `Max: ${inputSettings.max}`;

		this.regExp = /^((-)?(0|([1-9][0-9]*))(\.[0-9]+)?)$/;

		container.appendChild(label);
		if (!hideMinMax) {
			container.appendChild(minLabel);
			container.appendChild(maxLabel);
		}
		

		this.onChangeBound = this.onChange.bind(this);

		this._callbackOnChange = callbackOnChange;

		this.el = document.createElement('input');
		this.el.type = 'number';
		this.el.value = inputSettings.value;
		this.el.step = inputSettings.step;
		this.el.min = inputSettings.min;
		this.el.max = inputSettings.max;
		this.el.addEventListener('input', this.onChangeBound);

		this.el.addEventListener('click', (e) => {
			e.stopPropagation();
		});

		this.el.addEventListener('blur', () => {
			console.log('blur');
		});

		this.onApplyBound = this.onApply.bind(this);
		this.applyBtn = document.createElement('button');
		this.applyBtn.innerHTML = 'OK';
		this.applyBtn.addEventListener('click', this.onApplyBound);
		this.applyBtn.classList.add('apply-btn');

		this.disabledLayer = document.createElement('div');
		this.disabledLayer.className = 'disabled-layer';

		if (disabled) {
			this.hide();
		}

		container.appendChild(this.el);
		container.appendChild(this.applyBtn);
		container.appendChild(this.disabledLayer);

		parentEl.appendChild(container);
	}

	onApply(e) {
		e.stopPropagation();
		const value = Number(this.el.value);
		if (this.isValidInput(value)) {
			this.callback(value, this._name);
		} else {
			this.el.value = this.el.min;
		}
	}

	isValidInput(value) {
		if (!this.regExp.test(value)) {
			return false;
		}

		if (value < this.el.min || value > this.el.max) {
			return false;
		} 
		return true;
	}

	onChange(e) {
		const value = Number(this.el.value);

		if (!this.isValidInput(value)) {
			// this.callback(value);
			this.el.value = this.el.min;

			return;
		}

		if (this._callbackOnChange) {
			this._callbackOnChange(value, this._name);
		}

		
	}

	setValue(val) {
		this.el.value = val;
	}

	getValue() {
		return this.el.value;
	}

	remove() {
		this.el.removeEventListener('change', this.onChangeBound);
	}

	hide() {
		this.disabledLayer.classList.add('visible');
	}

	show() {
		this.disabledLayer.classList.remove('visible');
	}
}