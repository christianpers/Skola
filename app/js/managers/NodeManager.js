import Node from '../views/Nodes/Node';
import NodeRenderer from './NodeRenderer';
import GraphicsNodeManager from './GraphicsNodeManager';
import AudioNodeManager from './AudioNodeManager';
import NodeConnectionLine from './NodeConnectionLine';

export default class NodeManager{
	constructor(config, keyboardManager, onNodeActive, parentEl) {

		this.config = config;
		this.hasConfig = !!config;

		this.onNodeActiveCallback = onNodeActive;

		this.constructorIsDone = false;

		this.keyboardManager = keyboardManager;

		this._nodes = [];
		this._nodeConnections = [];

		this.nodeRenderer = new NodeRenderer(parentEl, this);
		this.nodeConnectionLine = new NodeConnectionLine(this.nodeRenderer.el);

		this.isConnecting = false;

		this.outputActiveNode = null;

		this.onConnectingBound = this.onConnecting.bind(this);
		this.onInputConnectionBound = this.onInputConnection.bind(this);
		this.addBound = this.add.bind(this);
		this.onAudioNodeParamChangeBound = this.onAudioNodeParamChange.bind(this);
		
		this.audioNodeManager = new AudioNodeManager(
			parentEl,
			this.onConnectingBound,
			this.onInputConnectionBound,
			this.addBound,
			this.hasConfig ? this.config.nodes : [],
			this.onAudioNodeParamChangeBound,
			onNodeActive,
		);
		this.audioNodeManager.init();

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

	onNodeAddedFromLibrary(data) {
		this.audioNodeManager.createNode(data);
	}

	onAudioNodeParamChange(nodeID, params) {
		this.keyboardManager.onAudioNodeParamChange(nodeID, params);
	}

	onConnecting(node, clickPos) {

		const outputHasConnection = this._nodeConnections.some(t => t.out.ID === node.ID);
		if (outputHasConnection) {
			this.removeConnection(this._nodeConnections.find(t => t.out.ID === node.ID));
			return;
		}

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

		console.log('param nodes: ', audioNodesWithInputParams);

		console.log('audio nodes: ', notConnectedAudioInNodes);

		const nodesToLoop = node.isParam ? audioNodesWithInputParams : notConnectedAudioInNodes;

		for (let i = 0; i < nodesToLoop.length; i++) {
			nodesToLoop[i].canBeConnected = true;
		}
	}

	onInputConnection(inputNode, param) {

		let inputAvailable = true;

		if (!this.isConnecting || !this.outputActiveNode) {
			inputAvailable = false;
			return;
		}

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

		this.nodeConnectionLine.onInputClick(inputAvailable, inputNode, this.outputActiveNode);

		if (!inputAvailable) {
			return;
		}

		this.isConnecting = false;

		if (param) {
			inputNode.enableParam(param);
		} else {
			inputNode.enableInput(this.outputActiveNode.getConnectNode());
		}
		
		this.outputActiveNode.enableOutput();
		
		const connectionData = {
			param: param,
			out: this.outputActiveNode,
			in: inputNode,
			lineEl: this.nodeRenderer.addLine(inputNode.ID + '---' + this.outputActiveNode.ID),
		};
		connectionData.lineEl.addEventListener('click', (e) => {
			this.removeConnection(connectionData);
		});

		this._nodeConnections.push(connectionData);

		if (this.constructorIsDone) {
			this.keyboardManager.onAudioNodeConnectionUpdate(this._nodeConnections);
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
			connectionData.in.disableParam(connectionData.param);

		} else {
			connectionData.in.disableInput(connectionData.out.getConnectNode());
		}

		connectionData.out.disableOutput(connectionData.in);

		const tempNodeConnections = this._nodeConnections.filter((t) => {
			return t.out.ID !== connectionData.out.ID;
		});

		// for (let i = 0; i < tempNodeConnections.length; i++) {
		// 	tempNodeConnections[i].in.enableInput(tempNodeConnections[i].out.getConnectNode());
		// }

		this._nodeConnections = tempNodeConnections;

		// console.log('audio connection update');
		this.keyboardManager.onAudioNodeConnectionUpdate(this._nodeConnections);

		this.nodeRenderer.removeLine(connectionData.lineEl);

	}

	add(node) {
		this._nodes.push(node);
	}

	remove(node) {
		node.remove();
		const tempNodes = this._nodes.filter((t) => t.ID !== node.ID);
		this._nodes = tempNodes;
	}

	update() {
		this.nodeRenderer.update();
		// this.graphicsNodeManager.update();
	}

	render() {
		this.nodeRenderer.render();
	}
}