import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class LowpassFilterNode extends MusicNode{
	constructor() {
		super();
		
		this.audioNode = new Tone.Filter();

		this.paramVals = {};

		this.params = {
			'Frequency' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Frequency',
					defaultVal: 350,
					range: {min: 0, max: 22000},
					param: 'frequency',
					decimals: 0
				},
				useAsInput: true,
			},
			'Q' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Q',
					defaultVal: 1,
					range: {min: 0, max: 10},
					param: 'Q',
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

	getAudioNode() {

		const audioNode = new Tone.Filter();
		// audioNode.frequency.value = this.params['Frequency'].objSettings.val;
		// audioNode.Q.value = this.params['Q'].objSettings.val;

		for (const key in this.params) {
			const paramStr = this.params[key].objSettings.param;
			audioNode[paramStr].value = this.paramVals[paramStr];
		}

		return audioNode;
	}

	getParamConnection() {

		return 'frequency';
	}

	setup() {

		
	}

	enableInput(outputAudioNode) {
		super.enableInput();
		// if (outputAudioNode.isParam) {
		// 	outputAudioNode.audioNode.connect(this.audioNode.frequency);
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