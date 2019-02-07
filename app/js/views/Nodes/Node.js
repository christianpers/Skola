import NodeOutput from './NodeComponents/NodeOutput';
import NodeInput from './NodeComponents/NodeInput';
import NodeRemove from './NodeComponents/NodeRemove';

export default class Node{
	constructor() {

		this.hasOutput = true;
		this.isGraphicsNode = false;
		this.hasGraphicsInput = false;

		this.outDotPos = undefined;
		this.inDotPos = undefined;
	}

	init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onNodeRemove) {

		this.initNodeConfig = !!nodeConfig;

		this.ID = this.initNodeConfig ? nodeConfig.id : '_' + Math.random().toString(36).substr(2, 9);
		this.onConnectingCallback = onConnectingCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.hasActiveInput = false;
		this.type = type;
		this.onNodeActive = onNodeActive;
		this.onNodeRemove = onNodeRemove;
		
		this.parentEl = parentEl;

		this.lastDelta = {x: 0, y: 0};

		const typeEl = document.createElement('h4');
		typeEl.innerHTML = this.type;
		typeEl.className = 'node-type';

		this.el.appendChild(typeEl);

		this.parentEl.appendChild(this.el);

		this.onOutputClickBound = this.onOutputClick.bind(this);
		this.onInputClickBound = this.onInputClick.bind(this);
		this.onRemoveClickBound = this.onRemoveClick.bind(this);

		this.remove = new NodeRemove(this.topPartEl, this.onRemoveClickBound);

		const hasInput = !this.isParam && this.hasAudioInput || this.hasGraphicsInput;

		if (hasInput && !this.isCanvasNode) {
			this.input = new NodeInput(this.bottomPartEl, this.onInputClickBound, this.isGraphicsNode);
		}
		
		if (this.hasOutput) {
			this.output = new NodeOutput(
				this.bottomPartEl,
				this.onOutputClickBound,
				this.isParam,
				hasInput,
				this.isSpeaker,
				this.isGraphicsNode,
			);
		}
		
		this.moveCoords = {
			start: {
				x: 0,
				y: 0
			},
			offset: {
				x: this.initNodeConfig ? nodeConfig.pos[0] : parentEl.clientWidth / 2 - 100 * Math.random(),
				y: this.initNodeConfig ? nodeConfig.pos[1] : parentEl.clientHeight / 2 - 50 * Math.random(),
			}
		};

		this.el.style[window.NS.transform] = `translate3d(${this.moveCoords.offset.x}px, ${this.moveCoords.offset.y}px, 0)`;

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);
	}

	getOutDotPos(el) {
		if (!this.inDotPos) {
			this.inDotPos = el.getBoundingClientRect();
		}

		return this.inDotPos;
	}

	getInDotPos(el) {
		if (!this.outDotPos) {
			this.outDotPos = el.getBoundingClientRect();
		}

		return this.outDotPos;
	}

	onRemoveClick() {
		this.onNodeRemove(this);
	}

	activateDrag() {
		this.el.addEventListener('mousedown', this.onMouseDownBound);
	}

	getInputEl() {
		return this.input;
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

	enableInput(param) {
		if (this.input) {
			this.input.enable();
		}
	}

	disableInput() {
		if (this.input){
			this.input.disable();
		}
	}

	onOutputClick(clickPos) {

		this.onConnectingCallback(this, clickPos);
	}

	onInputClick(param) {

		this.onInputConnectionCallback(this, 'main', param);
	}

	removeFromDom() {
		this.el.removeEventListener('mousedown', this.onMouseDownBound);
		this.parentEl.removeChild(this.el);
	}

	onMouseDown(e) {

		if (e.target.nodeName === 'INPUT' || e.target.classList.contains('prevent-drag')) {
			return;
		}

		e.stopPropagation();
		e.preventDefault();

		this.moveCoords.start.x = e.x - this.moveCoords.offset.x;
		this.moveCoords.start.y = e.y - this.moveCoords.offset.y;

		this.lastDelta.x = 0;
		this.lastDelta.y = 0;

		window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);
	}

	onMouseMove(e) {

		const deltaX = e.x - this.moveCoords.start.x;
		const deltaY = e.y - this.moveCoords.start.y;

		this.moveCoords.offset.x = deltaX;
		this.moveCoords.offset.y = deltaY;

		this.lastDelta.x = deltaX;
		this.lastDelta.y = deltaY;

		this.el.style[window.NS.transform] = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
	}

	onMouseUp(e) {

		// if (this.output && this.output.el) {
		// 	if ((e.target.parentNode !== this.output.el) && (Math.abs(this.lastDelta.x) < 2 && Math.abs(this.lastDelta.y) < 2)) {
		// 		// if (this.onNodeActive) {
		// 		// 	this.onNodeActive(this);
		// 		// }
				
		// 	}
		// }

		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);
	}
}