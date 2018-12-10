import Node from '../views/Nodes/Node';
import NodeRenderer from './NodeRenderer';
import GraphicsNodeManager from './GraphicsNodeManager';
import AudioNodeManager from './AudioNodeManager';

export default class NodeManager{
	constructor(config, keyboardManager) {

		this.config = config;
		this.hasConfig = !!config;

		this.constructorIsDone = false;

		this.keyboardManager = keyboardManager;

		this._nodes = [];
		this._nodeConnections = [];

		this.nodeRenderer = new NodeRenderer(document.body, this);

		this.isConnecting = false;

		this.outputActiveNode = null;

		this.onConnectingBound = this.onConnecting.bind(this);
		this.onInputConnectionBound = this.onInputConnection.bind(this);
		this.addBound = this.add.bind(this);
		
		this.audioNodeManager = new AudioNodeManager();
		this.audioNodeManager.init(
			document.body,
			this.onConnectingBound,
			this.onInputConnectionBound,
			this.addBound,
			this.hasConfig ? this.config.nodes : []
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

	onConnecting(node) {

		this.isConnecting = true;
		this.outputActiveNode = node;

		const otherNodes = this._nodes.filter((t) => t.ID !== node.ID);

		for (let i = 0; i < otherNodes.length; i++) {
			otherNodes[i].input.activatePossible();
		}
	}

	onInputConnection(inputNode) {

		if (!this.isConnecting || !this.outputActiveNode) {
			return;
		}

		this.isConnecting = false;

		this.outputActiveNode.setup();

		if (this.outputActiveNode.audioNode) {

			inputNode.enableInput(this.outputActiveNode.getConnectNode());
			this.outputActiveNode.enableOutput();
		}

		const connectionData = {out: this.outputActiveNode, in: inputNode, lineEl: this.nodeRenderer.addLine(inputNode.ID + '---' + this.outputActiveNode.ID)};
		connectionData.lineEl.addEventListener('click', (e) => {
			this.removeConnection(connectionData);
		});

		this._nodeConnections.push(connectionData);

		if (this.constructorIsDone) {
			this.keyboardManager.onAudioNodeConnectionUpdate(this._nodeConnections);
		}
		
		this.outputActiveNode = null;

		for (let i = 0; i < this._nodes.length; i++) {
			this._nodes[i].input.deactivatePossible();
		}
	}

	removeConnection(connectionData) {

		connectionData.in.disableInput(connectionData.out.getConnectNode());
		connectionData.out.disableOutput(connectionData.in);

		const tempNodeConnections = this._nodeConnections.filter((t) => {
			return t.out.ID !== connectionData.out.ID;
		});

		for (let i = 0; i < tempNodeConnections.length; i++) {
			tempNodeConnections[i].in.enableInput(tempNodeConnections[i].out.getConnectNode());
		}

		this._nodeConnections = tempNodeConnections;

		// console.log('audio connection update');
		this.keyboardManager.onAudioNodeConnectionUpdate(this._nodeConnections);

		this.nodeRenderer.removeLine(connectionData.lineEl);

	}

	add(node) {
		this._nodes.push(node);

		if (node.isKeyboardListener) {
			this.audioNodeManager.addKeyboardListener(node);
		}
	}

	remove(node) {
		node.remove();
		const tempNodes = this._nodes.filter((t) => t.ID !== node.ID);
		this._nodes = tempNodes;

		this.audioNodeManager.removeKeyboardListener(node);
	}

	update() {
		this.nodeRenderer.update();
		// this.graphicsNodeManager.update();
	}

	render() {
		this.nodeRenderer.render();
	}
}