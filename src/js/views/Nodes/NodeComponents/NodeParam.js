export default class NodeParam{
	constructor(parentEl, param, paramContainer) {

		this.el = document.createElement('div');
		this.el.className = 'node-param node-component';

		this.ID = Math.random().toString(36).substr(2, 9);

		this.param = param;

		this.isConnected = false;

		this.paramContainer = paramContainer;

		// const dotEl = document.createElement('div');
		// dotEl.className = 'dot';

		// this.el.appendChild(dotEl);

		const labelEl = document.createElement('p');
		
		labelEl.className = 'label';
		labelEl.innerHTML = param.param;
		
		this.el.appendChild(labelEl);

		parentEl.appendChild(this.el);

		window.NS.singletons.ConnectionsManager.addParam(this);

		// this.el.addEventListener('click', (e) => {
		// 	console.log('param click');
		// 	e.preventDefault();
		// 	e.stopPropagation();
		// 	onClickCallback(param);
		// });

		// this.offsetLeft = undefined;
		// this.offsetTop = undefined;
	}

	enable() {
		this.el.classList.add('active');
		this.isConnected = true;
	}

	disable() {
		this.el.classList.remove('active');
		this.isConnected = false;
	}

	activatePossible() {
		this.el.classList.add('not-possible');
	}

	deactivatePossible() {
		this.el.classList.remove('not-possible');
	}
}