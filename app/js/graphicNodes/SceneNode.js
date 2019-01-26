import * as THREE from 'three';
import Node from '../views/Nodes/Node';
import * as SHADERS from '../../shaders/SHADERS';

export default class SceneNode extends Node{

	constructor(mainRender) {
		super();

		this.hasOutput = false;
		this.isGraphicsNode = true;
		this.hasGraphicsInput = true;
		this.isCanvasNode = true;

		this.el = document.createElement('div');
		this.el.className = 'node canvas';

		this.topPartEl = document.createElement('div');
		this.topPartEl.className = 'top-part';

		this.el.appendChild(this.topPartEl);

		this.bottomPartEl = document.createElement('div');
		this.bottomPartEl.className = 'bottom-part';

		this.el.appendChild(this.bottomPartEl);

		this.scene = new THREE.Scene();
		this.renderer = mainRender.renderer;
		this.renderer.setSize(this.topPartEl.clientWidth, this.topPartEl.clientHeight);
		// this.renderer.autoClear = false;

		this.topPartEl.appendChild(this.renderer.domElement);

		const geometry = new THREE.PlaneGeometry( 2, 2 );

		const resUniforms = {};
		resUniforms.u_res = {value: new THREE.Vector2(window.innerWidth, window.innerHeight)};

		// this.texture = THREE.ImageUtils.loadTexture( 'assets/test/Image1.png', null );
		// this.texture.magFilter = THREE.LinearFilter;
		// this.texture.minFilter = THREE.LinearFilter;

		const textureUniforms = {};
		textureUniforms.u_connection0 = {value: 0.0};
		textureUniforms.u_texture0 = {value: new Image()};

		// textureUniforms.u_connection1 = {value: 1.0};
		// textureUniforms.u_texture1 = {value: new Image()};

		const uniformsObj = Object.assign({}, resUniforms, textureUniforms);
		this.material = new THREE.ShaderMaterial({
			uniforms: uniformsObj,
			vertexShader: SHADERS.CANVAS_RENDER_VERTEX,
			fragmentShader: SHADERS.CANVAS_RENDER_FRAGMENT,
		});

		this.mesh = new THREE.Mesh(geometry, this.material);

		this.scene.add(this.mesh);

	}

	init(parentEl, onConnectingCallback, onInputConnectionCallback, type) {
		super.init(parentEl, onConnectingCallback, onInputConnectionCallback, type);

		const w = window.innerWidth;
		const h = window.innerHeight;
		
		this.orthoCamera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );
		
		setTimeout(() => {
			this.resize();
		}, 100);
		
	}

	getDotPos(el) {
		
		return el.getBoundingClientRect();
	}

	setup() {

	}

	enableInput(outputNode) {
		super.enableInput();
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();
	}

	onConnectionUpdate(connections) {

		if (connections.length > 0) {
			this.mesh.material.uniforms.u_connection0.value = 1.0;
		} else {
			this.mesh.material.uniforms.u_connection0.value = 0.0;
			return;
		}

		const connection = connections[0];

		const framebuffer = connection.out.framebuffer.texture;
		this.mesh.material.uniforms.u_texture0.value = framebuffer;
	}

	getRenderWindowDimensions() {
		return {w: this.topPartEl.clientWidth, h: this.topPartEl.clientHeight};
	}

	update() {

	}

	render() {
		// this.renderer.clear();
		// this.renderer.render(this.sceneFBO, this.perspectiveCamera, this.framebuffer, true);
		this.renderer.render(this.scene, this.orthoCamera);
	}

	resize() {
		const w = this.topPartEl.clientWidth;
		const h = this.topPartEl.clientHeight;

		// this.framebuffer.setSize(w, h);

		this.mesh.material.uniforms.u_res.value = new THREE.Vector2(w, h);

		// this.perspectiveCamera.aspect = w / h;
		// this.perspectiveCamera.updateProjectionMatrix();

		this.orthoCamera.left = w / - 2;
		this.orthoCamera.right = w / 2;
		this.orthoCamera.top = h / -2;
		this.orthoCamera.bottom = h / 2;
		this.orthoCamera.updateProjectionMatrix();

		this.renderer.setSize( w, h );

	}
}