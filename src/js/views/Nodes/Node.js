
import NonagonType from './NodeTypes/NonagonType';
import TriangleType from './NodeTypes/TriangleType';
import NodeTitle from './NodeComponents/NodeTitle/NodeTitle';
import { createNode, updateNode } from '../../backend/set';
import { getNodeRef } from '../../backend/get';

export default class Node{
	constructor() {
		this.hasOutput = true;
		this.isGraphicsNode = false;
		this.isLightNode = false;
		this.hasGraphicsInput = false;
		this.needsUpdate = false;
		this.hasMultipleOutputs = false;
		this.returnsSingleNumber = false;
		this.isShapeNode = false;

		this._nodeIndex = -1;
		this._nodeSortIndex = 0;

		this.title = 'Enter node title';

		this.onConnectionAddBound = this.onConnectionAdd.bind(this);
		this.onConnectionRemoveBound = this.onConnectionRemove.bind(this);
		// this.onConnectionsUpdateBound = this.onConnectionsUpdate.bind(this);

		document.documentElement.addEventListener('param-connections-add', this.onConnectionAddBound);
		document.documentElement.addEventListener('param-connections-remove', this.onConnectionRemoveBound);
		// document.documentElement.addEventListener('node-connections-update', this.onConnectionRemoveBound);
	}

	init(
		pos,
		parentEl,
		onDisconnectCallback,
		onInputConnectionCallback,
		type,
		nodeConfig,
		onNodeRemove,
		isModifier,
		onNodeDragStart,
		onNodeDragMove,
		onNodeDragRelease,
		addCallback,
	) {
		this.initNodeConfig = !!nodeConfig;

		this.ID = this.initNodeConfig ? nodeConfig.id : 'temp__' + Math.random().toString(36).substr(2, 9);
		this.onDisconnectCallback = onDisconnectCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.hasActiveInput = false;
		this.type = type;
		this.onNodeRemove = onNodeRemove;
		this.isModifier = isModifier;
		this.onNodeDragStart = onNodeDragStart;
		this.onNodeDragMove = onNodeDragMove;
		this.onNodeDragRelease = onNodeDragRelease;
		this.addCallback = addCallback;

		this.groupState = {
			isInGroup: false,
			isShowing: false,
		};

		this.parentEl = parentEl;

		this.connectedNodes = [];

		this.visualSettings = null;
		
		this.innerContainer = document.createElement('div');
		this.innerContainer.className = 'node-inner';

		this.el.appendChild(this.innerContainer);

		// Layer used when node is in a group
		this.groupHideLayer = document.createElement('div');
		this.groupHideLayer.classList.add('group-hide-layer');

		this.el.appendChild(this.groupHideLayer);

		if (!this.isModifier) {
			this.upperContainer = document.createElement('div');
			this.upperContainer.className = 'node-upper';
			this.el.appendChild(this.upperContainer);
		}
		
		this.lastDelta = {x: 0, y: 0};
		this.localDelta = {x: 0, y: 0};

		this.parentEl.appendChild(this.el);

		// this.onOutputClickBound = this.onOutputClick.bind(this);
		// this.onInputClickBound = this.onInputClick.bind(this);
		this.onRemoveClickBound = this.onRemoveClick.bind(this);

		if (!this.isCanvasNode) {
			if (this.isModifier) {
				this.el.classList.add('modifier-node');
			} else {
				if (this.initNodeConfig) {
					this.title = nodeConfig.data.title;
				}
				this.nodeTitle = new NodeTitle(this.upperContainer, this);
			}

			this.nodeType = this.isModifier
				? new TriangleType(this.el, this.innerContainer, this.params, this) : new NonagonType(this.innerContainer, this.params, this, nodeConfig);
		}

		this.moveCoords = {
			start: {
				x: 0,
				y: 0
			},
			offset: {
				x: pos.x,
				y: pos.y,
			}
		};

		this.el.style[window.NS.transform] = `translate3d(${this.moveCoords.offset.x}px, ${this.moveCoords.offset.y}px, 0)`;

		if (this.initNodeConfig) {
			const ref = getNodeRef(this.ID);
			window.NS.singletons.refs.addNodeRef(ref);
			window.NS.singletons.ConnectionsManager.addNode(this);
			this.nodeCreated(nodeConfig);
		} else {
			let nodeObj = {
				type,
				title: this.title,
				pos,
			};
			nodeObj = this.isModifier ? Object.assign({}, nodeObj, { paramConnections: [] }) : Object.assign({}, nodeObj);
			createNode(nodeObj)
			.then((ref) => {
				this.ID = ref.id;
				window.NS.singletons.ConnectionsManager.addNode(this);
				if (ref) {
					window.NS.singletons.refs.addNodeRef(ref);
				} else {
					const ref = getNodeRef(this.ID);
					window.NS.singletons.refs.addNodeRef(ref);
				}

				this.nodeCreated();
			})
			.catch(() => {
				console.log('err creating node in db');
			});
		}

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);

		this.activateDrag();
	}

	// CALLED FROM CONNECTIONSMANAGER
	onNodeDisconnectFromNonagonDelete() {
		this.nodeType.deactivateAsChild({x: 0, y: 0}, true);
	}

	nodeCreated(nodeConfig) {
		if (!this.isCanvasNode) {
			// this.nodeType = this.isModifier
			// 	? new TriangleType(this.el, this.innerContainer, this.params, this) : new NonagonType(this.innerContainer, this.params, this, nodeConfig);

			const typeStr = this.type;

			const title = this.isModifier ? `${typeStr}-modifier` : `${typeStr}-node`;

			const iconPath = `${title.replace(' ', '-').toLowerCase()}-icon`;

			// console.log(iconPath);

			const iconImg = document.createElement('img');
			iconImg.src = `./assets/icons/${iconPath}.svg`;

			this.innerContainer.appendChild(iconImg);
		}

		if (this.nodeType.paramContainers.length > 0 && !this.initNodeConfig) {
			const ids = [];

			for (let i = 0; i < this.nodeType.paramContainers.length; i++) {
				const obj = {};
				const paramContainer = this.nodeType.paramContainers[i];
				const inputParamKeys = Object.keys(paramContainer.inputParams);
				obj.inputParams = [];
				for (let q = 0; q < inputParamKeys.length; q++) {
					const inputParam = paramContainer.inputParams[inputParamKeys[q]];
					obj.inputParams.push(inputParam.ID);
				}
				obj.paramContainerID = paramContainer.ID;
				ids.push(obj);
			}

			updateNode({
				paramContainers: ids,
			}, this.ID, true)
			.then(() => {
				console.log('paramcontainers updated');
			})
			.catch(() => {
				console.log('error updating node');
			});
		}

		this.addCallback(this);
	}

	// getSettings() {
	// 	if (!this.settingsContainer) {
	// 		this.settingsContainer = document.createElement('div');
	// 		this.settingsContainer.className = 'node-settings';
	// 	}

	// 	return this.settingsContainer;
	// }

	setTitle(value) {
		this.title = value;

		window.NS.singletons.NodeGroupManager.updateGroupNodeTabTitle(this.ID, value);

		updateNode({
			title: this.title,
		}, this.ID)
		.then(() => {
			console.log('updated node');
		})
		.catch(() => {
			console.log('error updating node');
		});
	}

	onConnectionAdd(e) {
		console.log('node on param connection add: ', e.detail, e.type, this.ID);

	}

	onConnectionRemove(e) {
		console.log('node on param connection remove: ', e.detail, e.type, this.ID);

	}

	onModifierDisconnect() {}

	syncVisualSettings(settings, directSync = false) {
		this.visualSettings = Object.assign({}, this.visualSettings, settings);
		updateNode({
			visualSettings: settings,
		}, this.ID, directSync)
		.then(() => {

		})
		.catch(() => {

		});
	}

	addToGroup(groupEl) {
		groupEl.appendChild(this.el);
		this.el.style[window.NS.transform] = 'translate(-50%, -50%)';
		this.el.classList.add('center-group');

		this.groupState.isInGroup = true;

		if (this.nodeType.setActive) {
			this.nodeType.setActive();
		}
	}

	removeFromGroup(e, group) {
		this.parentEl.appendChild(this.el);
		this.el.classList.remove('center-group');

		this.groupState.isInGroup = false;

		const offsetX = 100;
		const offsetY = 100;
		this.moveCoords.start.x = e.x - (group.moveCoords.offset.x + offsetX);
		this.moveCoords.start.y = e.y - (group.moveCoords.offset.y + offsetY);

		// if (this.nodeType.setInactive) {
		// 	this.nodeType.setInactive();
		// }
	}

	setAsChildToParamContainer(paramContainer, updateBackend, fromInit) {
		paramContainer.el.appendChild(this.el);
		this.el.style[window.NS.transform] = 'initial';
		this.onInputConnectionCallback(this, paramContainer, fromInit);

		if (!updateBackend) {
			return;
		}

		updateNode({
			connectionData: {
				paramContainer: paramContainer.ID,
				node: paramContainer.node.ID,
			}
		}, this.ID, true)
		.then(() => {

		})
		.catch(() => {

		});
	}

	setAsNotChildToParamContainer(paramContainer, e, fromNodeRemove) {
		this.onDisconnectCallback(this, paramContainer);
		const pos = paramContainer.getCleanPos();
		this.parentEl.appendChild(this.el);
		// let nodeBoundingRect = paramContainer.node.el.getBoundingClientRect();
		
		const parentNode = paramContainer.node;

		const getRect = () => {
			if (parentNode.groupState.isInGroup) {
				const group = window.NS.singletons.NodeGroupManager.getGroupFromNonagon(parentNode);
				return group.el.getBoundingClientRect();
			}

			return paramContainer.node.el.getBoundingClientRect();
		}

		const getX = () => {
			if (parentNode.groupState.isInGroup) {
				const group = window.NS.singletons.NodeGroupManager.getGroupFromNonagon(parentNode);
				return group.moveCoords.offset.x;
			}
			return parentNode.moveCoords.offset.x;
		}

		const getY = () => {
			if (parentNode.groupState.isInGroup) {
				const group = window.NS.singletons.NodeGroupManager.getGroupFromNonagon(parentNode);
				return group.moveCoords.offset.y;
			}
			return parentNode.moveCoords.offset.y;
		}

		if (fromNodeRemove) {
			const rect = getRect();
			const offsetX = pos.x - rect.x;
			const offsetY = pos.y - rect.y;
			
			this.moveCoords.start.x = getX() + offsetX;
			this.moveCoords.start.y = getY() + offsetY;

			const { x, y } = this.moveCoords.start;

			this.el.style[window.NS.transform] = `translate3d(${x}px, ${y}px, 0)`;
		} else {
			const rect = getRect();
			const offsetX = pos.x - rect.x;
			const offsetY = pos.y - rect.y;
			this.moveCoords.start.x = e.x - (getX() + offsetX);
			this.moveCoords.start.y = e.y - (getY() + offsetY);
		}

		updateNode({
			connectionData: firebase.firestore.FieldValue.delete(),
		}, this.ID, true)
		.then(() => {

		})
		.catch(() => {

		});
	}

	getParamContainers() {
		return this.nodeType.paramContainers;
	}

	enableOutput(param, connection) {
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
	}

	onRemoveClick() {
		this.onNodeRemove(this);
	}

	activateDrag() {
		this.innerContainer.addEventListener('mousedown', this.onMouseDownBound);
	}

	getConnectNode() {
		return this;
	}

	setNotSelected() {
		this.el.classList.remove('selected');
		if (this.nodeTitle) {
			this.nodeTitle.blurInput();
		}

		if (this.nodeType.setInactive && !this.groupState.isInGroup) {
			this.nodeType.setInactive();
		}

		window.NS.singletons.CanvasNode.foregroundRender.hideActive(this.ID);
	}

	setSelected() {
		this.el.classList.add('selected');

		if (this.isRendered) {
			window.NS.singletons.CanvasNode.foregroundRender.showActive(this.ID);
			// console.log('set active camera id: ', this.ID);
			// window.NS.singletons.CanvasNode.foregroundRender.setActiveCamera(this.camera);
		}
		
		if (this.nodeType.setActive && !this.groupState.isInGroup) {
			this.nodeType.setActive();
		}
	}

	getPos() {
		const pos = new THREE.Vector2();
		const rect = this.innerContainer.getBoundingClientRect();
		pos.set(rect.x + rect.width / 2, rect.y + rect.height / 2);
		
		return pos;
	}

	removeFromDom() {
		this.innerContainer.removeEventListener('mousedown', this.onMouseDownBound);
		if (this.isModifier) {
			if (this.nodeType.isConnected) {
				this.nodeType.removeNodeFromDom();
				return;
			}
		}

		this.parentEl.removeChild(this.el);
	}

	groupShow() {
		this.el.style.zIndex = '1';
		this.groupHideLayer.classList.remove('visible');

		this.groupState.isShowing = true;
	}

	groupHide() {
		this.el.style.zIndex = '0';
		this.groupHideLayer.classList.add('visible');

		this.groupState.isShowing = false;
	}

	onMouseDown(e, addListener = true) {
		if (e.target.nodeName === 'INPUT' || e.target.classList.contains('prevent-drag')) {
			return;
		}

		if (this.nodeTitle) {
			this.nodeTitle.blurInput();
		}

		e.stopPropagation();
		e.preventDefault();

		const nodeSelectedEvent = new CustomEvent('node-selected', { detail: this });
        document.documentElement.dispatchEvent(nodeSelectedEvent);

		this.moveCoords.start.x = e.x - this.moveCoords.offset.x;
		this.moveCoords.start.y = e.y - this.moveCoords.offset.y;

		this.lastDelta.x = 0;
		this.lastDelta.y = 0;

		this.localDelta.x = e.x;
		this.localDelta.y = e.y;

		if (this.isModifier) {
			this.onNodeDragStart(this, e);
		} else {
			window.NS.singletons.NodeGroupManager.onNodeDragStart(this);
		}

		window.NS.singletons.DeleteView.onNodeMoveStart();
		

		if (addListener) {
			window.addEventListener('mouseup', this.onMouseUpBound);
			window.addEventListener('mousemove', this.onMouseMoveBound);
		}
		
	}

	onMouseMove(e) {
		const localDelta = {
			x: e.x - this.localDelta.x,
			y: e.y - this.localDelta.y,
		};

		if (this.isModifier) {
			this.onNodeDragMove(e, localDelta);
		} else {
			window.NS.singletons.NodeGroupManager.onNodeDragMove(e, this, localDelta);
		}

		const deltaX = e.x - this.moveCoords.start.x;
		const deltaY = e.y - this.moveCoords.start.y;

		this.moveCoords.offset.x = deltaX;
		this.moveCoords.offset.y = deltaY;

		this.lastDelta.x = deltaX;
		this.lastDelta.y = deltaY;

		if (this.isModifier && this.nodeType.isConnected) {
			return;
		}
		this.el.style[window.NS.transform] = `translate3d(${deltaX}px, ${deltaY}px, 0)`;

		const pos = this.getPos();
		window.NS.singletons.DeleteView.onNodeMove(pos.x, pos.y);
		
	}

	onMouseUp(e, removeListener = true) {
		if (window.NS.singletons.DeleteView.deleteOnNodeRelease()) {
			if (this.isModifier) {
				this.onNodeDragRelease();
			}
			window.removeEventListener('mouseup', this.onMouseUpBound);
			window.removeEventListener('mousemove', this.onMouseMoveBound);

			this.onRemoveClick();
			return;
		}

		if (this.isModifier) {
			this.onNodeDragRelease();
		} else {
			window.NS.singletons.NodeGroupManager.onNodeDragEnd(this);
		}
		if (removeListener) {
			window.removeEventListener('mouseup', this.onMouseUpBound);
			window.removeEventListener('mousemove', this.onMouseMoveBound);
		}

		if (this.lastDelta.x === 0 && this.lastDelta.y === 0) {
			return;
		}

		updateNode({
			pos: this.lastDelta,
		}, this.ID, true)
		.then(() => {
			console.log('updated node');
		})
		.catch(() => {
			console.log('error updating node');
		});
	}

	set nodeIndex(val) {
		this._nodeIndex = val;
	}

	get nodeIndex() {
		return this._nodeIndex;
	}

	set nodeSortIndex(val) {
		this._nodeSortIndex = val;
	}

	get nodeSortIndex() {
		return this._nodeSortIndex;
	}
}