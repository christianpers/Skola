import Node from '../views/Nodes/Node';
import NodeRenderer from './NodeRenderer';
import GraphicsNodeManager from './GraphicsNodeManager';
import AudioNodeManager from './AudioNodeManager';
import NodeConnectionLine from './NodeConnectionLine';

import ParamHelpers from '../graphicNodes/Helpers/ParamHelpers';

export default class NodeManager{
	constructor(config, keyboardManager, onNodeActive, parentEl) {

		this.config = config;
		this.hasConfig = !!config;

		this.onNodeActiveCallback = onNodeActive;

		this.constructorIsDone = false;

		this.keyboardManager = keyboardManager;

		this._nodes = [];
		this._nodeConnections = [];
		this._graphicNodes = [];
		this._graphicNodeLength = 0;

		this.nodeConnectionRenderer = new NodeRenderer(parentEl, this);
		this.nodeConnectionLine = new NodeConnectionLine(this.nodeConnectionRenderer.el);

		this.isConnecting = false;

		this.outputActiveNode = null;

		this.onConnectingBound = this.onConnecting.bind(this);
		this.onInputConnectionBound = this.onInputConnection.bind(this);
		this.addBound = this.add.bind(this);
		this.onAudioNodeParamChangeBound = this.onAudioNodeParamChange.bind(this);
		this.onSequencerTriggerBound = this.onSequencerTrigger.bind(this);
		
		this.audioNodeManager = new AudioNodeManager(
			parentEl,
			this.onConnectingBound,
			this.onInputConnectionBound,
			this.addBound,
			this.hasConfig ? this.config.nodes : [],
			this.onAudioNodeParamChangeBound,
			onNodeActive,
			this.onSequencerTriggerBound,
		);
		this.audioNodeManager.init();

		this.onGraphicsParamChangeBound = this.onGraphicsParamChange.bind(this);

		this.graphicsNodeManager = new GraphicsNodeManager(
			parentEl,
			this.onConnectingBound,
			this.onInputConnectionBound,
			this.addBound,
			onNodeActive,
			this.onGraphicsParamChangeBound,
		);

		if (this.hasConfig) {
			for (let i = 0; i < this.config.connections.length; i++) {
				this.isConnecting = true;
				const outputNode = this._nodes.find(t => t.ID === this.config.connections[i].out);
				const inputNode = this._nodes.find(t => t.ID === this.config.connections[i].in);
				this.outputActiveNode = outputNode;
				this.onInputConnection(inputNode);
			}

			this.keyboardManager.onAudioNodeConnectionUpdate(this._nodeConnections);
		}

		this.constructorIsDone = true;
		// console.log(this._nodes);
		// this.graphicsNodeManager = new GraphicsNodeManager(document.body, this.onConnectingBound, this.onInputConnectionBound, this.addBound);

	}

	onSequencerTrigger(step, time) {
		this.keyboardManager.play(step, time);
	}

	onNodeAddedFromLibrary(type, data) {
		if (type === 'graphics') {
			this.graphicsNodeManager.createNode(data);
		} else {
			this.audioNodeManager.createNode(data);
		}
	}

	onGraphicsParamChange(node) {
		// const connection = this._nodeConnections.find(t => t.out.ID === node.ID);

		// if (!connection) {
		// 	return;
		// }

		// const param = connection.param;
		// connection.in.updateParam(param, connection.out);
	}

	onAudioNodeParamChange(node, params) {
		this.keyboardManager.onAudioNodeParamChange(node, params);
	}

	onConnecting(node, clickPos) {

		const outputHasConnection = this._nodeConnections.some(t => t.out.ID === node.ID);
		// if (outputHasConnection) {
		// 	this.removeConnection(this._nodeConnections.find(t => t.out.ID === node.ID));
		// 	return;
		// }

		console.log('on connecting');

		this.isConnecting = true;
		this.outputActiveNode = node;

		this.nodeConnectionLine.onConnectionActive(node, clickPos);

		/*
			create data node array
			create audio node array

			check if out is data or audio

			if data
				set not connected params as possible 

			if audio
				set not connected audio ins as possible
		*/

		const paramConnections = this._nodeConnections.filter(t => t.param);
		const audioConnections = this._nodeConnections.filter(t => !t.param);

		const otherNodes = this._nodes.filter((t) => t.ID !== node.ID && t.hasAudioInput);

		const dataNodes = otherNodes.filter(t => t.isParam);

		const getInputParams = (node) => {
			const params = [];
			for (const key in node.params) {
				if (node.params[key].useAsInput) {
					params.push(node.params[key]);
				}
			}

			return params;
		};

		const hasAvailableInputParams = (node) => {
			const nodeParamConnections = paramConnections.filter(t => t.in.ID === node.ID);

			const inputParams = getInputParams(node);

			const availableParams = [];
			for (let i = 0; i < inputParams.length; i++) {
				const inputParam = inputParams[i];
				if (!nodeParamConnections.some(t => t.param.objSettings.param === inputParam.objSettings.param)) {
					availableParams.push(inputParam);
					inputParam.canBeConnected = true;
				}
			}

			return availableParams.length > 0;

		};

		if (!this.outputActiveNode.isGraphicsNode) {
			const audioNodesWithInputParams = otherNodes.filter((t) => {
				return hasAvailableInputParams(t);
			});

			const notConnectedAudioInNodes = [];
			for (let i = 0; i < otherNodes.length; i++) {
				const node = otherNodes[i];
				if (!audioConnections.some(t => t.in.ID === node.ID) && !node.isParam) {
					notConnectedAudioInNodes.push(node);
				}
			}

			const nodesToLoop = node.isParam ? audioNodesWithInputParams : notConnectedAudioInNodes;

			for (let i = 0; i < nodesToLoop.length; i++) {
				nodesToLoop[i].canBeConnected = true;
			}
		}
		
		
	}

	onInputConnection(inputNode, param) {

		let inputAvailable = true;

		if (!this.isConnecting || !this.outputActiveNode) {
			inputAvailable = false;
			const connection = this._nodeConnections.find(t => t.in.ID === inputNode.ID && t.param.title === param.title);
			if (connection) {
				this.removeConnection(connection);
			}
			
			return;
		}

		if (!inputNode.isGraphicsNode) {
			if ((!this.outputActiveNode.isParam && param) || (this.outputActiveNode.isParam && !param)) {
				inputAvailable = false;
			}

			if (this.outputActiveNode.isParam) {
				if (!param.canBeConnected) {
					const params = inputNode.params;
					for (const key in params) {
						params[key].canBeConnected = false;
					}
					inputAvailable = false;
				}
			} else {
				if (!inputNode.canBeConnected) {
					for (let i = 0; i < this._nodes.length; i++) {
						this._nodes[i].canBeConnected = false;
					}
				}
			}
		

			if (!inputAvailable) {
				return;
			}

		} else {
			
			if (param && !ParamHelpers[param.paramHelpersType].isValid(this.outputActiveNode, param)) {
				return;
			}
			
		}

		this.nodeConnectionLine.onInputClick(inputAvailable, inputNode, this.outputActiveNode);

		this.isConnecting = false;
		
		const connectionData = {
			param: param,
			out: this.outputActiveNode,
			in: inputNode,
			lineEl: this.nodeConnectionRenderer.addLine(inputNode.ID + '---' + this.outputActiveNode.ID),
		};
		connectionData.lineEl.addEventListener('click', (e) => {
			this.removeConnection(connectionData);
		});

		if (param) {
			inputNode.enableParam(param, connectionData);
		} else {
			inputNode.enableInput(this.outputActiveNode.getConnectNode());
		}
		
		this.outputActiveNode.enableOutput(param ? param : undefined, connectionData);

		this._nodeConnections.push(connectionData);

		if (this.constructorIsDone) {
			if (connectionData.out.isRenderNode) {
				// const renderConnections = this._nodeConnections.filter(t => t.out.isRenderNode);
				if (!connectionData.in.hasOutput) {
					this.graphicsNodeManager.onConnectionUpdate([connectionData]);
				}
				
			} else {
				const audioConnections = this._nodeConnections.filter(t => !t.out.isGraphicsNode);
				this.keyboardManager.onAudioNodeConnectionUpdate(audioConnections);
			}	
		}
		
		this.outputActiveNode = null;

		for (let i = 0; i < this._nodes.length; i++) {
			this._nodes[i].canBeConnected = false;
			if (this._nodes[i].input) {
				this._nodes[i].input.deactivatePossible();
			}	
		}
	}

	removeConnection(connectionData) {

		if (connectionData.param) {
			connectionData.in.disableParam(connectionData.param, connectionData);


		} else {
			connectionData.in.disableInput(connectionData.out.getConnectNode());
		}

		connectionData.out.disableOutput(connectionData.in, connectionData.param);

		let tempNodeConnections = this._nodeConnections.filter((t) => {
			return t.out.ID !== connectionData.out.ID;
		});

		if (connectionData.param) {
			tempNodeConnections = this._nodeConnections.filter(t => {
				const hasParam = t.param;
				if (!hasParam) return true;

				return t.param.title !== connectionData.param.title;
			});
		}

		// for (let i = 0; i < tempNodeConnections.length; i++) {
		// 	tempNodeConnections[i].in.enableInput(tempNodeConnections[i].out.getConnectNode());
		// }

		this._nodeConnections = tempNodeConnections;

		// console.log('audio connection update');
		if (connectionData.in.isCanvasNode) {
			// const renderConnections = this._nodeConnections.filter(t => t.out.isRenderNode && t.in);
			this.graphicsNodeManager.onConnectionUpdate([]);
		} else {
			const audioConnections = this._nodeConnections.filter(t => !t.out.isGraphicsNode);
			this.keyboardManager.onAudioNodeConnectionUpdate(audioConnections);
		}
		

		this.nodeConnectionRenderer.removeLine(connectionData.lineEl);

	}

	add(node) {
		this._nodes.push(node);
		if (node.isRenderNode) {
			this._graphicNodes.push(node);
			this._graphicNodeLength = this._graphicNodes.length;
		}
	}

	remove(node) {
		if (node.isGraphicsNode) {
			const tempNodes = this._graphicNodes.filter(t => t.ID !== node.ID);
			this._graphicNodes = tempNodes;
			this._graphicNodeLength = this._graphicNodes.length;
		}

		node.remove();
		const tempNodes = this._nodes.filter((t) => t.ID !== node.ID);
		this._nodes = tempNodes;


	}

	update() {
		this.nodeConnectionRenderer.update();

		for (let i = 0; i < this._graphicNodeLength; i++) {
			this._graphicNodes[i].update();
		}

		this.graphicsNodeManager.update();
	}

	render() {
		this.nodeConnectionRenderer.render();

		for (let i = 0; i < this._graphicNodeLength; i++) {
			this._graphicNodes[i].render();
		}

		this.graphicsNodeManager.render();
	}
}