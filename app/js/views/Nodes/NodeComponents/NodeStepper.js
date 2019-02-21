export default class NodeStepper{
	constructor(parentEl, settings, initValue, onChangeCallback) {

		this.settings = settings;
		this.onChangeCallback = onChangeCallback;

		this.regExp = /^[0-9]*$/;

		this.value = initValue;

		this.onInputChangeBound = this.onInputChange.bind(this);

		this.plusEl = document.createElement('div');
		this.plusEl.className = 'node-stepper-control plus';
		this.plusEl.innerHTML = '+';
		this.plusEl.addEventListener('click', () => {
			this.onStepperChange(true);
		});

		this.minusEl = document.createElement('div');
		this.minusEl.className = 'node-stepper-control minus';
		this.minusEl.innerHTML = '-';
		this.minusEl.addEventListener('click', () => {
			this.onStepperChange(false);
		});

		this.inputEl = document.createElement('input');
		this.inputEl.className = 'node-stepper-input';
		this.inputEl.value = initValue;

		this.inputSetButton = document.createElement('h4');
		this.inputSetButton.className = "input-set-button";
		this.inputSetButton.innerHTML = 'OK';
		this.inputSetButton.addEventListener('click', this.onInputChangeBound);

		this.el = document.createElement('div');
		this.el.className = 'node-stepper';

		const leftContainer = document.createElement('div');
		leftContainer.className = 'left-container';

		leftContainer.appendChild(this.plusEl);
		leftContainer.appendChild(this.minusEl);

		const label = document.createElement('h4');
		label.className = 'label';
		label.innerHTML = settings.label;

		const controlWrapper = document.createElement('div');
		controlWrapper.className = 'control-wrapper';

		controlWrapper.appendChild(leftContainer);
		controlWrapper.appendChild(this.inputEl);
		controlWrapper.appendChild(this.inputSetButton);

		this.el.appendChild(label);
		
		this.el.appendChild(controlWrapper);

		parentEl.appendChild(this.el);
	}

	isValidInput(value) {
		if (!this.regExp.test(value)) {
			return false;
		} else if (value < this.settings.min || value > this.settings.max) {
			return false;
		}

		return true;
	}

	onInputChange(e) {

		const value = Number(this.inputEl.value);

		if (this.isValidInput(value)) {
			this.onChangeCallback(value);
			this.value = value;
		}

		this.inputEl.value = this.value;
	}

	onStepperChange(isAdd) {
		
		const newVal = isAdd ? this.value + 1 : this.value - 1;
		if (this.isValidInput(newVal)) {
			this.onChangeCallback(newVal);
			this.value = newVal;
			this.inputEl.value = this.value;
		} 
	}
}