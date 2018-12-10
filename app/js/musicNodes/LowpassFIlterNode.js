import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class LowpassFilterNode extends MusicNode{
	constructor() {
		super();

		
		this.audioNode = new Tone.Filter();

		const rangeSliderContainer = document.createElement('div');
		rangeSliderContainer.className = 'range-slider-container';

		this.el.appendChild(rangeSliderContainer);

		this.onParameterChangeBound = this.onParameterChange.bind(this);

		this.release = new RangeSlider(
			rangeSliderContainer,
			'Frequency',
			350,
			{min: 0, max: 22000},
			this.onParameterChangeBound,
			'frequency',
			0
		);

	}

	getParams(step) {
		const params = {};
		params.frequency = this.release.getReadyValue();

		return params;
	}

	getAudioNode() {

		const audioNode = new Tone.Filter();
		audioNode.frequency.value = this.audioNode.frequency.value;
		audioNode.Q.value = 10;

		return audioNode;
	}

	getParamConnection() {

		return 'frequency';
	}

	onParameterChange(val, type) {
		if (type === 'frequency') {
			this.audioNode[type].value = val;
		} else {
			this.audioNode[type] = val;
		}
	}

	setup() {

		
	}

	enableInput(outputAudioNode) {
		super.enableInput();
		if (outputAudioNode.isParam) {
			outputAudioNode.audioNode.connect(this.audioNode.frequency);
		} else {
			outputAudioNode.audioNode.connect(this.audioNode);
		}
		
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();
		if (nodeToDisconnect.isParam) {
			// nodeToDisconnect.audioNode.disconnect(this.audioNode.frequency);
			this.audioNode.disconnect(nodeToDisconnect.audioNode);
		} else {
			nodeToDisconnect.audioNode.disconnect(this.audioNode);
		}
		
	}

	main() {



	}
}