import GraphicNode from '../GraphicNode';
import AtomCircle from './AtomCircle';
import {
	getAmountRings,
	updateConnectedElectrons,
	isElectron,
	isMainAtom,
	updateMeshTypeMapper,
	DragObjectsSync,
	isDragEvtAtom,
} from './helpers';
import AnimateObject from './AnimateObject';
import { SIMPLE_3D_VERTEX, ATOM_CENTER_FRAGMENT } from '../../../shaders/SHADERS';

const RING_DEF = Object.freeze({
	0: {
		amountElectrons: 2,
	},
	1: {
		amountElectrons: 6,
	},
	2: {
		amountElectrons: 14,
	}
})

export default class AtomNode extends GraphicNode{
	static get tag() { return 'AtomNode' };
	constructor(renderer, backendData) {
		super();

		this.initRingConnections = (backendData && backendData.data.ringConnections) ? backendData.data.ringConnections : {};

		this.dragObjectsSync = new DragObjectsSync();

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
		};

		this.mainAtomDragData = {
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

		// const debugGeometry = new THREE.BoxGeometry( 1, 1, 1 );
		// const debugMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
		// this.debugMesh = new THREE.Mesh( debugGeometry, debugMaterial );
		// this.debugMesh.position.x = 50;
		// this.debugMesh.position.y = 50;
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

		const positionXParam = {
			title: 'Position X',
			param: 'x',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
			defaultConnect: true,
		};

		const positionYParam = {
			title: 'Position Y',
			param: 'y',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
			defaultConnect: false,
		};

		const positionZParam = {
			title: 'Position Z',
			param: 'z',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
			defaultConnect: true,
		};

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
			positionXParam,
			positionYParam,
			positionZParam,
		};

		this.paramVals = {};
	}

	setForegroundRender(foregroundRender) {
		this.foregroundRender = foregroundRender;

		// THIS IS USED TO KNOW WHICH ATOMNODE SHOULD GET THE DRAG EVT
		this.mesh.userData.nodeID = this.ID;

		this.foregroundRender.dragControls.addEventListener('dragstart', this.onDragStartBound);
		this.foregroundRender.dragControls.setObjects(this.mainAtomGroup.children, `${this.ID}-mainAtomGroup`);
	}

	getCartesianForRing(angle, ringIndex) {
		const ring = this.visibleRings[ringIndex];
		const x = this.mainAtomGroup.position.x + ring.mesh.position.x + ring.radius * Math.cos(angle);
		const y = this.mainAtomGroup.position.y + ring.mesh.position.y + ring.radius * Math.sin(angle);

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

		// BACKEND SYNC
		if (paramKey === 'electrons') {
			const node = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
			updateMeshTypeMapper[paramKey](
				group, paramKey, meshGroup, this.initRingConnections, node.electrons, this.getCartesianForRing.bind(this),
			);
		} else {
			updateMeshTypeMapper[paramKey](group, paramKey, meshGroup);
		}
	}

	onElectronDrag(dragObj, visibleRings, centerPoint) {
		const getAngle = (centerPosition) => {
			const diffX = dragObj.position.x - centerPosition.x;
			const diffY = dragObj.position.y - centerPosition.y;
			return Math.atan2(diffY, diffX);
		}

		const angle = getAngle(centerPoint);
		
		const visibleRingsLength = visibleRings.length;
		for (let i = 0; i < visibleRingsLength; i++) {
			const ring = visibleRings[i];
			const x = centerPoint.x + ring.mesh.position.x + ring.radius * Math.cos(angle);
			const y = centerPoint.y + ring.mesh.position.y + ring.radius * Math.sin(angle);

			const circlePoint = new THREE.Vector2(x, y);
			const dragObjVector = new THREE.Vector2(dragObj.position.x, dragObj.position.y);
			const dist = circlePoint.distanceTo(dragObjVector);

			if (dist < 1.0) {
				this.dragData.ringToReleaseOn = ring;
				this.dragData.releasePoint = circlePoint;
				ring.setHighlighted();
			} else {
				if (this.dragData.ringToReleaseOn && this.dragData.ringToReleaseOn.index === ring.index) {
					this.dragData.ringToReleaseOn = null;
					this.dragData.releasePoint = null;
				}
				ring.setDefault();
			}

			// const debugX = ring.mesh.position.x + ring.radius * Math.cos(angle);
			// const debugY = ring.mesh.position.y + ring.radius * Math.sin(angle);

			// this.debugMesh.position.x = debugX;
			// this.debugMesh.position.y = debugY;

			// console.log('d: ', dist);
		}

		this.dragData.electronObj.currentAngle = angle;
	}

	onMainAtomGroupDrag(object) {

		/* CHECk FOR DISTANCE FROM OTHER ATOMS.. */
		const atomsLength = this.dragData.atoms.length;
		const dragAtomPos = this.position;
		for (let i = 0; i < atomsLength; i++) {
			const atom = this.dragData.atoms[i];
			const atomPos = atom.position;

			const distance = dragAtomPos.distanceTo(atomPos);

			console.log('dist: ', distance);
		}

		
		this.mainAtomDragData.connectedElectrons.forEach(t => {
			const ring = this.rings[t.getRingIndex()];
			const x = object.position.x + ring.radius * Math.cos(t.currentAngle);
			const y = object.position.y + ring.radius * Math.sin(t.currentAngle);

			t.mesh.position.x = x;
			t.mesh.position.y = y;
		});


	}

	onDragStart({object}) {
		this.foregroundRender.disableCameraControls();

		/* TODO -- CHECK IF OBJECT IS PARENT OF THIS ATOMNODE.. OR PASS IN ATOMNODE SCOPE TO DRAGCONTROLS   DONT KNOW */

		if (isDragEvtAtom(object, this.ID, false)) {
			this.foregroundRender.dragControls.addEventListener('drag', this.onDragBound);
			this.foregroundRender.dragControls.addEventListener('dragend', this.onDragEndBound);
		} else {
			return;
		}

		const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
		
		if (isMainAtom(object)) {
			if (electronsModifierNode) {
				const connectedElectrons = electronsModifierNode.getConnectedElectrons();
				this.mainAtomDragData.connectedElectrons = connectedElectrons;
			}
			
			const atomNodes = window.NS.singletons.ConnectionsManager.getNodesWithType(this.type, this.ID);
			this.dragData.atoms = atomNodes || [];
			console.log('atom nodes: ', atomNodes, AtomNode.Tag);
		}

		if (electronsModifierNode) {
			if (isElectron(object)) {
				const electronObj = electronsModifierNode.getElectron(object.userData.ID);
				this.dragData.electronObj = electronObj;
				
				this.dragData.centerPoint.x = this.mainAtomGroup.position.x;
				this.dragData.centerPoint.y = this.mainAtomGroup.position.y;
			}
		}
	}

	onDrag({ object }) {
		if (isElectron(object)) {
			this.onElectronDrag(object, this.visibleRings, this.dragData.centerPoint);
		}

		if (isMainAtom(object)) {
			this.onMainAtomGroupDrag(object);
		}
	}

	onDragEnd({object}) {
		const { releasePoint, ringToReleaseOn } = this.dragData;

		if (isElectron(object)) {
			const node = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.ID, 'electrons');
			if (ringToReleaseOn) {
				const { releasePoint, ringToReleaseOn } = this.dragData;
				const animateObj = new AnimateObject(object, releasePoint);
				const objectID = object.userData.ID;
				
				this.dragData.electronObj.setConnectionStatus(ringToReleaseOn.index);

				ringToReleaseOn.setDefault();
				/* ADD ELECTRON TO ATOM CIRCLE */
				/* UPDATE ELECTRON ASSIGNED TO CirCLE IN DB */
				console.log('move to ring', this.dragData.ringToReleaseOn);
			} else {
				this.dragData.electronObj.setConnectionStatus(-1);
			}

			updateConnectedElectrons(this.ID, node.getConnectedElectrons());

			this.dragData.releasePoint = null;
			this.dragData.ringToReleaseOn = null;
			this.dragData.electronObj = null;
		}

		this.mainAtomDragData.connectedElectrons = [];

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

}