import NodeOutput from './NodeComponents/NodeOutput';
import NodeInput from './NodeComponents/NodeInput';
import NodeRemove from './NodeComponents/NodeRemove';
import NodeCollapsedParam from './NodeComponents/NodeCollapsedParam';
import NonagonType from './NodeTypes/NonagonType';
import TriangleType from './NodeTypes/TriangleType';

export default class Node{
	constructor() {

		this.hasOutput = true;
		this.isGraphicsNode = false;
		this.isLightNode = false;
		this.hasGraphicsInput = false;
		this.needsUpdate = false;
		this.hasMultipleOutputs = false;
		this.returnsSingleNumber = false;

		this.onConnectionAddBound = this.onConnectionAdd.bind(this);
		this.onConnectionRemoveBound = this.onConnectionRemove.bind(this);

		document.documentElement.addEventListener('param-connections-add', this.onConnectionAddBound);
		document.documentElement.addEventListener('param-connections-remove', this.onConnectionRemoveBound);
	}

	init(
		pos,
		parentEl,
		onDisconnectCallback,
		onInputConnectionCallback,
		type,
		nodeConfig,
		onNodeActive,
		onNodeRemove,
		isModifier,
		onNodeDragStart,
		onNodeDragMove,
		onNodeDragRelease,
	) {

		this.initNodeConfig = !!nodeConfig;

		this.ID = this.initNodeConfig ? nodeConfig.id : '_' + Math.random().toString(36).substr(2, 9);
		this.onDisconnectCallback = onDisconnectCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.hasActiveInput = false;
		this.type = type;
		this.onNodeActive = onNodeActive;
		this.onNodeRemove = onNodeRemove;
		this.isModifier = isModifier;
		this.onNodeDragStart = onNodeDragStart;
		this.onNodeDragMove = onNodeDragMove;
		this.onNodeDragRelease = onNodeDragRelease;

		// this.title = isModifier ? `${type}-modifier` : `${type}-node`;

		this.connectedNodes = [];
		
		this.parentEl = parentEl;

		this.lastDelta = {x: 0, y: 0};

		if (!this.isCanvasNode) {
			this.nodeType = isModifier
				? new TriangleType(this.el, this.params, this) : new NonagonType(this.el, this.params, this);
			
			const typeStr = this.type;

			const title = this.isModifier ? `${typeStr}-modifier` : `${typeStr}-node`;


			const iconPath = `${title.replace(' ', '-').toLowerCase()}-icon`;

			console.log(iconPath);

			const iconImg = document.createElement('img');
			iconImg.src = `/assets/icons/${iconPath}.svg`;

			this.el.appendChild(iconImg);

			if (isModifier) {
				this.el.classList.add('modifier-node');
			}
		}
		
		this.parentEl.appendChild(this.el);

		

		// this.onOutputClickBound = this.onOutputClick.bind(this);
		// this.onInputClickBound = this.onInputClick.bind(this);
		this.onRemoveClickBound = this.onRemoveClick.bind(this);

		// const hasInput = !this.isParam && this.hasAudioInput || this.hasGraphicsInput;

		// if (hasInput && !this.isCanvasNode) {
		// 	this.input = new NodeInput(this.bottomPartEl, this.onInputClickBound, this.isGraphicsNode);
		// }
		
		// if (this.hasOutput && !this.hasMultipleOutputs) {
		// 	this.output = new NodeOutput(
		// 		this.bottomPartEl,
		// 		this.onOutputClickBound,
		// 		this.isParam,
		// 		hasInput,
		// 		this.isSpeaker,
		// 		this.isGraphicsNode,
		// 	);
		// }
		
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

		// const optionWrapper = document.createElement('div');
		// optionWrapper.className = 'node-top-options';

		// this.el.appendChild(optionWrapper);

		// Collapsed View
		// if (!this.initAsNotCollapsed) {
		// 	this.onToggleCollapseBound = this.onToggleCollapse.bind(this);
		// 	this.toggleCollapseView = document.createElement('div');
		// 	this.toggleCollapseView.className = 'node-toggle-collapse';
			
		// 	this.toggleCollapseLabel = document.createElement('h5');
			
		// 	this.toggleCollapseView.appendChild(this.toggleCollapseLabel);

		// 	optionWrapper.appendChild(this.toggleCollapseView);

		// 	this.toggleCollapseView.addEventListener('click', this.onToggleCollapseBound);

		// 	this.onToggleCollapse();
		// }

		// this.remove = new NodeRemove(optionWrapper, this.onRemoveClickBound);

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);
	}

	onConnectionAdd(e) {
		console.log('node on connection add: ', e.detail, e.type, this.ID);

		
	}

	onConnectionRemove(e) {
		console.log('node on connection remove: ', e.detail, e.type, this.ID);

	}

	setAsChildToParamContainer(paramContainer) {
		paramContainer.el.appendChild(this.el);
		this.el.style[window.NS.transform] = 'initial';
		this.onInputConnectionCallback(this, paramContainer);
	}

	setAsNotChildToParamContainer(paramContainer, e) {
		this.onDisconnectCallback(this, paramContainer);
		const pos = paramContainer.getCleanPos();
		this.parentEl.appendChild(this.el);
		const nodeBoundingRect = paramContainer.node.el.getBoundingClientRect();
		
		const offsetX = pos.x - nodeBoundingRect.x;
		const offsetY = pos.y - nodeBoundingRect.y;
		this.moveCoords.start.x = e.x - (paramContainer.node.moveCoords.offset.x + offsetX);
		this.moveCoords.start.y = e.y - (paramContainer.node.moveCoords.offset.y + offsetY);
	}

	getParamContainers() {
		return this.nodeType.paramContainers;
	}

	enableOutput(param, connection) {
		console.log('enable output');
		// super.enableOutput();

		this.currentOutConnections.push(connection);
		this.currentOutConnectionsLength = this.currentOutConnections.length;
	}

	disableOutput(paramID) {
		const tempOutConnections = this.currentOutConnections.map(t => t);

        let paramConnections = tempOutConnections.filter(t => t.paramID);
        let nodeConnections = tempOutConnections.filter(t => !t.paramID);

        if (paramID) {
            paramConnections = paramConnections.filter(t => t.paramID && (t.paramID !== paramID));
        } else {
            nodeConnections = nodeConnections.filter(t => t.in.ID !== nodeIn.ID);
        }
        
        const finalConnections = paramConnections.concat(nodeConnections);
        this.currentOutConnections = finalConnections;
        this.currentOutConnectionsLength = this.currentOutConnections.length;

        // if (this.currentOutConnectionsLength <= 0) {
        //     super.disableOutput();

        // }
	}

	onRemoveClick() {
		this.onNodeRemove(this);
	}

	activateDrag() {
		this.el.addEventListener('mousedown', this.onMouseDownBound);
	}


	getConnectNode() {
		return this;
	}


	setAsDisabled() {
		this.el.style.opacity = .1;
	}

	setAsEnabled() {
		this.el.style.opacity = 1;
	}

	// onOutputClick(clickPos) {
	// 	this.onConnectingCallback(this, clickPos);
	// }

	// onInputClick(param) {
	// 	this.onInputConnectionCallback(this, 'main', param);
	// }

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

		// console.log(e.x, e.y);

		this.lastDelta.x = 0;
		this.lastDelta.y = 0;

		if (this.isModifier) {
			this.onNodeDragStart(this, e);
		}

		console.log('mouse down', this.moveCoords.start);

		

		// if (this.nodeType.paramContainers) {
		// 	for (let i = 0; i < this.nodeType.paramContainers.length; i++) {
		// 		const paramContainer = this.nodeType.paramContainers[i];
		// 		const connectedNodes = paramContainer.connectedNodes;
		// 		for (let q = 0; q < connectedNodes.length; q++) {
		// 			connectedNodes
		// 		}
		// 	}
		// }

		window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);
	}

	onMouseMove(e) {

		if (this.isModifier) {
			this.onNodeDragMove();
		}

		const deltaX = e.x - this.moveCoords.start.x;
		const deltaY = e.y - this.moveCoords.start.y;

		this.moveCoords.offset.x = deltaX;
		this.moveCoords.offset.y = deltaY;

		this.lastDelta.x = deltaX;
		this.lastDelta.y = deltaY;

		this.el.style[window.NS.transform] = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
	}

	onMouseUp(e) {
		if (this.isModifier) {
			this.onNodeDragRelease();
		}
		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);
	}
}