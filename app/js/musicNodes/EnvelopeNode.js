import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class EnvelopeNode extends MusicNode{
	constructor() {
		super();

		this.isParam = true;
		this.isKeyboardListener = true;
		this.isEnvelope = true;

		this.audioNode = new Tone.Envelope();

		/*

		create different params for different envelopes
		and set this.params to active envelope params


		*/

		const ADSRParams = {
			'Attack' : {
				obj: RangeSlider,
				objSettings: {
					title: 'A',
					defaultVal: 0.01,
					range: {min: 0, max: 2},
					param: 'attack',
					decimals: 2
				},
				useAsInput: false,
			},
			'Decay' : {
				obj: RangeSlider,
				objSettings: {
					title: 'D',
					defaultVal: 0.1,
					range: {min: 0, max: 2},
					param: 'decay',
					decimals: 2
				},
				useAsInput: false,
			},
			'Sustain' : {
				obj: RangeSlider,
				objSettings: {
					title: 'S',
					defaultVal: 0.5,
					range: {min: 0, max: 1},
					param: 'sustain',
					decimals: 2
				},
				useAsInput: false,
			},
			'Release' : {
				obj: RangeSlider,
				objSettings: {
					title: 'R',
					defaultVal: 1,
					range: {min: 0, max: 2},
					param: 'release',
					decimals: 2
				},
				useAsInput: false,
			}
		};

		const frequencyEnvelopeParams = {
			'BaseFrequency' : {
				obj: RangeSlider,
				objSettings: {
					title: 'BF',
					defaultVal: 200,
					range: {min: 1, max: 22000},
					param: 'baseFrequency',
					decimals: 0
				},
				useAsInput: false,
			}
		};

		const scaledEnvelopeParams = {
			'Min' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Min',
					defaultVal: 200,
					range: {min: 1, max: 22000},
					param: 'min',
					decimals: 0
				},
				useAsInput: false,
			},
			'Max' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Max',
					defaultVal: 2000,
					range: {min: 1, max: 22000},
					param: 'max',
					decimals: 0
				},
				useAsInput: false,
			}
		};

		this.paramDefaults = {
			ADSR: ADSRParams,
			Frequency: frequencyEnvelopeParams,
			Scaled: scaledEnvelopeParams,
		};

		this.paramVals = {};

		this.params = {};

		const allParams = Object.assign({}, ADSRParams, frequencyEnvelopeParams, scaledEnvelopeParams);
		for (const loopKey in allParams) {
			const key = allParams[loopKey].objSettings.param;
			this.paramVals[key] = allParams[loopKey].objSettings.defaultVal;
		}
	}

	getAudioNode(param) {

		let envObj = Tone.Envelope;

		if (param !== 'gain') {
			this.params = Object.assign({}, this.paramDefaults.ADSR, this.paramDefaults.Scaled);
			envObj = Tone.ScaledEnvelope;
		} else {
			this.params = this.paramDefaults.ADSR;
		}

		const env = new envObj();

		for (const key in this.params) {
			const paramStr = this.params[key].objSettings.param;
			env[paramStr] = this.paramVals[paramStr];
		}

		
		// env.attack = this.params['Attack'].objSettings.val;
		// env.decay = this.params['Decay'].objSettings.val;
		// env.sustain = this.params['Sustain'].objSettings.val;
		// env.release = this.params['Release'].objSettings.val;

		return env;
	}

}