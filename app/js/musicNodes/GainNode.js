import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class GainNode extends MusicNode{
	constructor() {
		super();

		this.audioNode = Tone.context.createGain();

		this.paramVals = {};

		this.params = {
			'Gain' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Gain',
					defaultVal: .5,
					range: {min: 0, max: 1},
					param: 'gain',
					decimals: 2
				},
				useAsInput: true,
				isConnected: false,
			},
		};

		for (const loopKey in this.params) {
			const key = this.params[loopKey].objSettings.param;
			this.paramVals[key] = this.params[loopKey].objSettings.defaultVal;
		}

	}

	setup() {

		
	}

	// getParams() {
	// 	const params = {};
	// 	// params.gain = {
	// 	// 	val: this.params['Gain'].objSettings.val,
	// 	// 	ic
	// 	// }
	// 	params.gain = this.params['Gain'].objSettings.val;

	// 	return params;
	// }

	getAudioNode() {

		return Tone.context.createGain();
	}

	getParamConnection() {

		return 'gain';
	}

	enableInput(outputAudioNode) {
		super.enableInput();

		// if (outputAudioNode.isParam) {
		// 	outputAudioNode.audioNode.connect(this.audioNode.gain);
			
		// } else {
		// 	outputAudioNode.audioNode.connect(this.audioNode);
		// }
		
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();
		// if (nodeToDisconnect.isParam) {
		// 	// nodeToDisconnect.audioNode.disconnect(this.audioNode.frequency);
			

			
		// 	this.audioNode.disconnect(nodeToDisconnect.audioNode);
		
			
		// } else {
		// 	nodeToDisconnect.audioNode.disconnect(this.audioNode);
		// }
		
	}

	main() {



	}
}