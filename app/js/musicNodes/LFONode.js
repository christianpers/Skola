import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class LFONode extends MusicNode{
	constructor() {
		super();

		this.isParam = true;

		this.audioNode = new Tone.LFO();

		this.paramVals = {};

		this.params = {
			'Frequency' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Frequency',
					defaultVal: 6.0,
					range: {min: 0.1, max: 17.0},
					param: 'frequency',
					decimals: 2
				},
				useAsInput: false,
			},
			'Amplitude' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Amplitude',
					defaultVal: 0.5,
					range: {min: 0, max: 1},
					param: 'amplitude',
					decimals: 2
				},
				useAsInput: false,
			},
		};

		for (const loopKey in this.params) {
			const key = this.params[loopKey].objSettings.param;
			this.paramVals[key] = this.params[loopKey].objSettings.defaultVal;
		}
	}

	getAudioNode() {

		const lfo = new Tone.LFO();
		lfo.min = -22000;
		lfo.max = 22000;
		lfo.start();

		return lfo;
	}

}