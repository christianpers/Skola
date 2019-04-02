export default class NodeCollapsedParam{
	constructor(parentEl, offsetEl, amountParams) {

		this.el = document.createElement('div');
		this.el.className = 'node-param node-component collapsed-param';

		const dotEl = document.createElement('div');
		dotEl.className = 'dot';

		this.el.appendChild(dotEl);

		const labelEl = document.createElement('p');
		
		labelEl.className = 'label';
		labelEl.innerHTML = `${amountParams} parametrar`;
		
		this.el.appendChild(labelEl);

		parentEl.insertBefore(this.el, offsetEl);

		this.offsetLeft = undefined;
		this.offsetTop = undefined;
	}

	getOffsetLeft() {
		if (!this.offsetLeft) {
			this.offsetLeft = this.el.offsetLeft;
		}

		return this.offsetLeft;
	}

	getOffsetTop() {
		if (!this.offsetTop) {
			this.offsetTop = this.el.offsetTop;
		}

		return this.offsetTop;
	}

	enable() {
		this.el.classList.add('active');
	}

	disable() {
		this.el.classList.remove('active');
	}

}