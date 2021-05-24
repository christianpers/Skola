import GraphicNode from '../GraphicNode';
import AtomCircle from './AtomCircle';
import * as Events from './events';
import { mixins } from './mixins';
import {
	getAmountRings,
	syncAtomPos,
	updateMeshTypeMapper,
	getProtonsNeutronsPositions,
	getCurrentElectronConnections,
	resetElectronAndRing,
} from './helpers';

import AnimateObject from './AnimateObject';
import { SIMPLE_3D_VERTEX, ATOM_CENTER_FRAGMENT } from '../../../shaders/SHADERS';
// import AtomHTMLLabel from './AtomHTMLLabel';

import './index.scss';

export const RING_DEF = Object.freeze({
	0: {
		amountElectrons: 2,
		orbitalPositions: 1, // but only two electrons ? half orbitals ?
		orbitals: 1,
	},
	1: {
		amountElectrons: 8,
		orbitalPositions: 4,
		orbitals: 4,
	},
	2: {
		amountElectrons: 18,
		orbitalPositions: 9,
		orbitals: 9,
	},
	3: {
		amountElectrons: 32,
		orbitalPositions: 16,
		orbitals: 16,
	}
});

export default class AtomNode extends mixins.AtomEventHandler(mixins.AtomDragEvents(GraphicNode)){
	static get tag() { return 'AtomNode' };
	constructor(renderer, backendData) {
		super();

		this.initRingConnections = (backendData && backendData.data.ringConnections) ? backendData.data.ringConnections : {};
		const visualPos = (backendData && backendData.data.visualPos) ? backendData.data.visualPos : { x: 0, y: 0 };

		this.isForegroundNode = true;
		this.isRendered = true;
		this.noIcon = true;

		this.corePositions = getProtonsNeutronsPositions();

		this.dragControls = null;

		this.visibleRings = [];

		this._visualAmountWrapper = document.createElement('div');
		this._visualAmountWrapper.classList.add('visual-amount-wrapper');
		this._visualAmountEl = document.createElement('h4');
		this._visualAmountEl.innerHTML = '0';

		this._visualAmountWrapper.appendChild(this._visualAmountEl);

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

		const circleDragColor = new THREE.Color(0, 0, 0).getHex();
		const circleDragGeometry = new THREE.CircleGeometry( 5, 32 );
		const circleDragMaterial = new THREE.MeshBasicMaterial( { color: circleDragColor, transparent: true, opacity: 1 } );
		circleDragMaterial.userData.toggleSelected = true;
		this.circleDragMesh = new THREE.Mesh( circleDragGeometry, circleDragMaterial );
		this.mainAtomGroup.add(this.circleDragMesh);

		const disconnectProgressColor = new THREE.Color(1, 0, 0).getHex();
		const disconnectProgressGeometry = new THREE.CircleGeometry( 5, 32 );
		const disconnectProgressMaterial = new THREE.MeshBasicMaterial( { color: disconnectProgressColor } );

		this.disconnectProgressMesh = new THREE.Mesh( disconnectProgressGeometry, disconnectProgressMaterial );
		this.disconnectProgressMesh.visible = false;
		this.mainAtomGroup.add(this.disconnectProgressMesh);


		const debugGeometry = new THREE.BoxGeometry( 1, 1, 1 );
		const debugMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		this.debugMesh = new THREE.Mesh( debugGeometry, debugMaterial );
		this.debugMesh.position.x = 50;
		this.debugMesh.position.y = 50;
		// this.debugMesh.position.z = 50;
		// this.mainAtomGroup.add( this.debugMesh );

		this.rings = {};

		this.ringMeshGroup = new THREE.Group();

		this.mainAtomGroup.add(this.ringMeshGroup);

		this.onAtomConnectionUpdateEvent = this.onAtomConnectionUpdateEvent.bind(this);
		document.documentElement.addEventListener(Events.ON_ATOM_CONNECTION_UPDATE, this.onAtomConnectionUpdateEvent);

		this.onOrbitalChangeEvent = this.onOrbitalChange.bind(this);
		this.el.addEventListener(Events.ON_ORBITAL_POSITIONS_UPDATE, this.onOrbitalChangeEvent);

		

        const protonsParam = {
			title: 'Protoner',
			param: 'protons',
			useAsInput: true,
			parent: 'Protoner',
			paramHelpersType: 'atom',
			needsFrameUpdate: false,
			minMax: {min: 1, max: 20},
			defaultVal: 1,
			defaultConnect: true,
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
			defaultConnect: true,
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
			defaultConnect: true,
		};

		this.params = {
            protonsParam,
            electronsParam,
            neutronsParam,
		};

		this.paramVals = {};
	}

	nodeCreated(nodeConfig) {
		super.nodeCreated(nodeConfig);

		const startRadius = 6;
		const margin = 3;
		// const ringDefKeys = Object.keys(RING_DEF);
		// for (let i = 0; i < ringDefKeys.length; i++) {
		// 	const key = ringDefKeys[i];
		// 	// const ringDef = RING_DEF[key];
		// 	const radius = startRadius + i * 2;
		// 	const ring = new AtomCircle(radius, ringDef, i, this.el);
			
		// 	// this.ringMeshGroup.add(ring.mesh);
		// 	this.rings[i] = ring;
		// }

		/*
		
			IM PAUSING CHEMISTRY ! SORRY
			
		*/
		
		/* START LOOK INTO ADDING EVENTS FROM MAIN STATE THAT ATOM REACTS TO  MAYBE CREATE A VISUAL ATOM CLASS THAT IS THE RENDERED ATOM IN CANVAS */

		window.NS.singletons.LessonManager.chemistryState.createAtom(this.ID);
		// Object.keys(this.rings).forEach(t => {
		// 	const ring = this.rings[t];
		// 	ring.init(this.ID);
		// 	this.ringMeshGroup.add(ring.mesh);
		// });

		console.log(window.NS.singletons.LessonManager.chemistryState);

		this.innerContainer.appendChild(this._visualAmountWrapper);
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

		// this._atomHTMLLabel = new AtomHTMLLabel();
		
		// window.NS.singletons.CanvasNode.addMeshLabel(this.mainAtomGroup, this.ID, this._atomHTMLLabel);

		// THIS IS USED TO KNOW WHICH ATOMNODE SHOULD GET THE DRAG EVT
		this.mesh.userData.nodeID = this.ID;

		this.foregroundRender.dragControls.addEventListener('dragstart', this.onDragStartBound);
		this.foregroundRender.dragControls.setObjects(this.mainAtomGroup.children, `${this.ID}-mainAtomGroup`);
	}

	// used for protons and neutrons  should prob be moved somewhere else  called from paramhelpers
	getCorePositions({ amountPerType, totalAmount }) {
		const getAvailableKeysLength = (arr, stateObj) => {
			const ret = arr.filter(t => {
				const state = stateObj[t.paramID];
				return state.positions.length <= state.total;
			});

			return ret.length;
		}

		const stateObj = amountPerType.reduce((acc, curr) => {
			acc[curr.paramID] = {
				total: curr.amountPositions,
				positions: [],
				outNodeID: curr.outNodeID
			};

			return acc;
		}, {});
		
		const keys = Object.keys(this.corePositions).slice(0, totalAmount);
		
		// sorting this cause we default to index 0 in the loop
		const amountKeys = amountPerType.sort((a, b) => {
			return b.amountPositions - a.amountPositions;
		});

		for (let i = 0; i < totalAmount; i++) {
			let index = i % getAvailableKeysLength(amountPerType, stateObj);
			let obj = amountKeys[index];
			const corePosition = this.corePositions[keys[i]].pos;
			stateObj[obj.paramID].positions.push(corePosition);
		}

		return stateObj;

	}

	getCartesianForRing(angle, ringIndex) {
		const ring = this.visibleRings[ringIndex];
		const pos = this.position;
		const x = pos.x + ring.mesh.position.x + ring.radius * Math.cos(angle);
		const y = pos.y + ring.mesh.position.y + ring.radius * Math.sin(angle);

		return { x, y };
	}

	// syncAtomRings(childrenCount) {
	// 	this.visibleRings = [];
	// 	const amountRings = getAmountRings(childrenCount, RING_DEF);
	// 	const ringsLength = Object.keys(this.rings).length;
	// 	for (let i = 0; i < ringsLength; i++) {
	// 		const visible = i < amountRings;
	// 		this.rings[i].mesh.visible = visible;
	// 		if (visible) {
	// 			this.visibleRings.push(this.rings[i]);
	// 		}
	// 	}
	// }

	/* THIS IS CALLED FROM MODIFIERS WHICH RESPONDS TO THE PARAM CONNECTION (ADD/REMOVE) EVENTS FROM CONNECTIONSMANAGER */
	onModifierDisconnect(modifierID) {
		const modifierNode = window.NS.singletons.ConnectionsManager.getNode(modifierID);
		if (modifierNode.controlsAmountAtomRings) {
			const connectionIds = window.NS.singletons.LessonManager.atomConnectionsManager.findConnections(this.ID);
			connectionIds.forEach(connectionId => {
				const connection = window.NS.singletons.LessonManager.atomConnectionsManager.getConnection(connectionId);
				const { positionKey: dragAtomPosKey, id: dragAtomId } = connection.dragAtom;
				const { positionKey: connectingAtomPosKey, id: connectingAtomId } = connection.connectingAtom;

				// resetElectronAndRing(dragAtomId, dragAtomPosKey);
				// resetElectronAndRing(connectingAtomId, connectingAtomPosKey);

				window.NS.singletons.LessonManager.atomConnectionsManager.removeConnection(connectionId)
			});

			//SYNC BACKEND
			window.NS.singletons.LessonManager.atomConnectionsManager.syncConnections();

			// this.visibleRings = [];
			// const ringsLength = Object.keys(this.rings).length;
			// for (let i = 0; i < ringsLength; i++) {
			// 	this.rings[i].mesh.visible = false;
			// }
		}
	}

	// called from ParamHelpers when connected modifiers changes
	updateMeshType(meshGroup, paramKey, enableDragging, groupToModify) {
		const group = this.groupMapping[groupToModify] || this.mainAtomGroup;

		if (enableDragging) {
			this.foregroundRender.dragControls.setObjects(meshGroup.children, `${this.ID}-${paramKey}`);
		}

		const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');

		// ONLY RUNNED ONCE INITIALLY --- UGLY BUT IT WORKS..
		// if (electronsModifierNode && !electronsModifierNode.atomBackendSynced && paramKey === 'electrons') {
		// 	const electrons = electronsModifierNode.electrons;
		// 	const electronKeys = Object.keys(electrons);
		// 	if (electronKeys.length > 0) {
		// 		let index = 0;
		// 		Object.keys(this.initRingConnections).forEach(t => {
		// 			const amount = this.initRingConnections[t];
		// 			for (let i = 0; i < amount; i++) {
		// 				electrons[electronKeys[index]].setConnectionStatus(t);
		// 				index++;
		// 			}
		// 		});
		// 	}
			
		// 	electronsModifierNode.atomBackendSynced = true;
		// }

		// if (electronsModifierNode) {
		// 	const connectedElectrons = electronsModifierNode.getConnectedElectrons();

		// 	this.syncAtomRings(connectedElectrons.length);
		// }
		

		// if (paramKey === 'electrons') {
		// 	updateMeshTypeMapper[paramKey](
		// 		group, paramKey, meshGroup, this.initRingConnections, electronsModifierNode.electrons, this.visibleRings, this.position,
		// 	);
		// } else {
		// 	updateMeshTypeMapper[paramKey](group, paramKey, meshGroup);
		// }

		this.updateAtomHTML();
	}

	updateAtomHTML() {
		// const protonsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'protons');
		// let amountProtons = 0;
		// if (protonsModifierNode) {
		// 	amountProtons = protonsModifierNode.getAmount();
		// }

		// const amountElectrons = this.visibleRings.reduce((amount, ring) => {
		// 	const amountPositions = ring.totalAmountPositions();
		// 	const amountAvailPositions = ring.getAvailablePositionKeys();
		// 	return amount + (amountPositions - amountAvailPositions.length);
		// }, 0);
		
		// const charge = amountProtons - amountElectrons;
		// const prefix = charge >= 0 ? '+' : '-';
		// this._visualAmountEl.innerHTML = `${prefix}${charge}`;

		// const atomChargeChangeEvent = new CustomEvent(Events.ON_ATOM_CHARGE_CHANGE, { detail: { protons: amountProtons, electrons: amountElectrons }});
        // this.el.dispatchEvent(atomChargeChangeEvent);
	}

	removeFromDom() {
		// window.NS.singletons.CanvasNode.removeMeshLabel(this.ID);
		window.NS.singletons.LessonManager.chemistryState.deleteAtom(this.ID);
		super.removeFromDom();

		this.foregroundRender.dragControls.removeEventListener('dragstart', this.onDragStartBound);
		this.foregroundRender.dragControls.removeEventListener('drag', this.onDragBound);
		this.foregroundRender.dragControls.removeEventListener('dragend', this.onDragEndBound);

	}

	get position() {
		const pos = new THREE.Vector2();
		pos.x = this.mainAtomGroup.position.x;
		pos.y = this.mainAtomGroup.position.y;
		return pos;
	}

	set position(value) {
		this.mainAtomGroup.position.set(value.x, value.y, 0);
	}

	// get outerRing() {
	// 	if (this.visibleRings.length > 0) {
	// 		return this.visibleRings[this.visibleRings.length - 1];
	// 	}

	// 	return undefined;
	// }
}