import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import AudioInputHelpers from '../musicHelpers/AudioInputHelpers';

export default class GainNode extends MusicNode{
	constructor() {
		super();

		this.inputHelpersType = AudioInputHelpers.multiple;

		this.el.classList.add('no-height');

		this.audioNode = Tone.context.createGain();

		const rangeContainer = document.createElement('div');
		rangeContainer.className = 'range-container';

		this.topPartEl.appendChild(rangeContainer);

		this.onRangeChangeCallbackBound = this.onRangeChangeCallback.bind(this);

		const gainRangeConfig = {
			parentEl: rangeContainer,
			title: 'Vol',
			initValue: 0.5,
			settings: {min: .0, max: 1.0},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'gain',
			decimals: 2,
			disable: false,
		};

		this.gainRangeSlider = new RangeSlider(
			gainRangeConfig.parentEl,
			gainRangeConfig.title,
			gainRangeConfig.initValue,
			gainRangeConfig.settings,
			gainRangeConfig.valChangeCallback,
			gainRangeConfig.param,
			gainRangeConfig.decimals,
			gainRangeConfig.disable,
		);

		const gainParam = {
			useAsInput: true,
			value: gainRangeConfig.initValue,
			param: 'gain',
			slider: this.gainRangeSlider,
			title: 'Gain',
			helper: AudioInputHelpers.gain,
			disableSliderOnConnection: true,
		};

		this.paramVals = {};

		this.params[gainParam.param] = gainParam;

	}

	onRangeChangeCallback(value, param) {
		this.params[param].value = value;
		this.onParameterChange(this);
	}

	getAudioNode() {

		return Tone.context.createGain();
	}

}