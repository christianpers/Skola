import NodeOutput from './NodeComponents/NodeOutput';
import NodeInput from './NodeComponents/NodeInput';

export default class Node{
	constructor() {

		this.el = document.createElement('div');
		this.el.className = 'node';
	}

	init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive) {

		this.initNodeConfig = !!nodeConfig;

		this.ID = this.initNodeConfig ? nodeConfig.id : '_' + Math.random().toString(36).substr(2, 9);
		this.onConnectingCallback = onConnectingCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.hasActiveInput = false;
		this.type = type;
		this.onNodeActive = onNodeActive;

		this.parentEl = parentEl;

		const typeEl = document.createElement('h4');
		typeEl.innerHTML = this.type;
		typeEl.className = 'node-type';

		this.el.appendChild(typeEl);

		this.parentEl.appendChild(this.el);

		this.onOutputClickBound = this.onOutputClick.bind(this);
		this.onInputClickBound = this.onInputClick.bind(this);

		this.output = new NodeOutput(this.el, this.onOutputClickBound);
		this.input = new NodeInput(this.el, this.onInputClickBound);

		this.moveCoords = {
			start: {
				x: 0,
				y: 0
			},
			offset: {
				x: this.initNodeConfig ? nodeConfig.pos[0] : 0,
				y: this.initNodeConfig ? nodeConfig.pos[1] : 0,
			}
		};

		this.el.style[window.NS.transform] = `translate3d(${this.moveCoords.offset.x}px, ${this.moveCoords.offset.y}px, 0)`;

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);

		this.el.addEventListener('mousedown', this.onMouseDownBound);

	}

	getConnectNode() {
		return this;
	}

	enableOutput() {
		this.output.enable();
	}

	disableOutput() {
		this.output.disable();
	}

	enableInput() {
		this.input.enable();
	}

	disableInput() {
		this.input.disable();
	}

	onOutputClick() {

		this.onConnectingCallback(this);
	}

	onInputClick() {

		this.onInputConnectionCallback(this);
	}

	remove() {
		this.el.removeEventListener('mousedown', this.onMouseDownBound);
		this.parentEl.removeChild(this.el);
	}

	onMouseDown(e) {

		e.stopPropagation();
		e.preventDefault();



		// console.log('mouse down', e);

		this.moveCoords.start.x = e.x - this.moveCoords.offset.x;
		this.moveCoords.start.y = e.y - this.moveCoords.offset.y;

		window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);
	}

	onMouseMove(e) {

		const deltaX = e.x - this.moveCoords.start.x;
		const deltaY = e.y - this.moveCoords.start.y;

		this.moveCoords.offset.x = deltaX;
		this.moveCoords.offset.y = deltaY;

		this.el.style[window.NS.transform] = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
	}

	onMouseUp(e) {

		this.onNodeActive(this);

		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);
	}
}