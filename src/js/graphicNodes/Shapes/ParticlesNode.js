import GraphicNode from '../GraphicNode';
import { PARTICLES_VERTEX, PARTICLES_FRAGMENT } from '../../../shaders/SHADERS';

export default class ParticlesNode extends GraphicNode{
	constructor() {
		super();

		this.isForegroundNode = true;

		this.el.classList.add('no-height');

		const w = window.innerWidth;
        const h = window.innerHeight;
        
        const particles = 600;
        const radius = 10;

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
        // const color = new THREE.Color();
        for ( var i = 0; i < particles; i ++ ) {
            positions.push( ( Math.random() * 2 - 1 ) * radius );
            positions.push( ( Math.random() * 2 - 1 ) * radius );
            positions.push( ( Math.random() * 2 - 1 ) * radius );
            // color.setHSL( i / particles, 1.0, 0.5 );
            colors.push( 1.0, 1.0, 1.0 );
            sizes.push( 2 );
        }
        this.geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
        this.geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
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
			defaultVal: new THREE.Color(1,1,1),
			parent: 'Material',
			paramHelpersType: 'color',
			needsFrameUpdate: false,
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

		const scaleParam = {
			title: 'Scale',
			param: 'scale',
			useAsInput: true,
			parent: 'Scale',
			paramHelpersType: 'scale',
			needsFrameUpdate: false,
			minMax: {min: .1, max: 6},
			defaultVal: 1,
		};

		this.params = {
			// textureParam,
			colorParam,
			positionXParam,
			positionYParam,
			positionZParam,
			rotationXParam,
			rotationYParam,
			scaleParam,
		};

		this.paramVals = {};
	}

	getMesh() {
		return this.mesh;
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

}