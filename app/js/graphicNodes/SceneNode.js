import Node from '../views/Nodes/Node';
import * as SHADERS from '../../shaders/SHADERS';

import NodeInput from '../views/Nodes/NodeComponents/NodeInput';
import InputHelpers from './Helpers/InputHelpers';
import ForegroundRender from './Scene/ForegroundRender';
import NodeResizer from '../views/Nodes/NodeComponents/NodeResizer';
import CameraControlSetting from './Scene/CameraControlSetting';
import AxesHelper from './Scene/AxesHelper';
import HorizontalSlider from '../views/Nodes/NodeComponents/HorizontalSlider';

export default class SceneNode extends Node{

	constructor(mainRender) {
		super();

		this.mainRender = mainRender;

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

		this.bottomPartSettings = document.createElement('div');
		this.bottomPartSettings.className = 'bottom-part-settings';

		this.bottomPartEl.appendChild(this.bottomPartSettings);

		this.onNodeResizerDownBound = this.onNodeResizerDown.bind(this);
		this.onResizeFromNodeResizerBound = this.onResizeFromNodeResizer.bind(this);
		this.nodeResizer = new NodeResizer(this.bottomPartEl, this.onResizeFromNodeResizerBound, this.onNodeResizerDownBound);

		this.el.appendChild(this.bottomPartEl);

		this.foregroundRender = new ForegroundRender(this.mainRender, this.topPartEl);
		this.cameraControlSetting = new CameraControlSetting(this.bottomPartSettings, this.foregroundRender);
		this.onAmbientLightSettingChangeBound = this.onAmbientLightSettingChange.bind(this);
		this.ambientLightSetting = new HorizontalSlider(this.bottomPartSettings, 1, this.onAmbientLightSettingChangeBound, 2, {min: 0, max: 1}, 'ambient-light', 'Ambient light');

		this.axesHelper = new AxesHelper(this.bottomPartSettings, this.foregroundRender);
		

		this.scene = new THREE.Scene();
		this.renderer = this.mainRender.renderer;
		this.renderer.setSize(this.topPartEl.clientWidth, this.topPartEl.clientHeight);

		this.topPartEl.appendChild(this.renderer.domElement);

		const geometry = new THREE.PlaneGeometry( 2, 2 );

		const resUniforms = {};
		resUniforms.u_res = {value: new THREE.Vector2(window.innerWidth, window.innerHeight)};

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
		this.onInputClickLightBound = this.onInputClickLight.bind(this);

		this.inputBackground = new NodeInput(this.bottomPartEl, this.onInputClickBackgroundBound, this.isGraphicsNode, 'Bakgrund In', 'background');
		this.inputForeground = new NodeInput(this.bottomPartEl, this.onInputClickForegroundBound, this.isGraphicsNode, 'Förgrund In', 'foreground');
		this.inputLight = new NodeInput(this.bottomPartEl, this.onInputClickLightBound, this.isGraphicsNode, 'Ljus In', 'light');

		this.inputs = {
			'background': this.inputBackground,
			'foreground': this.inputForeground,
			'light': this.inputLight,
		};
		
		setTimeout(() => {
			this.onResize();
		}, 100);

		this.activateDrag();
	}

	onAmbientLightSettingChange(val) {
		this.foregroundRender.ambientLight.intensity = val;
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

		this.inputLight.offsetLeft = this.inputLight.el.offsetLeft;
		this.inputLight.offsetTop = this.inputLight.el.offsetTop;

		this.onResize();
	}

	onInputClickBackground(param) {

		this.onInputConnectionCallback(this, 'background', param);
	}

	onInputClickForeground(param) {

		this.onInputConnectionCallback(this, 'foreground', param);
	}

	onInputClickLight(param) {

		this.onInputConnectionCallback(this, 'light', param);
	}

	getInputEl(inputType) {
		return this.inputs[inputType];
	}

	getDotPos(el) {
		
		return el.getBoundingClientRect();
	}

	setBackgroundTexture(texture) {
		this.mesh.material.uniforms.u_texture0.value = texture;
	}

	enableInput(outputNode, inputType) {
		this.inputs[inputType].enable();

		if (outputNode.isBackgroundNode) {
			const framebuffer = outputNode.framebuffer ? outputNode.framebuffer.texture : outputNode.texture;
			this.mesh.material.uniforms.u_texture0.value = framebuffer;
			this.mesh.material.uniforms.u_connection0.value = 1.0;
		} else if (outputNode.isForegroundNode) {
			this.foregroundRender.addNode(outputNode);
			if (this.foregroundRender.connectedNodes.length === 1) {
				const framebuffer = this.foregroundRender.framebuffer.texture;
				this.mesh.material.uniforms.u_texture1.value = framebuffer;
				this.mesh.material.uniforms.u_connection1.value = 1.0;
			}
		} else if (outputNode.isLightNode) {
			this.foregroundRender.addLight(outputNode);
		}

		const obj = {
			out: outputNode,
			type: inputType,
		};
		this.enabledInputs.push(obj);

		if (!outputNode.isLightNode) {
			this.mesh.material.uniforms.u_finalConnection.value = 1.0;
			if (this.inputs['background'].isActive && this.inputs['foreground'].isActive) {
				this.mesh.material.uniforms.u_multiConnection.value = 1.0;
			}
		}
	}


	disableInput(outNode, inputType) {

		if (inputType === 'background') {
			this.inputs[inputType].disable();

			this.mesh.material.uniforms.u_texture0.value = null;
			this.mesh.material.uniforms.u_connection0.value = 0.0;
			this.mesh.material.uniforms.u_multiConnection.value = 0.0;

		} else if (inputType === 'foreground') {
			this.foregroundRender.removeNode(outNode);

			if (this.foregroundRender.connectedNodes.length === 0) {
				this.inputs[inputType].disable();

				this.mesh.material.uniforms.u_texture1.value = null;
				this.mesh.material.uniforms.u_connection1.value = 0.0;
			}
		} else if (inputType === 'light') {
			this.inputs[inputType].disable();

			this.foregroundRender.removeLight(outNode);
		}

		
		this.enabledInputs = this.enabledInputs.filter(t => t.out.ID !== outNode.ID);
		const graphicInputs = this.enabledInputs.filter(t => !t.out.isLightNode);

		if (graphicInputs.length === 0) {
			this.mesh.material.uniforms.u_finalConnection.value = 0.0;
		} else if (!this.inputs['foreground'].isActive) {
			this.mesh.material.uniforms.u_multiConnection.value = 0.0;
		}
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

		this.foregroundRender.onResize({w, h});

		this.mesh.material.uniforms.u_res.value = new THREE.Vector2(w, h);

		this.orthoCamera.left = w / - 2;
		this.orthoCamera.right = w / 2;
		this.orthoCamera.top = h / -2;
		this.orthoCamera.bottom = h / 2;
		this.orthoCamera.updateProjectionMatrix();

		this.renderer.setSize( w, h );

	}
}