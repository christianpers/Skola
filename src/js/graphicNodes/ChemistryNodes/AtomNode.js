import GraphicNode from '../GraphicNode';
import AtomCircle from './AtomCircle';
import AtomDisconnectHandler from './AtomDisconnectHandler';
import {
	getAmountRings,
	syncConnectedElectrons,
	isElectron,
	isMainAtom,
	updateMeshTypeMapper,
	isDragEvtAtom,
	syncAtomPos,
	getProtonsNeutronsPositions,
	getCurrentElectronConnections,
} from './helpers';
import {
	getStartDragDataAtom,
	getStartDragDataElectron,
	onElectronDragEnd,
	getDraggingElectronDragData,
	getDraggingAtomDragData,
	onAtomDragEnd,
} from './dragHandlers';
import AnimateObject from './AnimateObject';
import { SIMPLE_3D_VERTEX, ATOM_CENTER_FRAGMENT } from '../../../shaders/SHADERS';

export const RING_DEF = Object.freeze({
	0: {
		amountElectrons: 2,
		orbitalPositions: 1, // but only two electrons ? half orbitals ?
		orbitals: 1,
		allowElectronAngleMove: true, // used to know if allowed to move electron to connection angle.. might have to be decided based on both input and output but this is a temp solution
	},
	1: {
		amountElectrons: 8,
		orbitalPositions: 4,
		orbitals: 4,
		allowElectronAngleMove: false,
	},
	2: {
		amountElectrons: 18,
		orbitalPositions: 9,
		orbitals: 9,
		allowElectronAngleMove: false,
	},
	3: {
		amountElectrons: 32,
		orbitalPositions: 16,
		orbitals: 16,
		allowElectronAngleMove: false,
	}
});

export default class AtomNode extends GraphicNode{
	static get tag() { return 'AtomNode' };
	constructor(renderer, backendData) {
		super();

		this.initRingConnections = (backendData && backendData.data.ringConnections) ? backendData.data.ringConnections : {};
		const visualPos = (backendData && backendData.data.visualPos) ? backendData.data.visualPos : { x: 0, y: 0 };

		this.isForegroundNode = true;
		this.isRendered = true;
		// this.needsUpdate = true;

		this.corePositions = getProtonsNeutronsPositions();

		this.dragControls = null;

		this.visibleRings = [];

		this.atomDisconnectCallback = this.onAtomDisconnect.bind(this);

		this.dragData = {
			centerPoint: new THREE.Vector2(),
			ringToReleaseOn: null,
			releasePoint: null,
			electronObj: null,
			atoms: [],
			atomToConnect: null,
			connectedElectrons: [],
		};

		this.onDragStartBound = this.onDragStart.bind(this);
		this.onDragBound = this.onDrag.bind(this);
		this.onDragEndBound = this.onDragEnd.bind(this);

		this.foregroundRender = null;

		this.mesh = new THREE.Group();
		this.mesh.userData = {
			getForegroundRender: true,
		};

		
		

		this.mainAtomGroup = new THREE.Group();
		this.mainAtomGroup.position.x = visualPos.x;
		this.mainAtomGroup.position.y = visualPos.y;
		this.mainAtomGroup.name = 'mainAtomGroup';

		this.electronsGroup = new THREE.Group();
		this.electronsGroup.name = 'electronsGroup';
		this.mesh.add(this.mainAtomGroup);
		this.mesh.add(this.electronsGroup);

		

		this.groupMapping = {
			'mainAtomGroup': this.mainAtomGroup,
			'electronsGroup': this.electronsGroup,
		};

		const circleDragColor = new THREE.Color(1, 1, 1).getHex();
		const circleDragGeometry = new THREE.CircleGeometry( 5, 32 );
		const circleDragMaterial = new THREE.MeshBasicMaterial( { color: circleDragColor, transparent: true, opacity: 1 } );
		// const circleDragMaterial = new THREE.LineDashedMaterial({ color: circleDragColor });
		circleDragMaterial.userData.toggleSelected = true;
		// const circleDragMaterial = new THREE.ShaderMaterial({
        //     uniforms: {},
        //     vertexShader: SIMPLE_3D_VERTEX,
        //     fragmentShader: ATOM_CENTER_FRAGMENT,
        // });
		const circleDragMesh = new THREE.Mesh( circleDragGeometry, circleDragMaterial );
		this.mainAtomGroup.add(circleDragMesh);

		const debugGeometry = new THREE.BoxGeometry( 1, 1, 1 );
		const debugMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		this.debugMesh = new THREE.Mesh( debugGeometry, debugMaterial );
		this.debugMesh.position.x = 50;
		this.debugMesh.position.y = 50;
		// this.debugMesh.position.z = 50;
		// this.mainAtomGroup.add( this.debugMesh );

		this.rings = {};

		this.ringMeshGroup = new THREE.Group();

		const startRadius = 6;
		const margin = 3;
		const ringDefKeys = Object.keys(RING_DEF);
		for (let i = 0; i < ringDefKeys.length; i++) {
			const key = ringDefKeys[i];
			const ringDef = RING_DEF[key];
			const radius = startRadius + i * 2;
			const ring = new AtomCircle(radius, ringDef, i);
			this.ringMeshGroup.add(ring.mesh);
			this.rings[i] = ring;
		}
		
		this.mainAtomGroup.add(this.ringMeshGroup);

        const protonsParam = {
			title: 'Protoner',
			param: 'protons',
			useAsInput: true,
			parent: 'Protoner',
			paramHelpersType: 'atom',
			needsFrameUpdate: false,
			minMax: {min: 1, max: 20},
			defaultVal: 1,
		};

        const electronsParam = {
			title: 'Elektroner',
			param: 'electrons',
			useAsInput: true,
			parent: 'Elektroner',
			paramHelpersType: 'atom',
			needsFrameUpdate: false,
			minMax: {min: 1, max: 20},
			defaultVal: 1,
		};

        const neutronsParam = {
			title: 'Neutroner',
			param: 'neutrons',
			useAsInput: true,
			parent: 'Neutroner',
			paramHelpersType: 'atom',
			needsFrameUpdate: false,
			minMax: {min: 1, max: 20},
			defaultVal: 1,
		};

		this.params = {
            protonsParam,
            electronsParam,
            neutronsParam,
		};

		this.paramVals = {};
	}

	setScale(value) {
		this.mesh.scale.set(value, value, value);
	}

	enableHide() {
		this.mesh.traverseVisible((t) => {
			if (t.material && t.material.userData.toggleSelected) {
				t.material.opacity = 0.05;
			}
		});
	}

	disableHide() {
		this.mesh.traverseVisible((t) => {
			if (t.material && t.material.userData.toggleSelected) {
				t.material.opacity = 1.0;
			}
		});
	}

	setForegroundRender(foregroundRender) {
		this.foregroundRender = foregroundRender;

		this.foregroundRender.scene.add(this.debugMesh);

		// THIS IS USED TO KNOW WHICH ATOMNODE SHOULD GET THE DRAG EVT
		this.mesh.userData.nodeID = this.ID;

		this.foregroundRender.dragControls.addEventListener('dragstart', this.onDragStartBound);
		this.foregroundRender.dragControls.setObjects(this.mainAtomGroup.children, `${this.ID}-mainAtomGroup`);
	}

	getAvailableCorePositions(paramKey, amountPositions) {
		const keys = Object.keys(this.corePositions);
		const paramKeyPositionKeys = keys.filter(t => this.corePositions[t].type === paramKey);
		const finalParamKeyPositionKeys = paramKeyPositionKeys.slice(0, amountPositions);
		return finalParamKeyPositionKeys.map(t => this.corePositions[t].pos);
	}

	getCartesianForRing(angle, ringIndex) {
		const ring = this.visibleRings[ringIndex];
		const pos = this.position;
		const x = pos.x + ring.mesh.position.x + ring.radius * Math.cos(angle);
		const y = pos.y + ring.mesh.position.y + ring.radius * Math.sin(angle);

		return { x, y };
	}

	syncAtomRings(childrenCount) {
		this.visibleRings = [];
		const amountRings = getAmountRings(childrenCount, RING_DEF);
		const ringsLength = Object.keys(this.rings).length;
		for (let i = 0; i < ringsLength; i++) {
			const visible = i < amountRings;
			this.rings[i].mesh.visible = visible;
			if (visible) {
				this.visibleRings.push(this.rings[i]);
			}
		}
	}

	updateMeshType(meshGroup, paramKey, enableDragging, controlsAmountAtomRings, groupToModify) {
		const group = this.groupMapping[groupToModify] || this.mainAtomGroup;

		if (enableDragging) {
			this.foregroundRender.dragControls.setObjects(meshGroup.children, `${this.ID}-${paramKey}`);
		}

		const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');

		// ONLY RUNNED ONCE INITIALLY --- UGLY BUT IT WORKS..
		if (!electronsModifierNode.atomBackendSynced && paramKey === 'electrons') {
			const electrons = electronsModifierNode.electrons;
			const electronKeys = Object.keys(electrons);
			let index = 0;
			Object.keys(this.initRingConnections).forEach(t => {
				const amount = this.initRingConnections[t];
				for (let i = 0; i < amount; i++) {
					electrons[electronKeys[index]].setConnectionStatus(t);
					index++;
				}
			});
			electronsModifierNode.atomBackendSynced = true;
		}

		const connectedElectrons = electronsModifierNode.getConnectedElectrons();

		this.syncAtomRings(connectedElectrons.length);

		if (paramKey === 'electrons') {
			updateMeshTypeMapper[paramKey](
				group, paramKey, meshGroup, this.initRingConnections, electronsModifierNode.electrons, this.visibleRings, this.position,
			);
		} else {
			updateMeshTypeMapper[paramKey](group, paramKey, meshGroup);
		}
	}

	onAtomDisconnect() {
		console.log('atom disconnect');
		const connectionIds = window.NS.singletons.LessonManager.atomConnectionsManager.findConnections(this.ID);
		connectionIds.forEach(connectionId => {
			const connection = window.NS.singletons.LessonManager.atomConnectionsManager.getConnection(connectionId);
			const { positionKey: dragAtomPosKey, id: dragAtomId } = connection.dragAtom;
			const { positionKey: connectingAtomPosKey, id: connectingAtomId } = connection.connectingAtom;


			const dragAtom = window.NS.singletons.ConnectionsManager.getNode(dragAtomId);
			dragAtom.outerRing.markPositionAsAvailable(dragAtomPosKey);

			const connectingAtom = window.NS.singletons.ConnectionsManager.getNode(connectingAtomId);
			connectingAtom.outerRing.markPositionAsAvailable(connectingAtomPosKey);


			window.NS.singletons.LessonManager.atomConnectionsManager.removeConnection(connectionId)
		});
	}

	onDragStart({object}) {
		this.foregroundRender.disableCameraControls();

		if (isDragEvtAtom(object, this.ID, false)) {
			this.foregroundRender.dragControls.addEventListener('drag', this.onDragBound);
			this.foregroundRender.dragControls.addEventListener('dragend', this.onDragEndBound);
		} else {
			return;
		}

		if (isElectron(object)) {
			this.dragData = Object.assign({}, this.dragData, getStartDragDataElectron(this.ID, this.position, object));
		}

		if (isMainAtom(object)) {
			this.dragData = Object.assign({}, this.dragData, getStartDragDataAtom(object, this.ID, this.type, this.position, this.outerRing));
			if (this.dragData.isConnected) {
				console.log('create disconnect handler');
				this.disconnectHandler = new AtomDisconnectHandler(this.atomDisconnectCallback, object.position);
			}
		}
	}

	onDrag({ object }) {
		if (isElectron(object)) {
			this.dragData = Object.assign({}, this.dragData, getDraggingElectronDragData(object, this.visibleRings, this.dragData));
		}

		if (isMainAtom(object)) {
			this.dragData = Object.assign({}, this.dragData, getDraggingAtomDragData(object, this));

			if (this.dragData.isConnected) {
				console.log('on move');
				this.disconnectHandler.onMove(object.position);
			}
		}

		object.position.z = 0;
	}

	onDragEnd({object}) {
		const { releasePoint, ringToReleaseOn, atomToConnect, electronObj } = this.dragData;

		if (isElectron(object)) {
			onElectronDragEnd(ringToReleaseOn, electronObj, this.visibleRings, this.position, object);

			// BACKEND SYNC
			const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
			const connectedElectrons = electronsModifierNode.getConnectedElectrons();
			syncConnectedElectrons(this.ID, connectedElectrons);
			this.syncAtomRings(connectedElectrons.length);

			this.dragData.releasePoint = null;
			this.dragData.ringToReleaseOn = null;
			this.dragData.electronObj = null;
		}

		if (isMainAtom(object)) {
			if (this.dragData.isConnected) {
				this.disconnectHandler.onEnd();
				if (this.disconnectHandler.hasDisconnected) {
					return;
				}
			}

			this.disconnectHandler = undefined;
			const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
			const connectedElectrons = electronsModifierNode.getConnectedElectrons();
			onAtomDragEnd(this, connectedElectrons);
			// if (atomToConnect) {
			// 	// const animateObj = new AnimateObject(object, releasePoint, () => {
			// 	// 	// callback when animate done --- get atom pos and update backend
			// 	// 	const pos = this.position;
			// 	// 	updateAtomPos(this.ID, { x: pos.x, y: pos.y });

			// 	// 	window.NS.singletons.LessonManager.atomConnectionsManager.addConnection(this.ID, atomToConnect.ID);

			// 	// 	this.dragData.releasePoint = null;
			// 	// 	this.dragData.atomToConnect = null;
			// 	// });
			// 	// atomToConnect.outerRing.setDefault();

			// 	// this.dragData.connectedElectrons.forEach(t => {
			// 	// 	t.isConnectingToAtom = false;
			// 	// 	const ring = this.rings[t.getRingIndex()];
			// 	// 	const pos = ring.getConnectedElectronPosition(object.position, t.ringPositionKey);ä

			// 	// 	t.mesh.position.x = pos.x;
			// 	// 	t.mesh.position.y = pos.y;
			// 	// });
			// } else {
			// 	// get atom pos and update backend
			// 	const pos = this.position;
			// 	this.dragData.releasePoint = null;
			// 	this.dragData.atomToConnect = null;
			// 	syncAtomPos(this.ID, { x: pos.x, y: pos.y });	
			// }
		}

		this.dragData.connectedElectrons = [];

		this.foregroundRender.enableCameraControls();

		this.foregroundRender.dragControls.removeEventListener('drag', this.onDragBound);
		this.foregroundRender.dragControls.removeEventListener('dragend', this.onDragEndBound);
	}

	removeFromDom() {
		super.removeFromDom();

		this.foregroundRender.dragControls.removeEventListener('dragstart', this.onDragStartBound);
		this.foregroundRender.dragControls.removeEventListener('drag', this.onDragBound);
		this.foregroundRender.dragControls.removeEventListener('dragend', this.onDragEndBound);

	}
	
	// THIS IS USED TO CHECK FOR CONNECTIONS BETWEEN ATOMS
	getNotCompleteElectronPairs() {
		const outerRing = this.outerRing;
		if (!outerRing) {
			return [];
		}

		return outerRing.getNotCompletePairs();
	}

	get position() {
		const pos = new THREE.Vector2();
		pos.x = this.mainAtomGroup.position.x;
		pos.y = this.mainAtomGroup.position.y;
		return pos;
	}

	set position(value) {
		this.mainAtomGroup.position.x = value.x;
		this.mainAtomGroup.position.y = value.y;
	}

	get outerRing() {
		if (this.visibleRings.length > 0) {
			return this.visibleRings[this.visibleRings.length - 1];
		}

		return undefined;
	}

}