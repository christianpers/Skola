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

		this.mainMesh = mesh;

		this.mesh = new THREE.Group();
		this.mesh.add(mesh);

		const w = window.innerWidth;
		const h = window.innerHeight;

		this.camera = new THREE.PerspectiveCamera( 70, w / h, 0.1, 100 );
		this.camera.position.set( -1, 1, -10 );
		this.mesh.add(this.camera);

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

		// const canvas = this.nodeTitle.canvas;
		// this.nameTexture = new THREE.CanvasTexture(canvas);
		// this.nameMesh.material.map = this.nameTexture;
		// this.nameTexture.needsUpdate = true;

		this.enabledOutputs = [];
	}

	onCanvasResize(e) {
		const [w, h] = e.detail;

		if (this.camera.aspect) {
			this.camera.aspect = w / h;
		} else {
			this.camera.left = w / - 2;
			this.camera.right = w / 2;
			this.camera.top = h / -2;
			this.camera.bottom = h / 2;
		}
		this.camera.updateProjectionMatrix();
	}

	getMesh() {
		return this.mesh;
	}

	update() {
		/* TODO THIS SHOULD Only BE DONE WHEN CAMERA ACTIVE */

		// this.camera.lookAt(this.mesh.position);

		// const relativeCameraOffset = new THREE.Vector3(0, 2, 20);

		// const cameraOffset = relativeCameraOffset.applyMatrix4( this.mesh.matrixWorld );

		// // this.camera.position.x = cameraOffset.x;
		// // this.camera.position.y = cameraOffset.y;
		// // this.camera.position.z = cameraOffset.z;
		// this.camera.position.copy(cameraOffset);
		// this.camera.lookAt( this.mesh.position );
		// this.mesh.lookAt(this.mesh.position);
	}

	render() {

	}

}