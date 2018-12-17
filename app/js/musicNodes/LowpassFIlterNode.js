import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class LowpassFilterNode extends MusicNode{
	constructor() {
		super();
		
		this.audioNode = new Tone.Filter();

		this.params = {
			'Frequency' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Frequency',
					val: 350,
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
					val: 1,
					range: {min: 0, max: 10},
					param: 'Q',
					decimals: 2
				},
				useAsInput: true,
			},
		}

	}

	getAudioNode() {

		const audioNode = new Tone.Filter();
		audioNode.frequency.value = this.params['Frequency'].objSettings.val;
		audioNode.Q.value = this.params['Q'].objSettings.val;

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