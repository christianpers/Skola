import RenderNode from '../RenderNode';
import * as SHADERS from '../../../shaders/SHADERS';
import RangeSlider from '../../views/Nodes/NodeComponents/RangeSlider';

export default class CircleNode extends RenderNode{
	constructor(mainRender) {
		super(mainRender);

		this.isBackgroundNode = true;

		this.shader = `${SHADERS.BASE_SHADER}${SHADERS.BASE_MAIN_HEADER}${SHADERS.CIRCLE_SHAPE_MAIN}${SHADERS.BASE_MAIN_FOOTER}`;

		const w = window.innerWidth;
		const h = window.innerHeight;

		this.camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, 1, 1000 );

		this.startTime = Date.now();

		const geometry = new THREE.PlaneGeometry( 2, 2 );

		const resUniforms = {};
		resUniforms.u_resolution = {value: new THREE.Vector2(window.innerWidth, window.innerHeight)};
		resUniforms.u_time = {value: 0};

		const settingUniforms = {};
		settingUniforms.u_noise_amount = {value: .5};

		const uniformsObj = Object.assign({}, resUniforms, settingUniforms);
		this.material = new THREE.ShaderMaterial({
			uniforms: uniformsObj,
			vertexShader: SHADERS.CANVAS_RENDER_VERTEX,
			fragmentShader: this.shader,
		});

		this.mesh = new THREE.Mesh(geometry, this.material);

		this.scene.add(this.mesh);

		this.paramVals = {};

		const amountParam = {
			title: 'Amount',
			param: 'u_noise_amount',
			useAsInput: true,
			paramHelpersType: 'shaderParam',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
		};

		this.params = {
			amountParam,
		}

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