import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class FrequencyEnvelopeNode extends MusicNode{
	constructor() {
		super();

		this.isParam = true;
		this.keyIsDown = false;
		this.isKeyboardListener = true;
		this.isEnvelope = true;

		this.audioNode = new Tone.FrequencyEnvelope();

		const rangeSliderContainer = document.createElement('div');
		rangeSliderContainer.className = 'range-slider-container';

		this.el.appendChild(rangeSliderContainer);

		this.onParameterChangeBound = this.onParameterChange.bind(this);

		this.attack = new RangeSlider(
			rangeSliderContainer,
			'A',
			0.01,
			{min: 0, max: 2},
			this.onParameterChangeBound,
			'attack',
			2
		);
		
		this.decay = new RangeSlider(
			rangeSliderContainer,
			'D',
			0.1,
			{min: 0, max: 2},
			this.onParameterChangeBound,
			'decay',
			2
		);
		
		this.sustain = new RangeSlider(
			rangeSliderContainer,
			'S',
			0.5,
			{min: 0, max: 1},
			this.onParameterChangeBound,
			'sustain',
			2
		);
		
		this.release = new RangeSlider(
			rangeSliderContainer,
			'R',
			1,
			{min: 0, max: 2},
			this.onParameterChangeBound,
			'release',
			2
		);
	}

	getParams(step) {
		const params = {};
		params.attack = this.attack.getReadyValue();
		params.release = this.release.getReadyValue();
		params.sustain = this.sustain.getReadyValue();
		params.release = this.release.getReadyValue();

		return params;
	}

	getAudioNode() {

		const env = new Tone.FrequencyEnvelope();
		env.attack = this.attack.getReadyValue();
		env.release = this.release.getReadyValue();
		env.sustain = this.sustain.getReadyValue();
		env.release = this.release.getReadyValue();

		return env;
	}

	onParameterChange(val, type) {
		this.audioNode[type] = val;
	}

	setup() {

	}

	keyDown() {
		this.audioNode.triggerAttack();
	}

	keyUp() {
		this.audioNode.triggerRelease();
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