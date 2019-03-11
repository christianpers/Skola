import GraphicNode from '../GraphicNode';

export default class PointLightNode extends GraphicNode{
	constructor() {
		super();

		this.isLightNode = true;

		this.el.classList.add('no-height');

		this.light = new THREE.PointLight( 0xffffff, 1, 100 );
		this.light.position.set(0, 0, 0);

		this.geometry = new THREE.SphereGeometry(1, 20, 20);
		this.material = new THREE.MeshBasicMaterial();
		this.mesh = new THREE.Mesh(this.geometry, this.material);

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

		const positionXParam = {
			title: 'Position X',
			param: 'x',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'light',
			needsFrameUpdate: false,
			minMax: {min: -10, max: 10},
			defaultVal: 0,
		};

		const positionYParam = {
			title: 'Position Y',
			param: 'y',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'light',
			needsFrameUpdate: false,
			minMax: {min: -10, max: 10},
			defaultVal: 0,
		};

		const positionZParam = {
			title: 'Position Z',
			param: 'z',
			useAsInput: true,
			parent: 'Position',
			paramHelpersType: 'light',
			needsFrameUpdate: false,
			minMax: {min: -10, max: 10},
			defaultVal: 4,
		};

		this.params = {
			textureParam,
			colorParam,
			positionXParam,
			positionYParam,
			positionZParam,
		};

		this.paramVals = {};
	}

}