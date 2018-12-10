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

		const rangeSliderContainer = document.createElement('div');
		rangeSliderContainer.className = 'range-slider-container';

		this.el.appendChild(rangeSliderContainer);

		this.onParameterChangeBound = this.onParameterChange.bind(this);

		this.octaveSlider = new RangeSlider(rangeSliderContainer, 'Octave', 0, {min: -3, max: 3}, null, '', 0);
	}

	getParams(step) {
		const params = {};
		params.frequency = this.getFrequency(step);
		params.type = "sawtooth";

		return params;
	}

	getAudioNode(step) {

		const oscAudioNode = new Tone.Oscillator();

		oscAudioNode.type = "sawtooth";
		oscAudioNode.frequency.value = this.getFrequency(step);
		oscAudioNode.start();

		return oscAudioNode;
	}

	getFrequency(step) {

		const octaveOffset = parseInt(this.octaveSlider.getValue().toFixed(0));

		const tempOctave = octaveOffset;
		const tempSteps = 12 * tempOctave + step;
		
		const freq = OscillatorNode.BASE_FREQ * Math.pow(OscillatorNode.ROOT, tempSteps);

		console.log('freq: ', freq);

		return freq;
	}

	keyDown(step) {

		const freq = this.getFrequency(step);
		console.log(freq);

		this.audioNode.frequency.value = freq;

		console.log(this.audioNode);
	}

	keyUp() {
	}

	onParameterChange(val, type) {
		// this.audioNode[type] = val;

		// console.log(this.audioNode);
	}

	setup() {

		this.audioNode = new Tone.Oscillator();

		this.audioNode.type = "sawtooth";
		this.audioNode.frequency.value = 130.812782650299317;
		// this.audioNode.start();
	}

	main() {



	}
}