import * as THREE from 'three';
import Node from '../views/Nodes/Node';
import * as SHADERS from '../../shaders/SHADERS';

import NodeInput from '../views/Nodes/NodeComponents/NodeInput';
import InputHelpers from './Helpers/InputHelpers';

export default class SceneNode extends Node{

	constructor(mainRender) {
		super();

		this.hasOutput = false;
		this.isGraphicsNode = true;
		this.hasGraphicsInput = true;
		this.isCanvasNode = true;

		this.inputHelpersType = InputHelpers.sceneNode;

		this.enabledInputs = [];

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
		
		textureUniforms.u_connection1 = {value: 0.0};
		textureUniforms.u_texture1 = {value: new Image()};

		textureUniforms.u_finalConnection = {value: 0.0};
		textureUniforms.u_multiConnection = {value: 0.0};

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

		this.bottomPartEl.classList.add('multiple-inputs');

		this.onInputClickBackgroundBound = this.onInputClickBackground.bind(this);
		this.onInputClickForegroundBound = this.onInputClickForeground.bind(this);

		this.inputBackground = new NodeInput(this.bottomPartEl, this.onInputClickBackgroundBound, this.isGraphicsNode, 'Bakgrund In');
		this.inputForeground = new NodeInput(this.bottomPartEl, this.onInputClickForegroundBound, this.isGraphicsNode, 'Förgrund In');

		this.inputs = {
			'background': this.inputBackground,
			'foreground': this.inputForeground,
		};
		
		setTimeout(() => {
			this.onResize();
		}, 100);	
	}

	onInputClickBackground(param) {

		this.onInputConnectionCallback(this, 'background', param);
	}

	onInputClickForeground(param) {

		this.onInputConnectionCallback(this, 'foreground', param);
	}

	getInputEl(inputType) {
		return this.inputs[inputType].el;
	}

	getDotPos(el) {
		
		return el.getBoundingClientRect();
	}

	setup() {

	}

	enableInput(outputNode, inputType) {
		this.inputs[inputType].enable();

		if (outputNode.isBackgroundNode) {
			const framebuffer = outputNode.framebuffer.texture;
			this.mesh.material.uniforms.u_texture0.value = framebuffer;
			this.mesh.material.uniforms.u_connection0.value = 1.0;
		} else if (outputNode.isForegroundNode) {
			const framebuffer = outputNode.framebuffer.texture;
			this.mesh.material.uniforms.u_texture1.value = framebuffer;
			this.mesh.material.uniforms.u_connection1.value = 1.0;
		}

		const obj = {
			out: outputNode,
			type: inputType,
		};
		this.enabledInputs.push(obj);

		this.mesh.material.uniforms.u_finalConnection.value = 1.0;
		if (this.enabledInputs.length === 2) {
			this.mesh.material.uniforms.u_multiConnection.value = 1.0;
		}
	}


	disableInput(outNode, inputType) {

		this.inputs[inputType].disable();

		this.enabledInputs = this.enabledInputs.filter(t => t.type !== inputType);

		if (this.enabledInputs.length === 0) {
			this.mesh.material.uniforms.u_finalConnection.value = 0.0;
		} else if (this.enabledInputs.length === 1) {
			this.mesh.material.uniforms.u_multiConnection.value = 0.0;
		}

		if (outNode.isBackgroundNode) {
			this.mesh.material.uniforms.u_texture0.value = null;
			this.mesh.material.uniforms.u_connection0.value = 0.0;
		} else if (outNode.isForegroundNode) {
			this.mesh.material.uniforms.u_texture1.value = null;
			this.mesh.material.uniforms.u_connection1.value = 0.0;
		}
	}

	getRenderWindowDimensions() {
		return {w: 540, h: 538};
	}

	update() {

	}

	render() {
		// this.renderer.clear();
		// this.renderer.render(this.sceneFBO, this.perspectiveCamera, this.framebuffer, true);
		this.renderer.render(this.scene, this.orthoCamera);
	}

	onResize() {
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