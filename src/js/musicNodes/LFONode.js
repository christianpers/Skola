import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import AudioInputHelpers from '../musicHelpers/AudioInputHelpers';

export default class LFONode extends MusicNode{
	constructor() {
		super();

		this.isParam = true;
		this.isLFO = true;

		this.el.classList.add('no-height');

		this.audioNode = new Tone.LFO();

		const rangeContainer = document.createElement('div');
		rangeContainer.className = 'range-container';

		this.topPartEl.appendChild(rangeContainer);

		this.onRangeChangeCallbackBound = this.onRangeChangeCallback.bind(this);

		const freqRangeConfig = {
			parentEl: rangeContainer,
			title: 'Frekvens',
			initValue: 6.0,
			settings: {min: 0.1, max: 17.0},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'frequency',
			decimals: 2,
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

		const freqParam = {
			useAsInput: true,
			value: freqRangeConfig.initValue,
			param: 'frequency',
			slider: this.freqRangeSlider,
			title: 'LFO Frequency',
			helper: AudioInputHelpers.frequency,
			disableSliderOnConnection: false,
		};


		const amplitudeRangeConfig = {
			parentEl: rangeContainer,
			title: 'Amplitud',
			initValue: .25,
			settings: {min: 0.1, max: 0.5},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'amplitude',
			decimals: 2,
			disable: false,
		};

		this.amplitudeRangeSlider = new RangeSlider(
			amplitudeRangeConfig.parentEl,
			amplitudeRangeConfig.title,
			amplitudeRangeConfig.initValue,
			amplitudeRangeConfig.settings,
			amplitudeRangeConfig.valChangeCallback,
			amplitudeRangeConfig.param,
			amplitudeRangeConfig.decimals,
			amplitudeRangeConfig.disable,
		);

		const amplitudeParam = {
			useAsInput: true,
			value: amplitudeRangeConfig.initValue,
			param: 'amplitude',
			slider: this.amplitudeRangeSlider,
			title: 'Amplitude',
			helper: AudioInputHelpers.frequency,
			disableSliderOnConnection: false,
		};

		this.params[freqParam.param] = freqParam;
		this.params[amplitudeParam.param] = amplitudeParam;

		this.paramVals = {};
	}

	onRangeChangeCallback(value, param) {
		this.params[param].value = value;
		this.onParameterChange(this);
	}

	getAudioNode() {

		const lfo = new Tone.LFO();
		lfo.min = -22000;
		lfo.max = 22000;
		// lfo.start();

		return lfo;
	}

}