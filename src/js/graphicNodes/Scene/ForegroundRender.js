import Stars from './lessons/space/Stars';
import CameraKeyboardBindings from './CameraKeyboardBindings';
import {
	getObjToMove,
} from '../ChemistryNodes/helpers';
import { DragControls } from '../../../DragControls';

import CameraControls from 'camera-controls';

export default class ForegroundRender{
	constructor(mainRender, canvas) {

		this.activeCamera = null;

		const w = window.innerWidth;
		const h = window.innerHeight;

		this.clock = new THREE.Clock();

		// CameraControls.install( { THREE: THREE } );

		this.camera = new THREE.PerspectiveCamera( 60, w / h, 0.01, 10000 );
		this.camera.position.z = 10;

		// this.cameraControls = new CameraControls( this.camera, mainRender.renderer.domElement );

		// this.cameraKeyboardBindings = new CameraKeyboardBindings(this.cameraControls);

		this.activeCamera = this.camera;

		this.cameraControls = new THREE.OrbitControls( this.camera, canvas );
		this.cameraControls.enabled = true;

		this.cameraControlsChangedBound = this.cameraControlsChanged.bind(this);
		this.cameraControls.addEventListener('change', this.cameraControlsChangedBound);

		this.currentActiveKey;
		this.activeHelperMeshes = {};

		this.scene = new THREE.Scene();
		this.renderer = mainRender.renderer;

		this.axesHelper = new THREE.AxesHelper( 5 );
		this.axesHelper.name = 'AxesHelper';

		/* TODO MAYBE LOOK INTO THIS GRID THING A BIT MORE */
		// this.gridHelper = new THREE.GridHelper(4, 10);
		// this.scene.add(this.gridHelper);

		this.ambientLight = new THREE.AmbientLight();

		this.scene.add(this.ambientLight);
		
		if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.space.id) {
			this.stars = new Stars(this.scene);
			this.ambientLight.intensity = 0.5;
		}

		this.showActiveHelperMeshes = true;
		if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.chemistry.id) {
			this.showActiveHelperMeshes = false;

			this.camera.position.z = 50;

			// this.cameraControls.maxDistance = 41;
			// this.cameraControls.minDistance = 41;
			// this.cameraControls.enableZoom = false;
			// this.cameraControls.minPolarAngle = -10;

			this.cameraControls.screenSpacePanning = true;
			this.cameraControls.enableRotate = false;

			const light = new THREE.PointLight( 0xffffff, 1, 100 );
			light.position.set( -10, 10, 50 );
			this.scene.add( light );

			const camera = this.getCamera();
			const domEl = this.getDomNode();

			this.dragControls = new DragControls(camera, domEl, getObjToMove);
		}

		this.connectedNodes = [];
		this.hasConnectedLight = false;

		this.meshToFollow = null;

		this.framebuffer = new THREE.WebGLRenderTarget(
			640,
			600,
			{minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
		);
	}

	fitCameraToObjects() {
		if (!this.connectedNodes.length) {
			return;
		}
		const bb = new THREE.Box3();
		this.connectedNodes.forEach(t => {
			bb.expandByObject(t.mesh);
		});

		const offset = 6;
		const center = bb.getCenter();
		const size = bb.getSize();

		// get the max side of the bounding box (fits to width OR height as needed )
		const maxDim = Math.max( size.x, size.y, size.z );
		const fov = this.camera.fov * ( Math.PI / 180 );
		let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );

		cameraZ *= offset; // zoom out a little so that objects don't fill the screen

		this.camera.position.z = cameraZ;

		// this.camera.far = cameraToFarEdge * 3;
		this.camera.updateProjectionMatrix();


		// set camera to rotate around center of loaded object
		this.cameraControls.target = center;

		// prevent camera from zooming out far enough to create far plane cutoff
		// this.cameraControls.maxDistance = cameraToFarEdge * 2;

		this.cameraControls.saveState();

	}

	setMeshToFollow(mesh) {
		this.meshToFollow = mesh;
	}

	resetMeshToFollow() {
		this.meshToFollow = null;
		this.cameraControls.target = new THREE.Vector3();
	}

	setActiveCamera(camera) {
		this.activeCamera = camera;
	}

	resetActiveCamera() {
		this.activeCamera = this.camera;
	}

	cameraControlsChanged(evt) {
		const cameraChangedEvent = new CustomEvent('camera-pos-changed', { detail: evt.target.object.position });
        document.documentElement.dispatchEvent(cameraChangedEvent);
	}

	toggleAxesHelper(enable) {
		if (enable) {
			this.scene.add(this.axesHelper);
		} else {
			const axesHelper = this.scene.getObjectByName(this.axesHelper.name);
			this.scene.remove(this.axesHelper);
		}
	}

	toggleCameraControl(enable) {
		if (enable) {
			this.cameraControls.enabled = true;
			this.renderer.domElement.classList.add('prevent-drag');
		} else {
			this.cameraControls.enabled = false;
			this.renderer.domElement.classList.remove('prevent-drag');
		}
	}

	addLight(node) {
		this.connectedNodes.push(node);
		const lightName = `${node.ID}-light`;
		node.light.name = lightName;

		const meshName = `${node.ID}-mesh`;
		node.mesh.name = meshName;

		this.scene.add(node.light);
		this.scene.add(node.mesh);
		this.hasConnectedLight = true;

		this.createPlaneMesh(node, meshName);
	}

	removeLight(node) {
		this.connectedNodes = this.connectedNodes.filter(t => t.ID !== node.ID);
		const lightName = `${node.ID}-light`;
		const light = this.scene.getObjectByName(lightName);
		this.scene.remove(light);

		const meshName = `${node.ID}-mesh`;
		const mesh = this.scene.getObjectByName(meshName);
		this.scene.remove(mesh);

		this.hasConnectedLight = false;

		if (!this.showActiveHelperMeshes) {
			return;
		}

		const activeMeshKey = `${meshName}-active`;
		if (this.activeHelperMeshes[activeMeshKey]) {
			delete this.activeHelperMeshes[activeMeshKey];
		}
	}

	addNode(node) {
		this.connectedNodes.push(node);

		const meshName = `${node.ID}-mesh`;
		node.mesh.name = meshName;
		this.scene.add(node.mesh);

		if (node.mesh.userData) {
			if (node.mesh.userData.getForegroundRender) {
				node.setForegroundRender(this);
			}
		}

		if (node.camera) {
			node.camera.lookAt(this.scene.position);
		}
		
		if (!node.isRendered) {
			return;
		}

		this.createPlaneMesh(node, meshName);
	}
	

	removeNode(node) {
		this.connectedNodes = this.connectedNodes.filter(t => t.ID !== node.ID);

		const meshName = `${node.ID}-mesh`;
		const mesh = this.scene.getObjectByName(meshName);
		this.scene.remove(mesh);

		if (!this.showActiveHelperMeshes) {
			return;
		}

		const activeMeshKey = `${meshName}-active`;
		if (this.activeHelperMeshes[activeMeshKey]) {
			delete this.activeHelperMeshes[activeMeshKey];
		}
	}

	getCamera() {
		return this.camera;
	}

	getDomNode() {
		return this.renderer.domElement;
	}

	disableCameraControls() {
		this.cameraControls.enabled = false;
	}

	enableCameraControls() {
		this.cameraControls.enabled = true;
	}

	createPlaneMesh(node, meshName) {
		// Plane for showing when mesh selected
		if (!this.showActiveHelperMeshes) {
			return;
		}

		const helperMesh = node.getActiveHelperMesh();
		if (helperMesh) {
			node.mesh.add(helperMesh);

			this.activeHelperMeshes[`${meshName}-active`] = helperMesh;
		}
		
	}

	showActive(nodeID) {
		if (!this.showActiveHelperMeshes) {
			return;
		}
		const keys = Object.keys(window.NS.singletons.ConnectionsManager.nodes);
		const isRenderedKeys = keys.filter(t => window.NS.singletons.ConnectionsManager.nodes[t].isRendered);
		isRenderedKeys.forEach(t => {
			const meshName = `${t}-mesh-active`;
			if (this.activeHelperMeshes[meshName]) {
				this.activeHelperMeshes[meshName].visible = false;
			}
		});


		const meshName = `${nodeID}-mesh-active`;
		if (this.activeHelperMeshes[meshName]) {
			this.currentActiveKey = meshName;
			if (this.activeHelperMeshes[meshName]) {
				this.activeHelperMeshes[meshName].visible = true;
			}
			
		}
		
		// console.log('show active: ', nodeID, this.activeHelperMeshes)
	}

	hideActive(nodeID) {
		if (!this.showActiveHelperMeshes) {
			return;
		}
		const meshName = `${nodeID}-mesh-active`;
		if (this.activeHelperMeshes[this.currentActiveKey] && this.currentActiveKey === meshName) {
			this.activeHelperMeshes[this.currentActiveKey].visible = false;
			this.currentActiveKey = null;
		}
	}

	update() {
		if (this.showActiveHelperMeshes && this.currentActiveKey && this.activeHelperMeshes[this.currentActiveKey]) {
			this.activeHelperMeshes[this.currentActiveKey].lookAt(this.activeCamera.position);
		}

		if (this.meshToFollow) {
			const { mesh: { position }, distance } = this.meshToFollow;
			// const distance = -8;

			const pointOnSphere = new THREE.Vector3(position.x, position.y, position.z);

			// const direction = new THREE.Vector3();
			// const result = new THREE.Vector3();

			// const sphereCenter = new THREE.Vector3(0, 0, 0);

			// direction.subVectors( pointOnSphere, sphereCenter ).normalize();
			// result.copy( pointOnSphere ).addScaledVector( direction, distance );

			this.cameraControls.target = pointOnSphere;

			// console.log( result );
			// this.cameraControls.setPosition(position.x-1, position.y+1, position.z-10, false);
			// this.cameraControls.setLookAt(result.x, result.y, result.z, position.x, position.y, position.z, false);
			// this.cameraControls.fitTo(this.meshToFollow, false, { paddingTop: 0, paddingBottom: 0, paddingRight: 3, paddingLeft: 3 });

		}

		const delta = this.clock.getDelta();
		const hasControlsUpdated = this.cameraControls.update( delta );
	}

	render() {
		this.renderer.setRenderTarget(this.framebuffer);
		this.renderer.render(this.scene, this.activeCamera);
		// this.renderer.clear();
	}

	onResize(renderWindowDimensions) {
		const w = renderWindowDimensions.w;
		const h = renderWindowDimensions.h;

		this.framebuffer.setSize(w, h);

		if (this.camera.aspect) {
			this.camera.aspect = w / h;
		} else {
			this.camera.left = w / - 2;
			this.camera.right = w / 2;
			this.camera.top = h / -2;
			this.camera.bottom = h / 2;
		}
		this.camera.updateProjectionMatrix();
	}
}