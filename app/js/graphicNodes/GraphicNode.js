import Node from '../views/Nodes/Node';
import Editor from '../views/Editor';
import NodeParam from '../views/Nodes/NodeComponents/NodeParam';
import NodeHeader from '../views/Nodes/NodeComponents/NodeHeader';

import ParamHelpers from './Helpers/ParamHelpers';
import InputHelpers from './Helpers/InputHelpers';

export default class GraphicNode extends Node{
	constructor() {
		super();

		this.params = {};
		this.inputParams = {};
		this.isForegroundNode = false;
		this.isBackgroundNode = false;

		this.currentOutConnections = [];
		this.currentOutConnectionsLength = 0;
		
		this.el = document.createElement('div');
		this.el.className = 'node';

		this.topPartEl = document.createElement('div');
		this.topPartEl.className = 'top-part';

		this.el.appendChild(this.topPartEl);

		this.bottomPartEl = document.createElement('div');
		this.bottomPartEl.className = 'bottom-part';

		this.el.appendChild(this.bottomPartEl);

		this.inputHelpersType = InputHelpers.general;

		this.isGraphicsNode = true;
		this.isRenderNode = false;
		this.canConnectToMaterial = false;
		this.isCanvasNode = false;

		this.dotPos = undefined;
	}

	init(
		parentEl,
		onConnectingCallback,
		onInputConnectionCallback,
		type,
		initData,
		onNodeActive,
		onNodeRemove,
	) {
		super.init(
			parentEl,
			onConnectingCallback,
			onInputConnectionCallback,
			type,
			initData,
			onNodeActive,
			onNodeRemove,
		);

		const paramParents = [];
		for (const key in this.params) {
			if (this.params[key].useAsInput && this.params[key].parent) {
				const parent = this.params[key].parent;
				if (!paramParents.some(t => t.parent === parent)) {
					const obj = {parent, children: []};
					paramParents.push(obj);
					obj.children.push(this.params[key]);
				} else {
					const obj = paramParents.find(t => t.parent === parent);
					obj.children.push(this.params[key]);
				}
			}
		}

		if (paramParents.length > 0) {
			for (let i = 0; i < paramParents.length; i++) {
				const obj = paramParents[i];
				const paramHeader = new NodeHeader(this.topPartEl, obj.parent, i > 0);
				for (let q = 0; q < obj.children.length; q++) {
					const param = new NodeParam(this.topPartEl, obj.children[q], this.onInputClickBound);
					this.inputParams[obj.children[q].title] = param;
				}
				
			}
		} else {
			for (const key in this.params) {
				if (this.params[key].useAsInput) {
					const param = new NodeParam(this.topPartEl, this.params[key], this.onInputClickBound);
					this.inputParams[this.params[key].title] = param;
				}
			}
		}

		this.activateDrag();
	}

	enableParam(param, connectionData) {
		const paramComponent = this.inputParams[param.title];
		param.isConnected = true;
		paramComponent.enable();

		ParamHelpers[param.paramHelpersType].update(this, connectionData.out, param);
	}

	updateParam(param, outNode) {
		ParamHelpers[param.paramHelpersType].update(this, outNode, param);
	}

	disableParam(param, connectionData) {
		const paramComponent = this.inputParams[param.title];
		param.isConnected = false;
		paramComponent.disable();

		ParamHelpers[param.paramHelpersType].disconnect(this, param, connectionData.out);
	}

	getDotPos(el) {
		
		if (!this.dotPos) {
			this.dotPos = el.getBoundingClientRect();
		}

		return this.dotPos;
	}

	setParamVal(val, key) {
		this.paramVals[key] = val;
	}

	onParameterUpdate() {
		const params = this.getParams();
	}

	getParams() {

		const params = {};
		for (const key in this.params) {
			const obj = this.params[key];
			params[obj.objSettings.param] = this.paramVals[obj.objSettings.param];
		}
		
		return params;
	}

	onResize() {

	}
}