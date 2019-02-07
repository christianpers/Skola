import RenderNode from '../RenderNode';
import * as SHADERS from '../../../shaders/SHADERS';
import * as THREE from 'three';

export default class LavaNoiseNode extends RenderNode{
	constructor(mainRender) {
		super(mainRender);

		this.isBackgroundNode = true;

		this.el.classList.add('no-height');

		this.shader = `${SHADERS.BASE_SHADER}${SHADERS.BASE_MAIN_HEADER}${SHADERS.LAVA_SHAPE_MAIN}${SHADERS.BASE_MAIN_FOOTER}`;

		const w = window.innerWidth;
		const h = window.innerHeight;

		this.camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );

		this.startTime = Date.now();

		const geometry = new THREE.PlaneGeometry( 2, 2 );

		const resUniforms = {};
		resUniforms.u_resolution = {value: new THREE.Vector2(window.innerWidth, window.innerHeight)};
		resUniforms.u_time = {value: 0};

		const settingUniforms = {};
		settingUniforms.u_user_speed3 = {value: .5};
	    settingUniforms.u_user_pattern_scale = {value:-0.358};
	    settingUniforms.u_user_scale = {value:7.032};
	    settingUniforms.u_user_rotation = {value:0.804};
	    settingUniforms.u_user_speed2 = {value:0.028};
	    settingUniforms.u_user_blur = {value:0.7};
	    settingUniforms.u_user_color1 = {value: new THREE.Color(0.256,0.351,0.620)};
	    settingUniforms.u_user_color2 = {value: new THREE.Color(1.000,0.420,0.420)};

		const uniformsObj = Object.assign({}, resUniforms, settingUniforms);
		this.material = new THREE.ShaderMaterial({
			uniforms: uniformsObj,
			vertexShader: SHADERS.CANVAS_RENDER_VERTEX,
			fragmentShader: this.shader,
		});

		this.mesh = new THREE.Mesh(geometry, this.material);

		this.scene.add(this.mesh);

		this.paramVals = {};

		const speed3Param = {
			title: 'Speed3',
			param: 'u_user_speed3',
			useAsInput: true,
			paramHelpersType: 'shaderParam',
			needsFrameUpdate: false,
			minMax: {min: 0, max: 2},
			value: .5,
			decimals: 2,
		};

		const patternScaleParam = {
			title: 'Pattern Scale',
			param: 'u_user_pattern_scale',
			useAsInput: true,
			paramHelpersType: 'shaderParam',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0.0,
			decimals: 2,
		};

		const scaleParam = {
			title: 'Scale',
			param: 'u_user_scale',
			useAsInput: true,
			paramHelpersType: 'shaderParam',
			needsFrameUpdate: false,
			minMax: {min: 1, max: 20},
			defaultVal: 7.0,
			decimals: 2,
		};

		const rotationParam = {
			title: 'Rotation',
			param: 'u_user_rotation',
			useAsInput: true,
			paramHelpersType: 'shaderParam',
			needsFrameUpdate: false,
			minMax: {min: .01, max: 2.0},
			defaultVal: .8,
			decimals: 2,
		};

		const distortionParam = {
			title: 'Distortion',
			param: 'u_user_speed2',
			useAsInput: true,
			paramHelpersType: 'shaderParam',
			needsFrameUpdate: false,
			minMax: {min: .001, max: 10.0},
			defaultVal: .02,
			decimals: 2,
		};

		const blurParam = {
			title: 'Blur',
			param: 'u_user_blur',
			useAsInput: true,
			paramHelpersType: 'shaderParam',
			needsFrameUpdate: false,
			minMax: {min: .01, max: 10.0},
			defaultVal: .7,
			decimals: 2,
		};

		this.params = {
			blurParam,
			distortionParam,
			rotationParam,
			patternScaleParam,
			scaleParam,
			speed3Param,
		};

	}

	enableOutput(param, connection) {
		super.enableOutput();

		this.currentOutConnections.push(connection);
		this.currentOutConnectionsLength = this.currentOutConnections.length;
	}

	disableOutput(nodeIn, param) {
		const tempOutConnections = this.currentOutConnections.map(t => t);

		let paramConnections = tempOutConnections.filter(t => t.param);
		let nodeConnections = tempOutConnections.filter(t => !t.param);

		if (param) {
			paramConnections = paramConnections.filter(t => t.param && (t.param.title !== param.title));
		} else {
			nodeConnections = nodeConnections.filter(t => t.in.ID !== nodeIn.ID);
		}
		
		const finalConnections = paramConnections.concat(nodeConnections);
		this.currentOutConnections = finalConnections;
		this.currentOutConnectionsLength = this.currentOutConnections.length;

		if (this.currentOutConnectionsLength <= 0) {
			super.disableOutput();

		}
	}

	update() {
		super.update();

		const now = Date.now();
		const deltaTime = now - this.startTime;

		this.mesh.material.uniforms.u_time.value = deltaTime * .005;
	}

	onResize(dims) {
		super.onResize(dims);

		const w = dims.w;
		const h = dims.h;

		this.mesh.material.uniforms.u_resolution.value = new THREE.Vector2(w, h);
	}
}