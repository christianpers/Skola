export default class ForegroundRender{
	constructor(mainRender, canvas) {

		const w = window.innerWidth;
		const h = window.innerHeight;

		this.camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );
		this.camera.position.z = 10;

		this.cameraControls = new THREE.OrbitControls( this.camera, canvas );
		this.cameraControls.enabled = false;

		this.scene = new THREE.Scene();
		this.renderer = mainRender.renderer;

		this.axesHelper = new THREE.AxesHelper( 5 );
		this.axesHelper.name = 'AxesHelper';

		this.ambientLight = new THREE.AmbientLight( );

		this.scene.add(this.ambientLight);

		this.connectedNodes = [];
		this.hasConnectedLight = false;

		this.framebuffer = new THREE.WebGLRenderTarget(
			window.innerWidth,
			window.innerHeight,
			{minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
		);
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
	}

	removeLight(node) {
		const lightName = `${node.ID}-light`;
		const light = this.scene.getObjectByName(lightName);
		this.scene.remove(light);

		const meshName = `${node.ID}-mesh`;
		const mesh = this.scene.getObjectByName(meshName);
		this.scene.remove(mesh);

		this.hasConnectedLight = false;
	}

	addNode(node) {
		this.connectedNodes.push(node);

		const meshName = `${node.ID}-mesh`;
		node.mesh.name = meshName;
		this.scene.add(node.mesh);
	}

	removeNode(node) {
		this.connectedNodes = this.connectedNodes.filter(t => t.ID !== node.ID);

		const meshName = `${node.ID}-mesh`;
		const mesh = this.scene.getObjectByName(meshName);
		this.scene.remove(mesh);
	}

	update() {

	}

	render() {
		this.renderer.setRenderTarget(this.framebuffer);
		this.renderer.render(this.scene, this.camera);
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