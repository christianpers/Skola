import GraphicNode from './GraphicNode';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import { Color } from 'three';

export default class ColorNode extends GraphicNode{
	constructor() {
		super();

		this.canConnectToMaterial = true;

		this.modifier = {
			param: 'color',
			value: new Color( 1, 0, 0 ),
			default: new Color(1, 1, 1),
		};

		this.paramVals = {};

		this.params = {
			'R' : {
				obj: RangeSlider,
				objSettings: {
					title: 'R',
					defaultVal: 0.5,
					range: {min: 0, max: 1},
					param: 'r',
					decimals: 2
				},
				useAsInput: true,
			},
			'G' : {
				obj: RangeSlider,
				objSettings: {
					title: 'G',
					defaultVal: 0,
					range: {min: 0, max: 1},
					param: 'g',
					decimals: 2
				},
				useAsInput: true,
			},
			'B' : {
				obj: RangeSlider,
				objSettings: {
					title: 'B',
					defaultVal: 0,
					range: {min: 0, max: 1},
					param: 'b',
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

		this.modifier.value = new Color(params.r, params.g, params.b);

		this.onGraphicsParamChange(this);
	}

	enableInput(outputNode) {
		super.enableInput();		
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();
	}

}