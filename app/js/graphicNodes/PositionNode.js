import GraphicNode from './GraphicNode';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import { Vector3 } from 'three';

export default class PositionNode extends GraphicNode{
	constructor() {
		super();

		this.modifier = {
			param: 'position',
			value: new Vector3(0, 0, 0),
			default: new Vector3(0, 0, 0),
		};

		this.paramVals = {};

		this.params = {
			'X' : {
				obj: RangeSlider,
				objSettings: {
					title: 'X',
					defaultVal: 0.0,
					range: {min: -10, max: 10},
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
					range: {min: -10, max: 10},
					param: 'y',
					decimals: 2
				},
				useAsInput: true,
			},
			'Z' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Z',
					defaultVal: 0,
					range: {min: -10, max: 10},
					param: 'z',
					decimals: 2
				},
				useAsInput: true,
			}
		};

		for (const loopKey in this.params) {
			const key = this.params[loopKey].objSettings.param;
			this.paramVals[key] = this.params[loopKey].objSettings.defaultVal;
		}
	}

	onParameterUpdate() {
		const params = this.getParams();

		this.modifier.value = new Vector3(params.x, params.y, params.z);

		this.onGraphicsParamChange(this);
	}

	enableInput(outputNode) {
		super.enableInput();		
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();
	}

}