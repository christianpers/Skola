import RenderNode from '../RenderNode';
import * as SHADERS from '../../../shaders/SHADERS';
import * as THREE from 'three';
import RangeSlider from '../../views/Nodes/NodeComponents/RangeSlider';

export default class CubeNode extends RenderNode{
	constructor(FBO, mainRender) {
		super(FBO, mainRender);

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
			param: 'displacementMap',
			useAsInput: true,
			parent: 'Material',
			paramHelpersType: 'bumpMap',
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
			minMax: {min: -2, max: 2},
			defaultVal: 0,
		};

		const rotationYParam = {
			title: 'Rotation y',
			param: 'y',
			useAsInput: true,
			parent: 'Rotation',
			paramHelpersType: 'rotation',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
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

	enableInput(outputNode) {
		super.enableInput();		
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();
	}

	update() {
		super.update();

		// this.mesh.rotation.x += 0.01;
		// this.mesh.rotation.y += 0.01;
	}


}