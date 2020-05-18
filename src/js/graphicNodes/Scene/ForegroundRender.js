import { SIMPLE_3D_VERTEX, ACTIVE_MESH_FRAGMENT } from '../../../shaders/SHADERS';
import Stars from './lessons/space/Stars';
import CameraKeyboardBindings from './CameraKeyboardBindings';

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

		this.ambientLight = new THREE.AmbientLight( );

		this.scene.add(this.ambientLight);
		
		this.stars = new Stars(this.scene);

		this.connectedNodes = [];
		this.hasConnectedLight = false;

		this.meshToFollow = null;

		this.framebuffer = new THREE.WebGLRenderTarget(
			640,
			600,
			{minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
		);
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
		const lightName = `${node.ID}-light`;
		const light = this.scene.getObjectByName(lightName);
		this.scene.remove(light);

		const meshName = `${node.ID}-mesh`;
		const mesh = this.scene.getObjectByName(meshName);
		this.scene.remove(mesh);

		this.hasConnectedLight = false;

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

		const activeMeshKey = `${meshName}-active`;
		if (this.activeHelperMeshes[activeMeshKey]) {
			delete this.activeHelperMeshes[activeMeshKey];
		}
	}

	createPlaneMesh(node, meshName) {
		// Plane for showing when mesh selected
		const planeGeometry = new THREE.PlaneBufferGeometry( 5, 5, 1, 1 );
		// const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );

		// const settingUniforms = {};
        // settingUniforms.u_user_fgColor = {value: new THREE.Color(1.0,1.0,1.0)};
        // settingUniforms.u_user_bgColor = {value: new THREE.Color(0.0,0.0,0.0)};

        // const uniformsObj = Object.assign({}, settingUniforms);
        const planeMaterial = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: SIMPLE_3D_VERTEX,
            fragmentShader: ACTIVE_MESH_FRAGMENT,
        });

		planeMaterial.transparent = true;
		
		const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
		planeMesh.position.y = 0;
		planeMesh.scale.set(1.4, 1.4, 1);
		planeMesh.visible = false;

		node.mesh.add(planeMesh);

		this.activeHelperMeshes[`${meshName}-active`] = planeMesh;
	}

	showActive(nodeID) {
		const keys = Object.keys(window.NS.singletons.ConnectionsManager.nodes);
		const isRenderedKeys = keys.filter(t => window.NS.singletons.ConnectionsManager.nodes[t].isRendered);
		isRenderedKeys.forEach(t => {
			const meshName = `${t}-mesh-active`;
			this.activeHelperMeshes[meshName].visible = false;
		});


		const meshName = `${nodeID}-mesh-active`;
		if (this.activeHelperMeshes[meshName]) {
			this.currentActiveKey = meshName;
			this.activeHelperMeshes[meshName].visible = true;
		}
		
		// console.log('show active: ', nodeID, this.activeHelperMeshes)
	}

	hideActive(nodeID) {
		const meshName = `${nodeID}-mesh-active`;
		if (this.activeHelperMeshes[this.currentActiveKey] && this.currentActiveKey === meshName) {
			this.activeHelperMeshes[this.currentActiveKey].visible = false;
			this.currentActiveKey = null;
		}
	}

	update() {
		if (this.currentActiveKey && this.activeHelperMeshes[this.currentActiveKey]) {
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