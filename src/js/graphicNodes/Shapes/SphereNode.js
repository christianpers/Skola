import GraphicNode from '../GraphicNode';

export default class SphereNode extends GraphicNode{
	constructor() {
		super();

		this.isForegroundNode = true;
		// this.hasMultipleOutputs = true;
		this.isRendered = true;
		this.needsUpdate = true;
		
		this.geometry = new THREE.SphereGeometry(2, 32, 32);
		this.material = new THREE.MeshPhongMaterial( {  } );
		const mesh = new THREE.Mesh(this.geometry, this.material);

		this.mesh = new THREE.Group();
		this.mesh.add(mesh);

		// const nameTexture = new THREE.CanvasTexture();

		var planeGeometry = new THREE.PlaneBufferGeometry( 8, 2, 10, 10 );
		var planeMaterial = new THREE.MeshBasicMaterial( {side: THREE.DoubleSide} );

		this.nameMesh = new THREE.Mesh(planeGeometry, planeMaterial);
		this.nameMesh.position.y = 3;
		this.nameMesh.scale.set(.2, .2, .2);

		this.mesh.add(this.nameMesh);

		const textureParam = {
			title: 'Texture',
			param: 'map',
			useAsInput: true,
			parent: 'Texture',
			paramHelpersType: 'texture',
			needsFrameUpdate: false,
			defaultConnect: true,
		};

		const colorParam = {
			title: 'Color',
			param: 'color',
			useAsInput: true,
			defaultVal: new THREE.Color(1,1,1),
			parent: 'Color',
			paramHelpersType: 'color',
			needsFrameUpdate: false,
			defaultConnect: true,
		};

		// const bumpMapParam = {
		// 	title: 'Displacement',
		// 	// param: 'displacementMap',
		// 	param: 'normalMap',
		// 	useAsInput: true,
		// 	parent: 'Displacement',
		// 	paramHelpersType: 'normalMap',
		// 	needsFrameUpdate: false,
		// };

		const positionXParam = {
			title: 'Position X',
			param: 'x',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'position',
			needsFrameUpdate: false,
			minMax: {min: -2, max: 2},
			defaultVal: 0,
			defaultConnect: true,
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
			defaultConnect: false,
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
			defaultConnect: true,
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

		const scaleParam = {
			title: 'Scale',
			param: 'scale',
			useAsInput: true,
			parent: 'Scale',
			paramHelpersType: 'scale',
			needsFrameUpdate: false,
			minMax: {min: .1, max: 6},
			defaultVal: 1,
			defaultConnect: true,
		};

		this.params = {
			textureParam,
			colorParam,
			// bumpMapParam,
			positionXParam,
			positionYParam,
			positionZParam,
			rotationXParam,
			rotationYParam,
			scaleParam,
		};

		this.paramVals = {};
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

		const canvas = this.nodeTitle.canvas;
		this.nameTexture = new THREE.CanvasTexture(canvas);
		this.nameMesh.material.map = this.nameTexture;
		this.nameTexture.needsUpdate = true;

		this.enabledOutputs = [];
	}

	getMesh() {
		return this.mesh;
	}

	update() {
		// this.nameTexture.needsUpdate = true;
	}

	render() {

	}

}