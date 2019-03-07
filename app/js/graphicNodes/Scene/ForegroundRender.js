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

		this.light = new THREE.DirectionalLight( 0xffffff, 1 );

		this.light.position.set(0, 0, 4);

		this.scene.add(this.light);

		this.connectedNodes = [];

		this.framebuffer = new THREE.WebGLRenderTarget(
			window.innerWidth,
			window.innerHeight,
			{minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
		);
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

	addNode(node) {
		this.connectedNodes.push(node);

		// const lightName = `${node.ID}-light`;
		// node.light.name = lightName;
		// this.scene.add(node.light);

		const meshName = `${node.ID}-mesh`;
		node.mesh.name = meshName;
		this.scene.add(node.mesh);
	}

	removeNode(node) {
		this.connectedNodes = this.connectedNodes.filter(t => t.ID !== node.ID);

		// const lightName = `${node.ID}-light`;
		// this.scene.remove(lightName);

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