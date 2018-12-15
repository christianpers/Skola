import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class EnvelopeNode extends MusicNode{
	constructor() {
		super();

		this.isParam = true;
		this.keyIsDown = false;
		this.isKeyboardListener = true;
		this.isEnvelope = true;

		this.audioNode = new Tone.Envelope();

		this.params = {
			'Attack' : {
				obj: RangeSlider,
				objSettings: {
					title: 'A',
					val: 0.01,
					range: {min: 0, max: 2},
					param: 'attack',
					decimals: 2
				}
			},
			'Decay' : {
				obj: RangeSlider,
				objSettings: {
					title: 'D',
					val: 0.1,
					range: {min: 0, max: 2},
					param: 'decay',
					decimals: 2
				}
			},
			'Sustain' : {
				obj: RangeSlider,
				objSettings: {
					title: 'S',
					val: 0.5,
					range: {min: 0, max: 1},
					param: 'sustain',
					decimals: 2
				}
			},
			'Release' : {
				obj: RangeSlider,
				objSettings: {
					title: 'R',
					val: 1,
					range: {min: 0, max: 2},
					param: 'release',
					decimals: 2
				}
			}
		}
	}

	getAudioNode() {

		const env = new Tone.Envelope();
		env.attack = this.params['Attack'].objSettings.val;
		env.decay = this.params['Decay'].objSettings.val;
		env.sustain = this.params['Decay'].objSettings.val;
		env.release = this.params['Decay'].objSettings.val;

		return env;
	}

	setup() {

	}

	// enableInput(outputAudioNode) {
	// 	super.enableInput();
	// 	outputAudioNode.connect(this.audioNode);
	// }

	// disableInput(nodeToDisconnect) {
	// 	super.disableInput();
	// 	nodeToDisconnect.disconnect(this.audioNode);
	// }

	main() {



	}
}