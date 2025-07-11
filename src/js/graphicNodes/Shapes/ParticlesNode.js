import GraphicNode from '../GraphicNode';
import ParamHelpers from '../Helpers/ParamHelpers';
import { PARTICLES_VERTEX, PARTICLES_FRAGMENT, SIMPLE_3D_VERTEX, ACTIVE_MESH_FRAGMENT } from '../../../shaders/SHADERS';

export default class ParticlesNode extends GraphicNode{
	constructor() {
		super();

		this._currentAngle = 0;

		this.isForegroundNode = true;
		this.needsUpdate = true;
		this.isRendered = true;

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
        this.pointsMesh = new THREE.Points( this.geometry, this.material );

		this.mainMesh = this.pointsMesh;

		this.mesh = new THREE.Group();
		this.mesh.add(this.pointsMesh);

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
			defaultConnect: true,
		};

		// const positionXParam = {
		// 	title: 'Position X',
		// 	param: 'x',
		// 	useAsInput: true,
		// 	parent: 'Particle Position',
		// 	paramHelpersType: 'position',
		// 	needsFrameUpdate: false,
		// 	minMax: {min: -2, max: 2},
		// 	defaultVal: 0,
		// 	defaultConnect: true,
		// };

		// const positionYParam = {
		// 	title: 'Position Y',
		// 	param: 'y',
		// 	useAsInput: true,
		// 	parent: 'Particle Position',
		// 	paramHelpersType: 'position',
		// 	needsFrameUpdate: false,
		// 	minMax: {min: -2, max: 2},
		// 	defaultVal: 0,
		// 	defaultConnect: false,
		// };

		// const positionZParam = {
		// 	title: 'Position Z',
		// 	param: 'z',
		// 	useAsInput: true,
		// 	parent: 'Particle Position',
		// 	paramHelpersType: 'position',
		// 	needsFrameUpdate: false,
		// 	minMax: {min: -2, max: 2},
		// 	defaultVal: 0,
		// 	defaultConnect: true,
		// };

		const rotationXParam = {
			title: 'Rotation x',
			param: 'x',
			useAsInput: true,
			parent: 'Rotation',
			paramHelpersType: 'rotation',
			needsFrameUpdate: false,
			minMax: {min: -6, max: 6},
			defaultVal: 0,
			defaultConnect: false,
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
			defaultConnect: true,
		};

		const formXParam = {
			title: 'Form X',
			param: 'x',
			useAsInput: true,
			parent: 'Form',
			paramHelpersType: 'particleForm',
			needsFrameUpdate: false,
			defaultVal: Math.random() * 2 - 1,
			defaultConnect: true,
		};

		const formYParam = {
			title: 'Form Y',
			param: 'y',
			useAsInput: true,
			parent: 'Form',
			paramHelpersType: 'particleForm',
			needsFrameUpdate: false,
			defaultVal: Math.random() * 2 - 1,
			defaultConnect: false,
		};

		const formZParam = {
			title: 'Form Z',
			param: 'z',
			useAsInput: true,
			parent: 'Form',
			paramHelpersType: 'particleForm',
			needsFrameUpdate: false,
			defaultVal: Math.random() * 2 - 1,
			defaultConnect: true,
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
			defaultConnect: true,
		};

		this.params = {
			// textureParam,
			colorParam,
			// positionXParam,
			// positionYParam,
			// positionZParam,
			// rotationXParam,
			rotationYParam,
			formXParam,
			formYParam,
			formZParam,
			// sizeParam,
		};

		this.paramVals = {};

		this.curve = null;

		this.connectedFormParams = {
			x: 0,
			y: 0,
			z: 0,
		};

		this.isSelected = false;

		
	}

	init(
		pos,
		parentEl,
		onDisconnectCallback,
		onInputConnectionCallback,
		type,
		initData,
		onNodeRemove,
		isModifier,
		onNodeDragStart,
		onNodeDragMove,
		onNodeDragRelease,
		addCallback,
	) {
		super.init(
			pos,
			parentEl,
			onDisconnectCallback,
			onInputConnectionCallback,
			type,
			initData,
			onNodeRemove,
			isModifier,
			onNodeDragStart,
			onNodeDragMove,
			onNodeDragRelease,
			addCallback,
		);

		this.outputDataConnection = null;

		this.enabledOutputs = [];
	}

	onSelected() {
		this.isSelected = true;
	}

	onDeselected() {
		this.isSelected = false;
	}

	getActiveHelperMesh() {
		return undefined;
	}

	getMesh() {
		return this.mesh;
	}

	enableParam(paramObj, outNode) {
		paramObj.enable();

		if (paramObj.param.parent === 'Form') {
			this.connectedFormParams[paramObj.param.param] = 1.0;
			this.curve = outNode.curve;
		}

		ParamHelpers[paramObj.param.paramHelpersType].update(this, outNode, paramObj.param);
	}

	updateParam(paramObj, outNode) {
		ParamHelpers[paramObj.param.paramHelpersType].update(this, outNode, paramObj.param);
	}

	disableParam(paramObj, outNode) {
		paramObj.disable();

		if (paramObj.param.parent === 'Form') {
			this.connectedFormParams[paramObj.param.param] = 0.0;

			const hasOtherFormParams = Object.keys(this.connectedFormParams).some(t => this.connectedFormParams[t] > 0.0);
			if (!hasOtherFormParams) {
				this.curve = null;
			}
		}

		ParamHelpers[paramObj.param.paramHelpersType].disconnect(this, paramObj.param, outNode);
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

		const rColor = this.isSelected ? 1.0 : this.currentParticleColor[0];
		const gColor = this.isSelected ? 1.0 : this.currentParticleColor[1];
		const bColor = this.isSelected ? 1.0 : this.currentParticleColor[2];

		const size = this.isSelected ? 4 : this.currentParticleSize;

		for ( var i = 0; i < this.particles; i ++ ) {
			const normalizedIdx = i / this.particles;
			const curvePos = hasCurve ? this.curve.getPoint(normalizedIdx) : undefined;
			const posIndex = i * 3;
			positions[posIndex] = hasXConnection ? curvePos.x + this.offsets[posIndex] : xDefaultVal  + this.offsets[posIndex];
			positions[posIndex + 1] = hasYConnection ? curvePos.y + this.offsets[posIndex + 1] : yDefaultVal + this.offsets[posIndex + 1];
			positions[posIndex + 2] = hasZConnection ? curvePos.y + this.offsets[posIndex + 2] : zDefaultVal + this.offsets[posIndex + 2];
			sizes[i] = size;
			color[posIndex] = rColor;
			color[posIndex + 1] = gColor;
			color[posIndex + 2] = bColor;
		}
		
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.attributes.size.needsUpdate = true;
		this.geometry.attributes.color.needsUpdate = true;
	}

}