import Node from '../views/Nodes/Node';
import NodeRenderer from './NodeRenderer';
import GraphicsNodeManager from './GraphicsNodeManager';
import AudioNodeManager from './AudioNodeManager';
import NodeConnectionLine from './NodeConnectionLine';

import ParamHelpers from '../graphicNodes/Helpers/ParamHelpers';
import Helpers from '../musicHelpers/Helpers';

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

		this.resetConnectingBound = this.resetConnecting.bind(this);

		this.nodeConnectionRenderer = new NodeRenderer(parentEl, this);
		this.nodeConnectionLine = new NodeConnectionLine(this.nodeConnectionRenderer.el, this.resetConnectingBound);

		this.isConnecting = false;

		this.outputActiveNode = null;
		this.outputActiveType = undefined;

		this.onConnectingBound = this.onConnecting.bind(this);
		this.onInputConnectionBound = this.onInputConnection.bind(this);
		this.addBound = this.add.bind(this);
		this.removeBound = this.onNodeRemove.bind(this);
		this.onAudioNodeParamChangeBound = this.onAudioNodeParamChange.bind(this);
		
		this.audioNodeManager = new AudioNodeManager(
			parentEl,
			this.onConnectingBound,
			this.onInputConnectionBound,
			this.addBound,
			this.hasConfig ? this.config.nodes : [],
			this.onAudioNodeParamChangeBound,
			onNodeActive,
			this.removeBound,
		);
		this.audioNodeManager.init();

		this.graphicsNodeManager = new GraphicsNodeManager(
			parentEl,
			this.onConnectingBound,
			this.onInputConnectionBound,
			this.addBound,
			onNodeActive,
			this.removeBound,
		);

		if (this.hasConfig) {
			for (let i = 0; i < this.config.connections.length; i++) {
				this.isConnecting = true;
				const outputNode = this._nodes.find(t => t.ID === this.config.connections[i].out);
				const inputNode = this._nodes.find(t => t.ID === this.config.connections[i].in);
				this.outputActiveNode = outputNode;
				this.onInputConnection(inputNode);
			}

			this.outputActiveNode = null;

			const audioConnections = this.getAudioConnections(this._nodeConnections);
			this.keyboardManager.onAudioNodeConnectionUpdate(audioConnections);

			const sequencers = audioConnections.filter(t => t.out.isSequencer);
			let sequencerIds = [];
			for (let i = 0; i < sequencers.length; i++) {
				const ID = sequencers[i].out.ID;
				if (sequencerIds.indexOf(ID) < 0) {
					sequencers[i].out.sequencerManager.onAudioNodeConnectionUpdate(audioConnections);
					sequencerIds.push(ID);
				}
				
			}

			sequencerIds = [];
		}

		this.constructorIsDone = true;
	}

	onNodeAddedFromLibrary(type, data, e) {
		if (type === 'graphics') {
			const hasSceneNode = this._graphicNodes.some(t => t.isCanvasNode);
			if (hasSceneNode && data.type === 'Canvas') {
				return;
			}
			this.graphicsNodeManager.createNode(data, e);
		} else {
			this.audioNodeManager.createNode(data, e);
		}
	}

	onNodeRemove(node) {
		const connections = this._nodeConnections.filter(t => t.out.ID === node.ID || t.in.ID === node.ID);

		for (let i = 0; i < connections.length; i++) {
			this.removeConnection(connections[i]);
		}

		this.remove(node);
	}

	onAudioNodeParamChange(node, params) {
		this.keyboardManager.onAudioNodeParamChange(node, params);
	}

	disconnectAnalyserNodes(connections) {
		const analyserConnections = connections.filter(t => t.in.isAnalyser);
	
		for (let i = 0; i < analyserConnections.length; i++) {
			analyserConnections[i].in.dispose();
		}
	}

	getAudioConnections(connections) {
		return connections.filter(t => !t.out.isGraphicsNode && !t.in.isGraphicsNode);
	}

	resetConnecting() {
		this.isConnecting = false;
		this.outputActiveNode = null;
		this.outputActiveType = undefined;

		this.nodeConnectionLine.resetLine();
	}

	onConnecting(node, clickPos, outputType) {

		if (this.isConnecting || this.outputActiveNode) {
			return;
		}

		const outputHasConnection = this._nodeConnections.some(t => t.out.ID === node.ID);
		
		this.isConnecting = true;
		this.outputActiveNode = node;
		this.outputActiveType = outputType;

		this.nodeConnectionLine.onConnectionActive(node, clickPos, outputType);
		
	}

	onInputConnection(inputNode, inputType, param) {

		let inputAvailable = true;

		if (!this.isConnecting || !this.outputActiveNode) {
			// inputAvailable = false;
			// if (param) {
			// 	const connection = this._nodeConnections.find(t => t.in.ID === inputNode.ID && t.param && t.param.title === param.title);
			// 	if (connection) {
			// 		this.removeConnection(connection);
			// 	}
			// } else if (inputType) {
			// 	const connection = this._nodeConnections.find(t => t.in.ID === inputNode.ID && t.inputType === inputType);
			// 	if (connection) {
			// 		this.removeConnection(connection);
			// 	}
			// } else {
			// 	const connection = this._nodeConnections.find(t => t.in.ID === inputNode.ID);
			// 	if (connection) {
			// 		this.removeConnection(connection);
			// 	}
			// }
			
			return;
		}

		if (!inputNode.isGraphicsNode) {
			if (param && param.helper) {
				if (!param.helper.isValid(this.outputActiveNode, inputNode, param, this._nodeConnections)) {
					this.resetConnecting();
					return;
				}
			} else {
				if (!inputNode.inputHelpersType.isValid(this.outputActiveNode, inputNode, param, this._nodeConnections)) {
					this.resetConnecting();
					return;
				}
			}

		} else {
			
			if (param && !ParamHelpers[param.paramHelpersType].isValid(this.outputActiveNode, param)) {
				this.resetConnecting();
				return;
			} else {
				if (!inputNode.inputHelpersType.isValid(this.outputActiveNode, inputNode, inputType)) {
					this.resetConnecting();
					return;
				}
			}
		}

		this.nodeConnectionLine.onInputClick(inputAvailable, inputNode, this.outputActiveNode);

		this.isConnecting = false;

		const paramID = param ? `${param.parent}-${param.param}` : '';
		const lineID = `${inputNode.ID}---${this.outputActiveNode.ID}---${paramID}`;
		
		const connectionData = {
			param: param,
			out: this.outputActiveNode,
			in: inputNode,
			lineEl: this.nodeConnectionRenderer.addLine(lineID),
			inputType,
			outputType: this.outputActiveType,
		};

		this.outputActiveNode.enableOutput(param ? param : undefined, connectionData);

		if (param) {
			inputNode.enableParam(param, connectionData);
		} else {
			inputNode.enableInput(this.outputActiveNode, inputType);
		}

		this._nodeConnections.push(connectionData);

		if (this.constructorIsDone) {
			const audioConnections = this.getAudioConnections(this._nodeConnections);
			Helpers.updateOscillators(audioConnections);

			this.disconnectAnalyserNodes(audioConnections);
			
			this.keyboardManager.onAudioNodeConnectionUpdate(audioConnections);
			
			const sequencers = audioConnections.filter(t => t.out.isSequencer);
			let sequencerIds = [];
			for (let i = 0; i < sequencers.length; i++) {
				const ID = sequencers[i].out.ID;
				if (sequencerIds.indexOf(ID) < 0) {
					sequencers[i].out.sequencerManager.onAudioNodeConnectionUpdate(audioConnections);
					sequencerIds.push(ID);
				}
				
			}

			sequencerIds = [];
		}
		
		this.resetConnecting();
	}

	removeConnection(connectionData) {

		if (connectionData.param) {
			connectionData.in.disableParam(connectionData.param, connectionData);
		} else {
			connectionData.in.disableInput(connectionData.out, connectionData.inputType);
		}

		connectionData.out.disableOutput(connectionData.in, connectionData.param, connectionData.outputType);

		let tempNodeConnections = this._nodeConnections.filter((t) => {
			if (t.out.ID === connectionData.out.ID && t.in.ID === connectionData.in.ID) {
				return false;
			}
			return true;
		});

		if (connectionData.param) {
			tempNodeConnections = this._nodeConnections.filter(t => {
				const hasParam = t.param;
				if (!hasParam) return true;

				if (t.param.title === connectionData.param.title && t.in.ID === connectionData.in.ID) {
					return false;
				}
				return true;
			});
		}

		this._nodeConnections = tempNodeConnections;

		const audioConnections = this.getAudioConnections(this._nodeConnections);
		Helpers.updateOscillators(audioConnections);

		this.disconnectAnalyserNodes(audioConnections);

		this.keyboardManager.onAudioNodeConnectionUpdate(audioConnections);

		const sequencers = audioConnections.filter(t => t.out.isSequencer);
		let sequencerIds = [];
		for (let i = 0; i < sequencers.length; i++) {
			const ID = sequencers[i].out.ID;
			if (sequencerIds.indexOf(ID) < 0) {
				sequencers[i].out.sequencerManager.onAudioNodeConnectionUpdate(audioConnections);
				sequencerIds.push(ID);
			}
		}

		sequencerIds = [];
		
		this.nodeConnectionRenderer.removeLine(connectionData.lineEl);
	}

	onNodePlaced(node) {
		console.log('node placed', node);
	}

	add(node) {
		this._nodes.push(node);
		if (node.isRenderNode || node.isCanvasNode || node.needsUpdate) {
			this._graphicNodes.push(node);
			this._graphicNodeLength = this._graphicNodes.length;
		}

		if (node.isSequencer) {
			const audioConnections = this.getAudioConnections(this._nodeConnections);
			node.sequencerManager.init(audioConnections);
		}
	}

	remove(node) {
		if (node.isGraphicsNode || node.needsUpdate) {
			const tempNodes = this._graphicNodes.filter(t => t.ID !== node.ID);
			this._graphicNodes = tempNodes;
			this._graphicNodeLength = this._graphicNodes.length;
		}

		node.removeFromDom();
		const tempNodes = this._nodes.filter((t) => t.ID !== node.ID);
		this._nodes = tempNodes;
	}

	update() {
		this.nodeConnectionRenderer.update();

		for (let i = 0; i < this._graphicNodeLength; i++) {
			this._graphicNodes[i].update();
		}
	}

	render() {
		this.nodeConnectionRenderer.render();

		for (let i = 0; i < this._graphicNodeLength; i++) {
			this._graphicNodes[i].render();
		}
	}
}