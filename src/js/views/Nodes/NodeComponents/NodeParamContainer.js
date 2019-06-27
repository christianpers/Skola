import NodeParam from './NodeParam';
import GraphicsParamHelpers from '../../../graphicNodes/Helpers/ParamHelpers';

export default class NodeParamContainer{
	constructor(parentEl, index, paramObj, node) {

		this.el = document.createElement('div');
		this.el.className = `node-param-container angle-${index}`;

		this.pos = new THREE.Vector2();

		this.ID = Math.random().toString(36).substr(2, 9);

		this.onConnectionUpdateBound = this.onConnectionUpdate.bind(this);

		document.documentElement.addEventListener('node-connections-update', this.onConnectionUpdateBound);

		this.node = node;
		this.index = index - 2;
		this.nodeID = node.ID;
		this.paramObj = paramObj;
		this.inputParams = [];
		this.isDisabledForConnection = false;

		this.connectedNodes = [];

		this.el.style.transform = `rotate(${(this.index) * 40}deg)`;

		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("width", "40px");
		svg.setAttribute("height", "40px");
		svg.setAttribute("viewBox", "0 0 24 24");

		const shape = `M23.677 18.52c.914 1.523-.183 3.472-1.967 3.472h-19.414c-1.784 0-2.881-1.949-1.967-3.472l9.709-16.18c.891-1.483 3.041-1.48 3.93 0l9.709 16.18z`;

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", shape);

		svg.appendChild(path);

		this.connectionPlaceHolder = svg;

		this.el.appendChild(this.connectionPlaceHolder);

		this.paramContainer = document.createElement('div');
		this.paramContainer.className = 'inner-param-container';

		const parentLabel = document.createElement('h5');
		parentLabel.innerHTML = paramObj.parent;

		this.paramContainer.appendChild(parentLabel);

		this.detailParamContainer = document.createElement('div');
		this.detailParamContainer.className = 'detail-param-container';

		this.el.appendChild(this.paramContainer);
		this.el.appendChild(this.detailParamContainer);
		parentEl.appendChild(this.el);

		this.currentModifierChildren = [];

		for (let q = 0; q < paramObj.children.length; q++) {
			const param = new NodeParam(this.detailParamContainer, paramObj.children[q], this);
			this.inputParams[paramObj.children[q].title] = param;
		}


	}

	getPos() {
		const rect = this.connectionPlaceHolder.getBoundingClientRect();
		this.pos.set(rect.x + rect.width / 2, rect.y + rect.height / 2);
		return this.pos;
	}

	getCleanPos() {
		return this.connectionPlaceHolder.getBoundingClientRect();
	}

	addModifierAsChild(modifier) {
		console.log(this.pos);
		// this.el.appendChild(modifier.node.el);
		this.currentModifierChildren.push({id: modifier.node.ID, modifier});
	}

	removeModifierAsChild(id) {
		const modifier = this.currentModifierChildren.find(t => t.id === id);
		if (modifier.modifier) {
			this.currentModifierChildren.filter(t => t.id !== id);
		}
	}

	isAvailableForConnection(outputNode, inNode) {
		
		const keys = Object.keys(this.inputParams);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const param = this.inputParams[key];
			if (GraphicsParamHelpers[param.param.paramHelpersType].isValid(outputNode, inNode, param.param)) {
				// param.activatePossible();
				return true;

			}
		}
		return false;
	}

	setAsEnabled() {
		this.el.style.opacity = 1;
		this.isDisabledForConnection = false;
	}

	setAsDisabled() {
		this.el.style.opacity = 0.1;
		this.isDisabledForConnection = true;
	}

	// addConnectedNode(node) {
	// 	this.connectedNodes.push(node);
	// }

	// removeConnectedNode(node) {
	// 	this.connectedNodes = this.connectedNodes.filter(t => t.ID !== node.ID);
	// }

	onConnectionUpdate(e) {
		const connections = e.detail;

		const nodeConnections = this.node.ID in connections ? connections[this.node.ID] : [] ;
		const paramContainerConnections = nodeConnections.filter(t => t.paramContainerID === this.ID);

		this.connectedNodes = [];

		for (let i = 0; i < paramContainerConnections.length; i++) {
			const nodeID = paramContainerConnections[i].outNodeID;
			const node = window.NS.singletons.ConnectionsManager.nodes[nodeID];
			this.connectedNodes.push(node);
		}
	}


}