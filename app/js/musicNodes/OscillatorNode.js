import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class OscillatorNode extends MusicNode{
	constructor() {
		super();

		// OscillatorNode.BASE_OCTAVE = 4;
		OscillatorNode.BASE_FREQ = 440;
		OscillatorNode.ROOT = Math.pow(2,(1/12));

		this.isKeyboardListener = true;
		this.isOscillator = true;
		this.hasAudioInput = false;

		this.paramVals = {};

		this.params = {
			'Octave' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Octave',
					defaultVal: 0,
					range: {min: -3, max: 3},
					param: 'octave',
					decimals: 0
				},
				useAsInput: false,
			}
		};

		for (const loopKey in this.params) {
			const key = this.params[loopKey].objSettings.param;
			this.paramVals[key] = this.params[loopKey].objSettings.defaultVal;
		}
	}

	getParams(step) {
		if (!step) {
			step = 0;
		}
		
		const params = {};
		params.frequency = this.getFrequency(step);
		params.type = "sawtooth";

		return params;
	}

	getAudioNode() {

		const oscAudioNode = new Tone.Oscillator();

		// oscAudioNode.type = "sawtooth";
		// oscAudioNode.frequency.value = this.getFrequency(step);
		// oscAudioNode.start();

		return oscAudioNode;
	}

	getFrequency(step) {

		// const octaveOffset = parseInt(this.params['Octave'].objSettings.val);
		const octaveOffset = parseInt(this.paramVals['octave']);
		// console.log(octaveOffset);

		const tempOctave = octaveOffset;
		const tempSteps = 12 * tempOctave + step;
		
		const freq = OscillatorNode.BASE_FREQ * Math.pow(OscillatorNode.ROOT, tempSteps);

		return freq;
	}

	// keyDown(step) {

	// 	const freq = this.getFrequency(step);

	// 	this.audioNode.frequency.value = freq;

	// }

	// keyUp() {
	// }

	onParameterChange(val, type) {

		// this.audioNode[type] = val;

		// console.log(this.audioNode);
	}

	setup() {

		// this.audioNode = new Tone.Oscillator();

		// this.audioNode.type = "sawtooth";
		// this.audioNode.frequency.value = 130.812782650299317;
		// this.audioNode.start();
	}

	main() {



	}
}