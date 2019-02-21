import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class EnvelopeNode extends MusicNode{
	constructor() {
		super();

		this.el.classList.add('no-height');

		this.isParam = true;
		this.isKeyboardListener = true;
		this.isEnvelope = true;

		this.audioNode = new Tone.Envelope();

		const rangeContainer = document.createElement('div');
		rangeContainer.className = 'range-container';

		this.topPartEl.appendChild(rangeContainer);

		this.onRangeChangeCallbackBound = this.onRangeChangeCallback.bind(this);

		const attackRangeConfig = {
			parentEl: rangeContainer,
			title: 'A',
			initValue: 0.25,
			settings: {min: .01, max: 2.0},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'attack',
			decimals: 2,
			disable: false,
		};

		this.attackRangeSlider = new RangeSlider(
			attackRangeConfig.parentEl,
			attackRangeConfig.title,
			attackRangeConfig.initValue,
			attackRangeConfig.settings,
			attackRangeConfig.valChangeCallback,
			attackRangeConfig.param,
			attackRangeConfig.decimals,
			attackRangeConfig.disable,
		);

		const decayRangeConfig = {
			parentEl: rangeContainer,
			title: 'D',
			initValue: 0.77,
			settings: {min: .01, max: 2.0},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'decay',
			decimals: 2,
			disable: false,
		};

		this.decayRangeSlider = new RangeSlider(
			decayRangeConfig.parentEl,
			decayRangeConfig.title,
			decayRangeConfig.initValue,
			decayRangeConfig.settings,
			decayRangeConfig.valChangeCallback,
			decayRangeConfig.param,
			decayRangeConfig.decimals,
			decayRangeConfig.disable,
		);

		const sustainRangeConfig = {
			parentEl: rangeContainer,
			title: 'S',
			initValue: 0.11,
			settings: {min: .01, max: 1.0},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'sustain',
			decimals: 2,
			disable: false,
		};

		this.sustainRangeSlider = new RangeSlider(
			sustainRangeConfig.parentEl,
			sustainRangeConfig.title,
			sustainRangeConfig.initValue,
			sustainRangeConfig.settings,
			sustainRangeConfig.valChangeCallback,
			sustainRangeConfig.param,
			sustainRangeConfig.decimals,
			sustainRangeConfig.disable,
		);


		const releaseRangeConfig = {
			parentEl: rangeContainer,
			title: 'R',
			initValue: 0.11,
			settings: {min: .01, max: 2.0},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'release',
			decimals: 2,
			disable: false,
		};

		this.releaseRangeSlider = new RangeSlider(
			releaseRangeConfig.parentEl,
			releaseRangeConfig.title,
			releaseRangeConfig.initValue,
			releaseRangeConfig.settings,
			releaseRangeConfig.valChangeCallback,
			releaseRangeConfig.param,
			releaseRangeConfig.decimals,
			releaseRangeConfig.disable,
		);

		const attackParam = {
			useAsInput: false,
			value: attackRangeConfig.initValue,
			param: 'attack',
			slider: this.attackRangeSlider,
			title: 'Attack',
		};

		const decayParam = {
			useAsInput: false,
			value: decayRangeConfig.initValue,
			param: 'decay',
			slider: this.decayRangeSlider,
			title: 'Decay',
		};

		const sustainParam = {
			useAsInput: false,
			value: sustainRangeConfig.initValue,
			param: 'sustain',
			slider: this.sustainRangeSlider,
			title: 'Sustain',
		};

		const releaseParam = {
			useAsInput: false,
			value: releaseRangeConfig.initValue,
			param: 'release',
			slider: this.releaseRangeSlider,
			title: 'Release',
		};

		const ADSRParams = {};

		ADSRParams[attackParam.param] = attackParam;
		ADSRParams[decayParam.param] = decayParam;
		ADSRParams[sustainParam.param] = sustainParam;
		ADSRParams[releaseParam.param] = releaseParam;


 		/*

		create different params for different envelopes
		and set this.params to active envelope params


		*/

		// const frequencyEnvelopeParams = {
		// 	'BaseFrequency' : {
		// 		obj: RangeSlider,
		// 		objSettings: {
		// 			title: 'BF',
		// 			defaultVal: 200,
		// 			range: {min: 1, max: 22000},
		// 			param: 'baseFrequency',
		// 			decimals: 0
		// 		},
		// 		useAsInput: false,
		// 	}
		// };

		// const scaledEnvelopeParams = {
		// 	'Min' : {
		// 		obj: RangeSlider,
		// 		objSettings: {
		// 			title: 'Min',
		// 			defaultVal: 200,
		// 			range: {min: 1, max: 22000},
		// 			param: 'min',
		// 			decimals: 0
		// 		},
		// 		useAsInput: false,
		// 	},
		// 	'Max' : {
		// 		obj: RangeSlider,
		// 		objSettings: {
		// 			title: 'Max',
		// 			defaultVal: 2000,
		// 			range: {min: 1, max: 22000},
		// 			param: 'max',
		// 			decimals: 0
		// 		},
		// 		useAsInput: false,
		// 	}
		// };

		this.paramDefaults = {
			ADSR: ADSRParams,
			// Frequency: frequencyEnvelopeParams,
			// Scaled: scaledEnvelopeParams,
		};

		this.params = Object.assign({}, this.paramDefaults.ADSR);

		// this.paramVals = {};

		// this.params = {};

		// const allParams = Object.assign({}, ADSRParams, frequencyEnvelopeParams, scaledEnvelopeParams);
		// for (const loopKey in allParams) {
		// 	const key = allParams[loopKey].objSettings.param;
		// 	this.paramVals[key] = allParams[loopKey].objSettings.defaultVal;
		// }
	}

	onRangeChangeCallback(value, param) {

		this.params[param].value = value;
		this.onParameterChange(this);
	}

	getAudioNode(param) {

		let envObj = Tone.Envelope;

		// if (param !== 'gain') {
		// 	this.params = Object.assign({}, this.paramDefaults.ADSR, this.paramDefaults.Scaled);
		// 	envObj = Tone.ScaledEnvelope;
		// } else {
		// 	this.params = this.paramDefaults.ADSR;
		// }

		const env = new envObj();

		for (const key in this.params) {
			// const paramStr = this.params[key].param;
			env[key] = this.params[key].value;
		}

		return env;
	}

}