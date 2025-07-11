import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import AudioInputHelpers from '../musicHelpers/AudioInputHelpers';

export default class LowpassFilterNode extends MusicNode{
	constructor() {
		super();
		
		this.audioNode = new Tone.Filter();

		this.el.classList.add('no-height');

		const rangeContainer = document.createElement('div');
		rangeContainer.className = 'range-container';

		this.topPartEl.appendChild(rangeContainer);

		this.onRangeChangeCallbackBound = this.onRangeChangeCallback.bind(this);

		const freqRangeConfig = {
			parentEl: rangeContainer,
			title: 'Frekvens',
			initValue: 350,
			settings: {min: 0, max: 22000},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'frequency',
			decimals: 0,
			disable: false,
		};

		this.freqRangeSlider = new RangeSlider(
			freqRangeConfig.parentEl,
			freqRangeConfig.title,
			freqRangeConfig.initValue,
			freqRangeConfig.settings,
			freqRangeConfig.valChangeCallback,
			freqRangeConfig.param,
			freqRangeConfig.decimals,
			freqRangeConfig.disable,
		);

		const qRangeConfig = {
			parentEl: rangeContainer,
			title: 'Q',
			initValue: 1,
			settings: {min: 0, max: 10},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'Q',
			decimals: 0,
			disable: false,
		};

		this.qRangeSlider = new RangeSlider(
			qRangeConfig.parentEl,
			qRangeConfig.title,
			qRangeConfig.initValue,
			qRangeConfig.settings,
			qRangeConfig.valChangeCallback,
			qRangeConfig.param,
			qRangeConfig.decimals,
			qRangeConfig.disable,
		);

		const freqParam = {
			useAsInput: true,
			value: freqRangeConfig.initValue,
			param: 'frequency',
			slider: this.freqRangeSlider,
			title: 'Filter Frequency',
			helper: AudioInputHelpers.frequency,
			disableSliderOnConnection: false,
		};

		const qParam = {
			useAsInput: false,
			value: qRangeConfig.initValue,
			param: 'Q',
			slider: this.qRangeSlider,
			title: 'Q',
		};

		this.paramVals = {};

		this.params[freqParam.param] = freqParam;
		this.params[qParam.param] = qParam;

	}

	onRangeChangeCallback(value, param) {
		this.params[param].value = value;
		this.onParameterChange(this);
	}

	getAudioNode() {

		const audioNode = new Tone.Filter();
		
		for (const key in this.params) {
			audioNode[key].value = this.params[key].value;
		}

		return audioNode;
	}

}