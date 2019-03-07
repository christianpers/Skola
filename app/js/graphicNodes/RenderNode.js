import GraphicNode from './GraphicNode';

export default class RenderNode extends GraphicNode{
	constructor(mainRender) {
		super();

		this.isRenderNode = true;
		this.canConnectToMaterial = true;

		this.scene = new THREE.Scene();
		this.renderer = mainRender.renderer;

		this.framebuffer = new THREE.WebGLRenderTarget(
			window.innerWidth,
			window.innerHeight,
			{minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter}
		);
	}

	update() {

	}

	render() {
		this.renderer.render(this.scene, this.camera, this.framebuffer, true);
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