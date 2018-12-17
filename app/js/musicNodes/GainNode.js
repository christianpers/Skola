import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class GainNode extends MusicNode{
	constructor() {
		super();

		this.audioNode = Tone.context.createGain();

		this.params = {
			'Gain' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Gain',
					val: .5,
					range: {min: 0, max: 1},
					param: 'gain',
					decimals: 2
				},
				useAsInput: true,
			},
		}

	}

	setup() {

		
	}

	getParams() {
		return {};
	}

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