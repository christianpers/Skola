import GraphicsParamHelpers from '../../graphicNodes/Helpers/ParamHelpers';

export default class AvailableConnections{
	constructor() {
		this.collectedInputs = [];
	}

	showAvailable(outputNode, nodes, nodeConnections, outputType) {
		// const filteredNodes = outputNode.isGraphicsNode ?
		// 	nodes.filter(t => t.isGraphicsNode && t.ID !== outputNode.ID) :
		// 	nodes.filter(t => !t.isGraphicsNode && t.ID !== outputNode.ID);

		// const filteredNodes = nodes.map(t => t);
		const expandedNodes = nodes.filter(t => outputNode.ID !== t.ID);
		// this.collapsedNodes = nodes.filter(t => t.isCollapsed && outputNode.ID !== t.ID);

		// for (let i = 0; i < this.collapsedNodes.length; i++) {
		// 	this.collapsedNodes[i].setAsDisabled();
		// }

		// this.collectedInputs = [];
		// for (let i = 0; i < expandedNodes.length; i++) {
		// 	const node = expandedNodes[i];
		// 	const obj = {node: node, inputs: [], params: []};
		// 	if (node.input) {
		// 		obj.inputs.push(node.input);
		// 	} else if (node.inputs) {
		// 		for (const key in node.inputs) {
		// 			obj.inputs.push(node.inputs[key]);
		// 		}
		// 	}

		// 	for (const key in node.inputParams) {
		// 		obj.params.push(node.inputParams[key]);
		// 	}

		// 	this.collectedInputs.push(obj);
		// }

		this.collectedInputs = [];
		for (let i = 0; i < expandedNodes.length; i++) {
			const node = expandedNodes[i];
			const obj = { node };
			// if (node.input) {
			// 	obj.inputs.push(node.input);
			// } else if (node.inputs) {
			// 	for (const key in node.inputs) {
			// 		obj.inputs.push(node.inputs[key]);
			// 	}
			// }

			// for (const key in node.inputParams) {
			// 	obj.params.push(node.inputParams[key]);
			// }

			this.collectedInputs.push(obj);
		}

		for (let i = 0; i < this.collectedInputs.length; i++) {
			// const inputs = this.collectedInputs[i].inputs;
			const inputs = [];
			// const params = this.collectedInputs[i].params;
			const inNode = this.collectedInputs[i].node;
			const paramContainers = inNode.isModifier ? [] : inNode.nodeType.paramContainers;

			// console.log(paramContainers);

			if (inNode.isGraphicsNode) {
				for (let q = 0; q < inputs.length; q++) {
					const input = inputs[q];
					if (!inNode.inputHelpersType.isValid(outputNode, inNode, input.inputType, outputType)) {

						input.activatePossible();
					}
				}
				for (let q = 0; q < paramContainers.length; q++) {
					const paramContainer = paramContainers[q];
					// console.log(paramContainer);
					if (!paramContainer.isAvailableForConnection(outputNode, inNode)) {
						paramContainer.setAsDisabled();
					}

				}
				// for (let q = 0; q < params.length; q++) {
				// 	const param = params[q];
				// 	if (!GraphicsParamHelpers[param.param.paramHelpersType].isValid(outputNode, inNode, param.param)) {
				// 		param.activatePossible();
				// 	}
				// }
			} else {
				for (let q = 0; q < inputs.length; q++) {
					const input = inputs[q];
					if (!inNode.inputHelpersType.isValid(outputNode, inNode, undefined, nodeConnections, outputType)) {

						input.activatePossible();
					}
				}
				for (let q = 0; q < params.length; q++) {
					const param = params[q];
					if (!param.param.helper.isValid(outputNode, inNode, param.param, nodeConnections)) {
						param.activatePossible();
					}
				}
				// if (param && param.helper) {
				// 	if (!param.helper.isValid(this.outputActiveNode, inputNode, param, this._nodeConnections)) {
				// 		this.resetConnecting();
				// 		return;
				// 	}
				// } else {
				// 	if (!inputNode.inputHelpersType.isValid(this.outputActiveNode, inputNode, param, this._nodeConnections)) {
				// 		this.resetConnecting();
				// 		return;
				// 	}
				// }
			}

			
		}
	}

	resetAvailable() {

		// for (let i = 0; i < this.collapsedNodes.length; i++) {
		// 	this.collapsedNodes[i].setAsEnabled();
		// }

		for (let i = 0; i < this.collectedInputs.length; i++) {
			const inputs = this.collectedInputs[i].inputs;
			const params = this.collectedInputs[i].params;
			const inNode = this.collectedInputs[i].node;
			const paramContainers = inNode.isModifier ? [] : inNode.nodeType.paramContainers;

			for (let q = 0; q < paramContainers.length; q++) {
				const paramContainer = paramContainers[q];
				paramContainer.setAsEnabled();
			}

			// for (let q = 0; q < inputs.length; q++) {
			// 	const input = inputs[q];
			// 	input.deactivatePossible();
			// }

			// for (let q = 0; q < params.length; q++) {
			// 	const param = params[q];
			// 	param.deactivatePossible();
			// }
		}
	}
}