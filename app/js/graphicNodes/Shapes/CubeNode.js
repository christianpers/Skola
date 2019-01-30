import RenderNode from '../RenderNode';
import * as SHADERS from '../../../shaders/SHADERS';
import * as THREE from 'three';
import RangeSlider from '../../views/Nodes/NodeComponents/RangeSlider';

export default class CubeNode extends RenderNode{
	constructor(mainRender) {
		super(mainRender);

		this.isForegroundNode = true;

		this.el.classList.add('no-height');

		this.shader = SHADERS.CIRCLE_SHAPE_MAIN;

		const w = window.innerWidth;
		const h = window.innerHeight;

		this.camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );

		this.camera.position.z = 3;

		this.texture = THREE.ImageUtils.loadTexture( 'assets/test/Image1.png', null );
		this.texture.magFilter = THREE.LinearFilter;
		this.texture.minFilter = THREE.LinearFilter;

		this.geometry = new THREE.BoxGeometry( 1, 1, 1, 10, 10, 10 );
		this.material = new THREE.MeshPhongMaterial( {  } );
		this.mesh = new THREE.Mesh(this.geometry, this.material);

		// this.material.bumpMap = this.texture;
		

		const light = new THREE.AmbientLight( 0x404040 ); // soft white light
		const directionalLight = new THREE.DirectionalLight( 0xffffff, .6 );
		const directionalLightBtm = new THREE.DirectionalLight( 0xffffff, 1 );

		directionalLightBtm.position.set(0, 0, 4);
		// this.scene.add( directionalLight );
		this.scene.add( directionalLightBtm );

		this.scene.add(this.mesh);

		// directionalLight.target = this.mesh;
		directionalLightBtm.target = this.mesh;


		const textureParam = {
			title: 'Texture',
			param: 'map',
			useAsInput: true,
			parent: 'Material',
			paramHelpersType: 'texture',
			needsFrameUpdate: false,
		};

		const colorParam = {
			title: 'Color',
			param: 'color',
			useAsInput: true,
			defaultVal: new THREE.Color(1,1,1),
			parent: 'Material',
			paramHelpersType: 'color',
			needsFrameUpdate: false,
		};

		const bumpMapParam = {
			title: 'Displacement',
			// param: 'displacementMap',
			param: 'normalMap',
			useAsInput: true,
			parent: 'Material',
			paramHelpersType: 'normalMap',
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

		this.params = {
			textureParam,
			colorParam,
			bumpMapParam,
			positionXParam,
			positionYParam,
			positionZParam,
			rotationXParam,
			rotationYParam,
		}

		this.paramVals = {};

		// for (const loopKey in this.treeParams) {
		// 	const arr = this.treeParams[loopKey];
		// 	this.paramVals[key] = this.treeParams[loopKey].defaultVal;
		// }
	}

	getMesh() {
		return this.mesh;
	}

	setup() {
		
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

		// this.mesh.rotation.x += 0.01;
		// this.mesh.rotation.y += 0.01;
	}


}