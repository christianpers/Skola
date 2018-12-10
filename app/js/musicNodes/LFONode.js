import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class LFONode extends MusicNode{
	constructor() {
		super();

		this.isParam = true;

		this.audioNode = new Tone.LFO();

		this.audioNode.start();

		const rangeSliderContainer = document.createElement('div');
		rangeSliderContainer.className = 'range-slider-container';

		console.log('hej matte');

		this.el.appendChild(rangeSliderContainer);

		this.frequencySlider = new RangeSlider(
			rangeSliderContainer,
			'Frequency',
			1.0,
			{min: 0.1, max: 17.0},
			this.onParameterChangeBound,
			'frequency',
			2
		);



		this.amplitudeSlider = new RangeSlider(
			rangeSliderContainer,
			'Amplitude',
			0.5,
			{min: 0, max: 1},
			this.onParameterChangeBound,
			'amplitude',
			2
		);

		this.onParameterChangeBound = this.onParameterChange.bind(this);

	}

	getParams(step) {
		const params = {};
		params.frequency = this.frequencySlider.getReadyValue();
		params.amplitude = this.amplitudeSlider.getReadyValue();

		return params;
	}

	getAudioNode() {

		const lfo = new Tone.LFO();
		lfo.min = -22000;
		lfo.max = 22000;
		lfo.start();

		return lfo;
	}

	onParameterChange(val, type) {
		if (type === 'frequency' || type === 'amplitude') {
			this.audioNode[type].value = val;
		} else {
			this.audioNode[type] = val;
		}
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