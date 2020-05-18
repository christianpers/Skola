import SphereNode from '../Shapes/SphereNode';

export default class PlanetNode extends SphereNode{
	constructor() {
		super();

		

		const textureParam = {
			title: 'Texture',
			param: 'Planet',
			useAsInput: true,
			parent: 'Texture',
			paramHelpersType: 'texture',
			needsFrameUpdate: false,
			defaultConnect: true,
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

        const sizeParam = {
			title: 'Storlek',
			param: 'Storlek',
			useAsInput: true,
			parent: 'Storlek',
			paramHelpersType: 'scale',
			needsFrameUpdate: false,
			minMax: {min: .1, max: 6},
			defaultVal: 1,
			defaultConnect: true,
		};

		this.params = {
			textureParam,
			// colorParam,
			// bumpMapParam,
			positionXParam,
			positionYParam,
			positionZParam,
			// rotationXParam,
			rotationYParam,
			sizeParam,
		};

		this.paramVals = {};
	}

}