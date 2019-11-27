export default class NodeParam{
	constructor(parentEl, param, paramContainer, ID) {

		this.el = document.createElement('div');
		this.el.className = 'node-param node-component';

		this.ID = ID;

		this.param = param;

		this.isConnected = false;

		this.connectionAllowed = true;

		this.paramContainer = paramContainer;

		this.labelEl = document.createElement('p');
		
		this.labelEl.className = 'label';
		this.labelEl.innerHTML = param.param;
		
		this.el.appendChild(this.labelEl);

		parentEl.appendChild(this.el);

		window.NS.singletons.ConnectionsManager.addParam(this);
	}

	enable() {
		this.el.classList.add('active');
		this.isConnected = true;
	}

	disable() {
		this.el.classList.remove('active');
		this.isConnected = false;
	}

	activateNotPossible() {
		this.el.classList.add('not-possible');
	}

	deactivateNotPossible() {
		this.el.classList.remove('not-possible');
	}

	setConnectionAllowed(isAllowed) {
		this.connectionAllowed = isAllowed;
	}
}