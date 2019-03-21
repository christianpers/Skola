export default class NodeParam{
	constructor(parentEl, param, onClickCallback, parentTitle) {

		this.el = document.createElement('div');
		this.el.className = 'node-param node-component';

		this.param = param;

		const dotEl = document.createElement('div');
		dotEl.className = 'dot';

		this.el.appendChild(dotEl);

		const labelEl = document.createElement('p');
		
		labelEl.className = 'label';
		labelEl.innerHTML = param.param;
		
		this.el.appendChild(labelEl);

		parentEl.appendChild(this.el);

		this.el.addEventListener('click', (e) => {
			console.log('param click');
			e.preventDefault();
			e.stopPropagation();
			onClickCallback(param);
		});

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

	activatePossible() {
		this.el.classList.add('not-possible');
	}

	deactivatePossible() {
		this.el.classList.remove('not-possible');
	}
}