import GraphicNode from './GraphicNode';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import { Vector2 } from 'three';

export default class RotationNode extends GraphicNode{
	constructor() {
		super();

		this.modifier = {
			param: 'rotation',
			value: new Vector2(0, 0),
			default: new Vector2(0, 0),
		};

		this.paramVals = {};

		this.params = {
			'X' : {
				obj: RangeSlider,
				objSettings: {
					title: 'X',
					defaultVal: 0.0,
					range: {min: -1, max: 1},
					param: 'x',
					decimals: 2
				},
				useAsInput: true,
			},
			'Y' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Y',
					defaultVal: 0.0,
					range: {min: -1, max: 1},
					param: 'y',
					decimals: 2
				},
				useAsInput: true,
			},
		};

		for (const loopKey in this.params) {
			const key = this.params[loopKey].objSettings.param;
			this.paramVals[key] = this.params[loopKey].objSettings.defaultVal;
		}
	}

	onParameterUpdate() {
		const params = this.getParams();

		this.modifier.value = new Vector2(params.x, params.y);

		this.onGraphicsParamChange(this);
	}

	enableInput(outputNode) {
		super.enableInput();		
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();
	}

}