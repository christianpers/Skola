import Node from '../views/Nodes/Node';
import * as SHADERS from '../../shaders/SHADERS';

import NodeInput from '../views/Nodes/NodeComponents/NodeInput';
import InputHelpers from './Helpers/InputHelpers';
import ForegroundRender from './Scene/ForegroundRender';
import Render from './Render';
import NodeResizer from '../views/Nodes/NodeComponents/NodeResizer';
import CameraControlSetting from './Scene/CameraControlSetting';

export default class SceneNode extends Node{

	constructor() {
		super();

		this.mainRender = new Render();

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

		this.onNodeResizerDownBound = this.onNodeResizerDown.bind(this);
		this.onResizeFromNodeResizerBound = this.onResizeFromNodeResizer.bind(this);
		this.nodeResizer = new NodeResizer(this.bottomPartEl, this.onResizeFromNodeResizerBound, this.onNodeResizerDownBound);

		this.el.appendChild(this.bottomPartEl);

		this.foregroundRender = new ForegroundRender(this.mainRender, this.topPartEl);
		this.cameraControlSetting = new CameraControlSetting(this.bottomPartEl, this.foregroundRender);

		this.scene = new THREE.Scene();
		this.renderer = this.mainRender.renderer;
		this.renderer.setSize(this.topPartEl.clientWidth, this.topPartEl.clientHeight);
		// this.renderer.autoClear = false;

		this.topPartEl.appendChild(this.renderer.domElement);
		// this.renderer.domElement.classList.add('prevent-drag');

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

	init(pos, parentEl, onConnectingCallback, onInputConnectionCallback, type, initData, onNodeActive, onRemoveCallback) {
		super.init(pos, parentEl, onConnectingCallback, onInputConnectionCallback, type, initData, onNodeActive, onRemoveCallback);

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

		this.activateDrag();
	}

	getOutDotPos(el) {
		this.inDotPos = el.getBoundingClientRect();
		
		return this.inDotPos;
	}

	getInDotPos(el) {
		this.outDotPos = el.getBoundingClientRect();
		
		return this.outDotPos;
	}

	onNodeResizerDown() {

		this.nodeResizer.currentDims.w = this.topPartEl.clientWidth;
		this.nodeResizer.currentDims.h = this.topPartEl.clientHeight;

		this.nodeResizer.currentNodeDims.w = this.el.clientWidth;
		this.nodeResizer.currentNodeDims.h = this.el.clientHeight;
	}

	onResizeFromNodeResizer(delta) {

		this.el.style.width = this.nodeResizer.currentNodeDims.w + delta.x + 'px';
		this.el.style.height = this.nodeResizer.currentNodeDims.h + delta.y + 'px';

		this.topPartEl.style.width = this.nodeResizer.currentDims.w + delta.x + 'px';
		this.topPartEl.style.height = this.nodeResizer.currentDims.h + delta.y + 'px';

		this.inputBackground.offsetLeft = this.inputBackground.el.offsetLeft;
		this.inputBackground.offsetTop = this.inputBackground.el.offsetTop;

		this.inputForeground.offsetLeft = this.inputForeground.el.offsetLeft;
		this.inputForeground.offsetTop = this.inputForeground.el.offsetTop;

		// console.log(this.nodeResizer.currentDims.h + delta.y);
		this.onResize();
	}

	onInputClickBackground(param) {

		this.onInputConnectionCallback(this, 'background', param);
	}

	onInputClickForeground(param) {

		this.onInputConnectionCallback(this, 'foreground', param);
	}

	getInputEl(inputType) {
		return this.inputs[inputType];
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
			this.foregroundRender.addNode(outputNode);
			if (this.foregroundRender.connectedNodes.length === 1) {
				const framebuffer = this.foregroundRender.framebuffer.texture;
				this.mesh.material.uniforms.u_texture1.value = framebuffer;
				this.mesh.material.uniforms.u_connection1.value = 1.0;
			}
			
		}

		const obj = {
			out: outputNode,
			type: inputType,
		};
		this.enabledInputs.push(obj);

		this.mesh.material.uniforms.u_finalConnection.value = 1.0;
		if (this.inputs['background'].isActive && this.inputs['foreground'].isActive) {
			this.mesh.material.uniforms.u_multiConnection.value = 1.0;
		}
	}


	disableInput(outNode, inputType) {

		if (inputType === 'background') {
			this.inputs[inputType].disable();

			this.mesh.material.uniforms.u_texture0.value = null;
			this.mesh.material.uniforms.u_connection0.value = 0.0;

		} else if (inputType === 'foreground') {
			this.foregroundRender.removeNode(outNode);

			if (this.foregroundRender.connectedNodes.length === 0) {
				this.inputs[inputType].disable();

				this.mesh.material.uniforms.u_texture1.value = null;
				this.mesh.material.uniforms.u_connection1.value = 0.0;
			}
		}

		this.enabledInputs = this.enabledInputs.filter(t => t.out.ID !== outNode.ID);

		if (this.enabledInputs.length === 0) {
			this.mesh.material.uniforms.u_finalConnection.value = 0.0;
		} else if (!this.inputs['foreground'].isActive) {
			this.mesh.material.uniforms.u_multiConnection.value = 0.0;
		}
	}

	getRenderWindowDimensions() {
		return {w: 540, h: 538};
	}

	update() {
		this.foregroundRender.update();
	}

	render() {
		this.renderer.clear();

		this.foregroundRender.render();
		this.renderer.setRenderTarget(null);
		this.renderer.render(this.scene, this.orthoCamera);
	}

	onResize() {
		const w = this.topPartEl.clientWidth;
		const h = this.topPartEl.clientHeight;

		console.log(h);

		this.foregroundRender.onResize({w, h});

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