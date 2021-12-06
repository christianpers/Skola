import CubeNode from '../Shapes/CubeNode';

export default class MathCubeNode extends CubeNode{

	constructor() {
		super();

		/* STYlE START */
		const textureParam = {
			title: 'Texture',
			param: 'map',
			useAsInput: true,
			parent: 'Style',
			paramHelpersType: 'style',
			needsFrameUpdate: false,
			defaultConnect: true,
		};

		const colorParam = {
			title: 'Color',
			param: 'color',
			useAsInput: true,
			defaultVal: new THREE.Color(1,1,1),
			parent: 'Style',
			paramHelpersType: 'style',
			needsFrameUpdate: false,
			defaultConnect: true,
		};
		
		// const bumpMapParam = {
		// 	title: 'Displacement',
		// 	// param: 'displacementMap',
		// 	param: 'normalMap',
		// 	useAsInput: true,
		// 	parent: 'Material',
		// 	paramHelpersType: 'normalMap',
		// 	needsFrameUpdate: false,
		// };
		/* STYlE END */

		const mathDrawerParam = {
			title: 'Rita',
			param: 'rita',
			useAsInput: true,
			parent: 'Rita',
			paramHelpersType: 'mathDrawing',
			needsFrameUpdate: false,
			defaultConnect: true
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
			defaultConnect: true,
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
			defaultConnect: true,
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
			title: 'Storlek',
			param: 'scale',
			useAsInput: true,
			parent: 'Storlek',
			paramHelpersType: 'mathScale',
			needsFrameUpdate: false,
			minMax: {min: .1, max: 6},
			defaultVal: 0,
			defaultConnect: true,
		};

		this.params = {
			textureParam,
			colorParam,
			mathDrawerParam,
			// bumpMapParam,
			positionXParam,
			positionYParam,
			positionZParam,
			rotationXParam,
			rotationYParam,
			scaleParam,
		}

		this.paramVals = {};
	}

	update() {
	}

	render() {

	}
}