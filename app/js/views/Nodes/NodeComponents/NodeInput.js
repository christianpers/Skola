export default class NodeInput{
	constructor(parentEl, onClickCallback) {

		this.isActive = false;
		this.onClickCallback = onClickCallback;

		this.parentEl = parentEl;

		this.el = document.createElement('div');
		this.el.className = 'node-input node-component';

		const dotEl = document.createElement('div');
		dotEl.className = 'dot';

		this.el.appendChild(dotEl);

		const labelEl = document.createElement('p');
		labelEl.className = 'label';
		labelEl.innerHTML = 'Ljud in';

		this.el.appendChild(labelEl);

		this.parentEl.appendChild(this.el);

		this.onClickBound = this.onClick.bind(this);

		this.el.addEventListener('click', this.onClickBound);
	}

	onClick(e) {

		e.stopPropagation();
		e.preventDefault();

		this.onClickCallback();
	}

	enable() {
		this.isActive = true;

		this.el.classList.add('active');
		this.deactivatePossible();
	}

	disable() {
		this.isActive = false;

		this.el.classList.remove('active');
	}

	activatePossible() {
		this.el.classList.add('possible');
	}

	deactivatePossible() {
		this.el.classList.remove('possible');
	}
}