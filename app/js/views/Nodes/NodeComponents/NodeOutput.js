export default class NodeOutput{
	constructor(parentEl, onClickCallback) {

		this.isActive = false;
		this.onClickCallback = onClickCallback;

		this.parentEl = parentEl;

		this.el = document.createElement('div');
		this.el.className = 'node-output node-component';

		this.parentEl.appendChild(this.el);

		this.onClickBound = this.onClick.bind(this);

		this.el.addEventListener('click', this.onClickBound);
	}

	onClick(e) {
		
		this.el.classList.add('selected');

		this.onClickCallback();


	}

	enable() {
		this.isActive = true;

		this.el.classList.add('active');
		this.el.classList.remove('selected');
	}

	disable() {
		this.isActive = false;

		this.el.classList.remove('active');
	}
}