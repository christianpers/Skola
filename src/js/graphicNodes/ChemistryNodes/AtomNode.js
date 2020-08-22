import GraphicNode from '../GraphicNode';
import AtomCircle from './AtomCircle';
import {
	getAmountRings,
	updateConnectedElectrons,
	isElectron,
	isMainAtom,
	updateMeshTypeMapper,
	isDragEvtAtom,
	updateAtomPos,
} from './helpers';
import {
	getStartDragData,
	onElectronDragEnd,
	getDraggingElectronDragData,
	getDraggingAtomDragData,
} from './dragHandlers';
import AnimateObject from './AnimateObject';
import { SIMPLE_3D_VERTEX, ATOM_CENTER_FRAGMENT } from '../../../shaders/SHADERS';

export const RING_DEF = Object.freeze({
	0: {
		amountElectrons: 2,
		orbitalPositions: 2, // but only two electrons ? half orbitals ?
	},
	1: {
		amountElectrons: 8,
		orbitalPositions: 4,
	},
	2: {
		amountElectrons: 18,
		orbitalPositions: 9,
	},
	3: {
		amountElectrons: 32,
		orbitalPositions: 16,
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

		this.dragControls = null;

		this.visibleRings = [];

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

		const circleDragColor = new THREE.Color(1, .5, .5).getHex();
		const circleDragGeometry = new THREE.CircleGeometry( 6, 10 );
		const circleDragMaterial = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: SIMPLE_3D_VERTEX,
            fragmentShader: ATOM_CENTER_FRAGMENT,
        });
		// const circleDragMaterial = new THREE.MeshBasicMaterial( { color: circleDragColor } );
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
		for (let i = 0; i < 3; i++) {
			const ringDef = RING_DEF[i];
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

	setForegroundRender(foregroundRender) {
		this.foregroundRender = foregroundRender;

		this.foregroundRender.scene.add(this.debugMesh);

		// THIS IS USED TO KNOW WHICH ATOMNODE SHOULD GET THE DRAG EVT
		this.mesh.userData.nodeID = this.ID;

		this.foregroundRender.dragControls.addEventListener('dragstart', this.onDragStartBound);
		this.foregroundRender.dragControls.setObjects(this.mainAtomGroup.children, `${this.ID}-mainAtomGroup`);
	}

	getCartesianForRing(angle, ringIndex) {
		const ring = this.visibleRings[ringIndex];
		const pos = this.position;
		const x = pos.x + ring.mesh.position.x + ring.radius * Math.cos(angle);
		const y = pos.y + ring.mesh.position.y + ring.radius * Math.sin(angle);

		return { x, y };
	}

	updateMeshType(meshGroup, paramKey, enableDragging, controlsAmountAtomRings, groupToModify) {
		const syncAtomRings = (childrenCount) => {
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

		const group = this.groupMapping[groupToModify] || this.mainAtomGroup;

		if (enableDragging) {
			this.foregroundRender.dragControls.setObjects(meshGroup.children, `${this.ID}-${paramKey}`);
		}

		if (controlsAmountAtomRings) {
			syncAtomRings(meshGroup.children.length);
		}

		if (paramKey === 'electrons') {
			const node = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
			updateMeshTypeMapper[paramKey](
				group, paramKey, meshGroup, this.initRingConnections, node.electrons, this.visibleRings, this.position,
			);
		} else {
			updateMeshTypeMapper[paramKey](group, paramKey, meshGroup);
		}
	}

	onDragStart({object}) {
		this.foregroundRender.disableCameraControls();

		if (isDragEvtAtom(object, this.ID, false)) {
			this.foregroundRender.dragControls.addEventListener('drag', this.onDragBound);
			this.foregroundRender.dragControls.addEventListener('dragend', this.onDragEndBound);
		} else {
			return;
		}

		this.dragData = Object.assign({}, this.dragData, getStartDragData(object, this.ID, this.type, this.position));
	}

	onDrag({ object }) {
		if (isElectron(object)) {
			// this.onElectronDrag(object, this.visibleRings, this.dragData.centerPoint);
			this.dragData = Object.assign({}, this.dragData, getDraggingElectronDragData(object, this.visibleRings, this.dragData));
		}

		if (isMainAtom(object)) {
			// this.onMainAtomGroupDrag(object);
			this.dragData = Object.assign({}, this.dragData, getDraggingAtomDragData(object, this.dragData, this.position, this.outerRing, this.rings, this.ID));
		}
	}

	onDragEnd({object}) {
		const { releasePoint, ringToReleaseOn, atomToConnect, electronObj } = this.dragData;

		if (isElectron(object)) {
			onElectronDragEnd(ringToReleaseOn, electronObj, this.visibleRings, this.position, object);

			// BACKEND SYNC
			const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
			const connectedElectrons = electronsModifierNode.getConnectedElectrons();
			updateConnectedElectrons(this.ID, connectedElectrons);

			this.dragData.releasePoint = null;
			this.dragData.ringToReleaseOn = null;
			this.dragData.electronObj = null;
		}

		if (isMainAtom(object)) {
			if (atomToConnect) {
				const animateObj = new AnimateObject(object, releasePoint, () => {
					// callback when animate done --- get atom pos and update backend
					const pos = this.position;
					updateAtomPos(this.ID, { x: pos.x, y: pos.y });

					window.NS.singletons.LessonManager.atomConnectionsManager.addConnection(this.ID, atomToConnect.ID);

					this.dragData.releasePoint = null;
					this.dragData.atomToConnect = null;
				});
				atomToConnect.outerRing.setDefault();

				this.dragData.connectedElectrons.forEach(t => {
					const ring = this.rings[t.getRingIndex()];
					const electronIndexInRing = ring.getElectronRingIndex(t.ID);
					const pos = ring.getElectronPosition(object.position, electronIndexInRing);

					t.mesh.position.x = pos.x;
					t.mesh.position.y = pos.y;
				});
			} else {
				// get atom pos and update backend
				const pos = this.position;
				this.dragData.releasePoint = null;
				this.dragData.atomToConnect = null;
				updateAtomPos(this.ID, { x: pos.x, y: pos.y });
			}
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

	get position() {
		const pos = new THREE.Vector2();
		pos.x = this.mainAtomGroup.position.x;
		pos.y = this.mainAtomGroup.position.y;
		return pos;
	}

	get outerRing() {
		if (this.visibleRings.length > 0) {
			return this.visibleRings[this.visibleRings.length - 1];
		}

		return undefined;
	}

}