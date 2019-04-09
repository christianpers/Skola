import GraphicNode from '../GraphicNode';
import ParamHelpers from '../Helpers/ParamHelpers';
import { PARTICLES_VERTEX, PARTICLES_FRAGMENT } from '../../../shaders/SHADERS';

export default class ParticlesNode extends GraphicNode{
	constructor() {
		super();

		this.isForegroundNode = true;
		this.needsUpdate = true;

		this.el.classList.add('no-height');

		const w = window.innerWidth;
        const h = window.innerHeight;
        
        this.particles = 600;

        const uniforms = THREE.UniformsUtils.merge(
            [THREE.UniformsLib['lights'],
                {
                    diffuse: {type: 'c', value: new THREE.Color(0x0000ff)}
                }
            ]
        );

        this.material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: PARTICLES_VERTEX,
            fragmentShader: PARTICLES_FRAGMENT,
            depthTest: true,
            transparent: true,
            vertexColors: true,
            // lights: true,
        } );

        this.geometry = new THREE.BufferGeometry();

        const positions = [];
        const colors = [];
		const sizes = [];

		this.currentParticleSize = 2;
		this.currentParticleColor = [1.0, 1.0, 1.0];
		
		this.offsets = [];
        // const color = new THREE.Color();
        for ( var i = 0; i < this.particles; i ++ ) {
            positions.push( Math.random() * 2 - 1 );
            positions.push( Math.random() * 2 - 1 );
            positions.push( Math.random() * 2 - 1 );
            // color.setHSL( i / particles, 1.0, 0.5 );
            colors.push( 1.0, 1.0, 1.0 );
			sizes.push( this.currentParticleSize );
			
			this.offsets.push( Math.random() * 2 - 1 );
			this.offsets.push( Math.random() * 2 - 1 );
			this.offsets.push( Math.random() * 2 - 1 );
        }
        this.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ).setDynamic(true));
        this.geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ).setDynamic(true) );
        this.geometry.addAttribute( 'size', new THREE.Float32BufferAttribute( sizes, 1 ).setDynamic( true ) );
        this.mesh = new THREE.Points( this.geometry, this.material );

		// this.geometry = new THREE.SphereGeometry(2, 32, 32);
		// this.material = new THREE.MeshPhongMaterial( {  } );
		// this.mesh = new THREE.Mesh(this.geometry, this.material);

		// const textureParam = {
		// 	title: 'Texture',
		// 	param: 'map',
		// 	useAsInput: true,
		// 	parent: 'Material',
		// 	paramHelpersType: 'texture',
		// 	needsFrameUpdate: false,
		// };

		const colorParam = {
			title: 'Color',
			param: 'color',
			useAsInput: true,
			parent: 'Material',
			paramHelpersType: 'particleColor',
			needsFrameUpdate: false,
			defaultVal: new THREE.Color(this.currentParticleColor[0], this.currentParticleColor[1], this.currentParticleColor[2]),
		};

		const positionXParam = {
			title: 'Position X',
			param: 'x',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
		};

		const positionYParam = {
			title: 'Position Y',
			param: 'y',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
		};

		const positionZParam = {
			title: 'Position Z',
			param: 'z',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
		};

		const rotationXParam = {
			title: 'Rotation x',
			param: 'x',
			useAsInput: true,
			parent: 'Rotation',
			paramHelpersType: 'rotation',
			needsFrameUpdate: false,
			minMax: {min: -6, max: 6},
			defaultVal: 0,
		};

		const rotationYParam = {
			title: 'Rotation y',
			param: 'y',
			useAsInput: true,
			parent: 'Rotation',
			paramHelpersType: 'rotation',
			needsFrameUpdate: false,
			minMax: {min: -6, max: 6},
			defaultVal: 0,
		};

		const formXParam = {
			title: 'Form X',
			param: 'x',
			useAsInput: true,
			parent: 'Form',
			paramHelpersType: 'particleForm',
			needsFrameUpdate: false,
			defaultVal: Math.random() * 2 - 1,
		};

		const formYParam = {
			title: 'Form Y',
			param: 'y',
			useAsInput: true,
			parent: 'Form',
			paramHelpersType: 'particleForm',
			needsFrameUpdate: false,
			defaultVal: Math.random() * 2 - 1,
		};

		const formZParam = {
			title: 'Form Z',
			param: 'z',
			useAsInput: true,
			parent: 'Form',
			paramHelpersType: 'particleForm',
			needsFrameUpdate: false,
			defaultVal: Math.random() * 2 - 1,
		};

		const sizeParam = {
			title: 'Size',
			param: 'storlek',
			useAsInput: true,
			parent: 'Storlek',
			paramHelpersType: 'particleSize',
			needsFrameUpdate: false,
			defaultVal: this.currentParticleSize,
			minMax: {min: 1, max: 10},
		};

		this.params = {
			// textureParam,
			colorParam,
			positionXParam,
			positionYParam,
			positionZParam,
			rotationXParam,
			rotationYParam,
			formXParam,
			formYParam,
			formZParam,
			sizeParam,
		};

		this.paramVals = {};

		this.curve = null;

		this.connectedFormParams = {
			x: 0,
			y: 0,
			z: 0,
		};

		
	}

	getMesh() {
		return this.mesh;
	}

	enableParam(param, connectionData) {
		const paramComponent = this.inputParams[param.title];
		param.isConnected = true;
		paramComponent.enable();

		if (param.parent === 'Form') {
			this.connectedFormParams[param.param] = 1.0;
			this.curve = connectionData.out.curve;
		}

		// ParamHelpers[param.paramHelpersType].update(this, connectionData.out, param);
	}

	updateParam(param, outNode) {
		ParamHelpers[param.paramHelpersType].update(this, outNode, param);
	}

	disableParam(param, connectionData) {
		const paramComponent = this.inputParams[param.title];
		param.isConnected = false;
		paramComponent.disable();

		if (param.parent === 'Form') {
			this.connectedFormParams[param.param] = 0.0;

			const hasOtherFormParams = Object.keys(this.connectedFormParams).some(t => this.connectedFormParams[t] > 0.0);
			if (!hasOtherFormParams) {
				this.curve = null;
			}
		}

		ParamHelpers[param.paramHelpersType].disconnect(this, param, connectionData.out);
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
	}

	render() {

		const positions = this.geometry.attributes.position.array;
		const sizes = this.geometry.attributes.size.array;
		const color = this.geometry.attributes.color.array;

		const hasXConnection = this.connectedFormParams.x === 1.0;
		const hasYConnection = this.connectedFormParams.y === 1.0;
		const hasZConnection = this.connectedFormParams.z === 1.0;
		const hasCurve = !!this.curve;

		const xDefaultVal = this.params['formXParam'].defaultVal;
		const yDefaultVal = this.params['formYParam'].defaultVal;
		const zDefaultVal = this.params['formZParam'].defaultVal;

		const rColor = this.currentParticleColor[0];
		const gColor = this.currentParticleColor[1];
		const bColor = this.currentParticleColor[2];

		for ( var i = 0; i < this.particles; i ++ ) {
			const normalizedIdx = i / this.particles;
			const curvePos = hasCurve ? this.curve.getPoint(normalizedIdx) : undefined;
			const posIndex = i * 3;
			positions[posIndex] = hasXConnection ? curvePos.x + this.offsets[posIndex] : xDefaultVal  + this.offsets[posIndex];
			positions[posIndex + 1] = hasYConnection ? curvePos.y + this.offsets[posIndex + 1] : yDefaultVal + this.offsets[posIndex + 1];
			positions[posIndex + 2] = hasZConnection ? curvePos.y + this.offsets[posIndex + 2] : zDefaultVal + this.offsets[posIndex + 2];
			sizes[i] = this.currentParticleSize;
			color[posIndex] = rColor;
			color[posIndex + 1] = gColor;
			color[posIndex + 2] = bColor;
		}
		
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.size.needsUpdate = true;
		this.geometry.attributes.color.needsUpdate = true;
	}

}