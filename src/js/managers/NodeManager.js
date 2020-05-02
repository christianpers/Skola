import Node from '../views/Nodes/Node';
import GraphicsNodeManager from './GraphicsNodeManager';
import AudioNodeManager from './AudioNodeManager';

import WindowManager from './Windows/WindowManager';

import ParamHelpers from '../graphicNodes/Helpers/ParamHelpers';
import Helpers from '../musicHelpers/Helpers';

import ModifierCollisionManager from './ModiferCollisionManager';
import NodeGroupManager from './NodeGroupManager';
import SelectionManager from './SelectionManager';

import AvailableConnections from './NodeManager/AvailableConnections';

import BackendSync from '../backend/BackendSync';
import { deleteNode, updateNode } from '../backend/set';

export default class NodeManager{
	constructor(config, keyboardManager, parentEl, nodeLibrary) {

		this.config = config;
		this.hasConfig = !!config;

		this.nodeLibrary = nodeLibrary;

		this.availableConnections = new AvailableConnections();

		window.NS.singletons.NodeGroupManager = new NodeGroupManager();
		window.NS.singletons.SelectionManager = new SelectionManager();

		this.constructorIsDone = false;

		this.keyboardManager = keyboardManager;

		this.selectedNode = null;

		this.enableParamConnectionBound = this.enableParamConnection.bind(this);
		this.disableParamConnectionBound = this.disableParamConnection.bind(this);

		this.backendSync = new BackendSync();

		this.modifierCollisionManager = new ModifierCollisionManager();

		this.windowManager = new WindowManager(
			parentEl.parentElement,
			this.enableParamConnectionBound,
			this.disableParamConnectionBound
		);
		
		this._nodes = [];
		this._nodeConnections = [];
		this._graphicNodes = [];
		this._graphicNodeLength = 0;

		this.resetConnectingBound = this.resetConnecting.bind(this);

		this.isConnecting = false;

		this.outputActiveNode = null;
		this.outputActiveType = undefined;

		this.onDisconnectBound = this.onDisconnect.bind(this);
		this.onInputConnectionBound = this.onInputConnection.bind(this);
		this.addBound = this.add.bind(this);
		this.removeBound = this.onNodeRemove.bind(this);
		this.onAudioNodeParamChangeBound = this.onAudioNodeParamChange.bind(this);

		this.onNodeDragStartBound = this.onNodeDragStart.bind(this);
		this.onNodeDragMoveBound = this.onNodeDragMove.bind(this);
		this.onNodeDragReleaseBound = this.onNodeDragRelease.bind(this);
		
		this.audioNodeManager = new AudioNodeManager(
			parentEl,
			null,
			this.onInputConnectionBound,
			this.addBound,
			this.hasConfig ? this.config.nodes : [],
			this.onAudioNodeParamChangeBound,
			this.removeBound,
		);
		this.audioNodeManager.init();

		this.graphicsNodeManager = new GraphicsNodeManager(
			parentEl,
			this.onDisconnectBound,
			this.onInputConnectionBound,
			this.addBound,
			this.removeBound,
			this.onNodeDragStartBound,
			this.onNodeDragMoveBound,
			this.onNodeDragReleaseBound,
		);

		if (this.hasConfig) {

			console.log('has config', this.config);
			// for (let i = 0; i < this.config.connections.length; i++) {
			// 	this.isConnecting = true;
			// 	const outputNode = this._nodes.find(t => t.ID === this.config.connections[i].out);
			// 	const inputNode = this._nodes.find(t => t.ID === this.config.connections[i].in);
			// 	this.outputActiveNode = outputNode;
			// 	this.onInputConnection(inputNode);
			// }

			// this.outputActiveNode = null;

			// const audioConnections = this.getAudioConnections(this._nodeConnections);
			// this.keyboardManager.onAudioNodeConnectionUpdate(audioConnections);

			// const sequencers = audioConnections.filter(t => t.out.isSequencer);
			// let sequencerIds = [];
			// for (let i = 0; i < sequencers.length; i++) {
			// 	const ID = sequencers[i].out.ID;
			// 	if (sequencerIds.indexOf(ID) < 0) {
			// 		sequencers[i].out.sequencerManager.onAudioNodeConnectionUpdate(audioConnections);
			// 		sequencerIds.push(ID);
			// 	}
			// }
			// sequencerIds = [];
		}

		this.constructorIsDone = true;

		const canvasWindow = this.graphicsNodeManager.createCanvasNode();
		window.NS.singletons.CanvasNode = canvasWindow;

		this.onNodeSelectedEventBound = this.onNodeSelectedEvent.bind(this);
		document.documentElement.addEventListener('node-selected', this.onNodeSelectedEventBound);
	}

	init(selectedDrawing) {
		const drawing = selectedDrawing ? selectedDrawing : { nodes: [], groups: [] };

		this.backendSync.setSelectedDrawing(drawing);

		for (let i = 0; i < drawing.nodes.length; i++) {
			const node = drawing.nodes[i];
			const initObj = {
				type: 'graphics',
				data: node.data,
			};
			this.initNode(initObj, node.data.pos, node);
		}
	}

	onNodeSelectedEvent(event) {
		for (let i = 0; i < this._nodes.length; i++) {
			this._nodes[i].setNotSelected();
		}

		if (event && event.detail) {
			// event.detail.setSelected();
			window.NS.singletons.SelectionManager.setSelected(event.detail);
			this.windowManager.setupForNode(event.detail);
		}
	}

	// EVENT ONLY FOR MODIFIERS
	onNodeDragStart(node, e) {
		// this.nodeSettingsWindow.show(node);
		this.modifierCollisionManager.onModifierDragStart(node.nodeType, e);
		this.availableConnections.showAvailable(node, this._nodes, this._nodeConnections);
		// this.windowManager.showSettings(node);
	}

	// EVENT ONLY FOR MODIFIERS
	onNodeDragMove(e, localDelta) {
		this.modifierCollisionManager.onModifierDragMove(e, localDelta);
	}

	// EVENT ONLY FOR MODIFIERS
	onNodeDragRelease() {
		this.modifierCollisionManager.onModifierDragRelease();
		this.availableConnections.resetAvailable();
	}

	initNode(nodeData, e, backendData) {
		let createdNode = null;
		if (nodeData.type === 'graphics') {
			const hasSceneNode = this._graphicNodes.some(t => t.isCanvasNode);
			if (hasSceneNode && nodeData.data.type === 'Canvas') {
				return;
			}
			createdNode = this.graphicsNodeManager.createNode(nodeData.data, e, backendData);
		} else {
			createdNode = this.audioNodeManager.createNode(nodeData.data, e, backendData);
		}

		this.nodeLibrary.hide();
		return createdNode;
		
	}

	onNodeRemove(node) {
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

		// this.nodeConnectionLine.resetLine();

		this.availableConnections.resetAvailable();
	}

	enableParamConnection(paramObj, outNode, inNode) {
		if (!ParamHelpers[paramObj.param.paramHelpersType].isValid(outNode, inNode, paramObj.param, this._nodeConnections)) {
			this.resetConnecting();
			return false;
		}

		updateNode({
			paramConnections: firebase.firestore.FieldValue.arrayUnion(paramObj.ID),
		}, outNode.ID, true)
		.then(() => {
			console.log('updated node');
		})
		.catch(() => {
			console.log('error updating node');
		});

		window.NS.singletons.ConnectionsManager.addParamConnection(paramObj, outNode);
		return true;
	}

	disableParamConnection(paramObj, outNode, inNode) {
		updateNode({
			paramConnections: firebase.firestore.FieldValue.arrayRemove(paramObj.ID),
		}, outNode.ID, true)
		.then(() => {
			console.log('updated node');
		})
		.catch(() => {
			console.log('error updating node');
		});
		window.NS.singletons.ConnectionsManager.removeParamConnection(paramObj, outNode);
		return true;
	}

	onInputConnection(outNode, paramContainer, fromInit) {
		// console.log('on input connection', outNode, paramContainer);

		/* TODO Connect params that has prop defaultConnect  soooo maybe filter on that key */
		const paramKeys = Object.keys(paramContainer.inputParams);
		if (paramKeys.length === 1) {
		}
		
		window.NS.singletons.ConnectionsManager.addNodeConnection(outNode, paramContainer);

		if (!fromInit) {
			this.windowManager.onNodeConnect(outNode);
		}
		
	};

	onDisconnect(outNode, paramContainer) {
		// console.log('on disconnect');
		const params = Object.keys(paramContainer.inputParams);
		for (let i = 0; i < params.length; i++) {
			const param = paramContainer.inputParams[params[i]];
			this.disableParamConnection(param, outNode, paramContainer.node);
		}

		window.NS.singletons.ConnectionsManager.removeNodeConnection(paramContainer, outNode);

		this.windowManager.onNodeDisconnect();
	}

	add(node) {
		if (node.isRendered || node.isVisualHelper) {
			window.NS.singletons.CanvasNode.enableInput(node, 'foreground');
			this._nodes.push(node);
		} else {
			this._nodes.push(node);
		}
		// window.NS.singletons.ConnectionsManager.addNode(node);
		
		if (node.isRenderNode || node.isCanvasNode || node.needsUpdate) {
			this._graphicNodes.push(node);
			this._graphicNodeLength = this._graphicNodes.length;
		}

		// if (node.isSequencer) {
		// 	const audioConnections = this.getAudioConnections(this._nodeConnections);
		// 	node.sequencerManager.init(audioConnections);
		// }
		if (!node.isModifier && !node.isCanvasNode) {
			this.modifierCollisionManager.addNonagon(node);
			window.NS.singletons.NodeGroupManager.addNonagon(node);
			window.NS.singletons.SelectionManager.addNonagon(node);
		}

		if (!this.backendSync.isDone()) {
			this.backendSync.onNodeAdded();
		}
	}

	remove(node) {
		// removes unsaved settings
		window.NS.singletons.StatusWindow.onNodeRemove(node);

		window.NS.singletons.ConnectionsManager.removeNode(node);
		if (node.isGraphicsNode || node.needsUpdate) {
			const tempNodes = this._graphicNodes.filter(t => t.ID !== node.ID);
			this._graphicNodes = tempNodes;
			this._graphicNodeLength = this._graphicNodes.length;
		}

		if (node.isRendered || node.isVisualHelper) {
			window.NS.singletons.CanvasNode.disableInput(node, 'foreground');
		}

		if (!node.isModifier && !node.isCanvasNode) {
			this.modifierCollisionManager.removeNonagon(node);
			window.NS.singletons.NodeGroupManager.removeNonagon(node);
			window.NS.singletons.SelectionManager.removeNonagon(node);
		}

		node.removeFromDom();
		const tempNodes = this._nodes.filter((t) => t.ID !== node.ID);
		this._nodes = tempNodes;

		deleteNode(node.ID)
		.then(() => {
			console.log('node deleted', node.ID);
			window.NS.singletons.refs.removeNodeRef(node.ID);
		})
		.catch((err) => {
			console.log('error deleting', err);
		});

		this.windowManager.blur();
	}

	update() {

		for (let i = 0; i < this._graphicNodeLength; i++) {
			this._graphicNodes[i].update();
		}
		window.NS.singletons.CanvasNode.update();

	}

	render() {
		for (let i = 0; i < this._graphicNodeLength; i++) {
			this._graphicNodes[i].render();
		}

		window.NS.singletons.CanvasNode.render();
	}
}