export default class InputComponent{
	constructor(parentEl, name, inputSettings, callback ) {
		this.callback = callback;
		const container = document.createElement('div');
		container.className = `${name}-container settings-container`;

		const label = document.createElement('h4');
		label.className = `${name}-label settings-label`;
		label.innerHTML = `${name}`;

		this.regExp = /^((-)?(0|([1-9][0-9]*))(\.[0-9]+)?)$/;

		container.appendChild(label);

		this.onChangeBound = this.onChange.bind(this);

		this.el = document.createElement('input');
		this.el.type = 'number';
		this.el.value = inputSettings.value;
		this.el.step = inputSettings.step;
		this.el.min = inputSettings.min;
		this.el.max = inputSettings.max;
		this.el.addEventListener('change', this.onChangeBound);

		container.appendChild(this.el);

		parentEl.appendChild(container);
	}

	isValidInput(value) {
		if (!this.regExp.test(value)) {
			return false;
		}

		return true;
	}

	onChange(e) {
		const value = Number(this.el.value);

		if (this.isValidInput(value)) {
			this.callback(value);
		} else {
			this.el.value = 0;
		}
	}

	remove() {

		this.el.removeEventListener('change', this.onChangeBound);
	}
}