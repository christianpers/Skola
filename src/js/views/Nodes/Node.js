import NodeOutput from './NodeComponents/NodeOutput';
import NodeInput from './NodeComponents/NodeInput';
import NodeRemove from './NodeComponents/NodeRemove';
import NodeCollapsedParam from './NodeComponents/NodeCollapsedParam';

export default class Node{
	constructor() {

		this.hasOutput = true;
		this.isGraphicsNode = false;
		this.isLightNode = false;
		this.hasGraphicsInput = false;
		this.needsUpdate = false;
		this.hasMultipleOutputs = false;
		this.initAsNotCollapsed = false;

		this.outDotPos = undefined;
		this.inDotPos = undefined;

		this.isCollapsed = false;

		this.nodeCollapsedParam = null;
	}

	init(pos, parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onNodeRemove) {

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

		const hasInput = !this.isParam && this.hasAudioInput || this.hasGraphicsInput;

		if (hasInput && !this.isCanvasNode) {
			this.input = new NodeInput(this.bottomPartEl, this.onInputClickBound, this.isGraphicsNode);
		}
		
		if (this.hasOutput && !this.hasMultipleOutputs) {
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
				x: this.initNodeConfig ? nodeConfig.pos[0] : pos.x,
				y: this.initNodeConfig ? nodeConfig.pos[1] : pos.y,
			}
		};

		this.el.style[window.NS.transform] = `translate3d(${this.moveCoords.offset.x}px, ${this.moveCoords.offset.y}px, 0)`;

		const optionWrapper = document.createElement('div');
		optionWrapper.className = 'node-top-options';

		this.el.appendChild(optionWrapper);

		// Collapsed View
		if (!this.initAsNotCollapsed) {
			this.onToggleCollapseBound = this.onToggleCollapse.bind(this);
			this.toggleCollapseView = document.createElement('div');
			this.toggleCollapseView.className = 'node-toggle-collapse';
			
			this.toggleCollapseLabel = document.createElement('h5');
			
			this.toggleCollapseView.appendChild(this.toggleCollapseLabel);

			optionWrapper.appendChild(this.toggleCollapseView);

			this.toggleCollapseView.addEventListener('click', this.onToggleCollapseBound);

			this.onToggleCollapse();
		}

		this.remove = new NodeRemove(optionWrapper, this.onRemoveClickBound);

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);
	}

	postInit() {
		const inputParamsArr = Object.keys(this.inputParams);
		if (inputParamsArr.length > 0) {
			this.collapsedParam = new NodeCollapsedParam(this.topPartEl, inputParamsArr[inputParamsArr.length-1].el, inputParamsArr.length);
		}
		
	}

	onToggleCollapse() {
		if (this.isCollapsed) {
			this.topPartEl.classList.remove('hide');
			this.toggleCollapseLabel.innerHTML = 'Minimera';
			this.isCollapsed = false;
			// for (const key in this.inputParams) {
			// 	this.inputParams[key].removeCollapsed();
			// }
		} else {
			this.topPartEl.classList.add('hide');
			this.toggleCollapseLabel.innerHTML = 'Expandera';
			this.isCollapsed = true;

			// for (const key in this.inputParams) {
			// 	this.inputParams[key].setAsCollapsed();
			// }
		}
	}

	getOutputPos() {
		const obj = {
			x: this.output.el.offsetLeft,
			y: this.output.el.offsetTop,
		};

		return obj;
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

	getOutputEl() {
		return this.output;
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

	setAsDisabled() {
		this.el.style.opacity = .1;
	}

	setAsEnabled() {
		this.el.style.opacity = 1;
	}

	onOutputClick(clickPos) {

		this.onConnectingCallback(this, clickPos);
	}

	onInputClick(param) {

		this.onInputConnectionCallback(this, 'main', param);
	}

	removeFromDom() {
		this.el.removeEventListener('mousedown', this.onMouseDownBound);
		if (this.toggleCollapseView) {
			this.toggleCollapseView.removeEventListener('click', this.onToggleCollapseBound);
		}
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

		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);
	}
}