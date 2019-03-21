import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';

export default class CompressorNode extends MusicNode{
	constructor() {
		super();

		this.audioNode = new Tone.Compressor();

		// this.audioNode.start();

		this.paramVals = {};

		this.params = {
			'Threshold' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Threshold',
					defaultVal: -24,
					range: {min: -48, max: 48},
					param: 'threshold',
					decimals: 0
				},
				useAsInput: false,
			},
			'Ratio' : {
				obj: RangeSlider,
				objSettings: {
					title: 'Ratio',
					defaultVal: 12,
					range: {min: 0, max: 40},
					param: 'range',
					decimals: 0
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

		const audioNode = new Tone.Compressor();
		return audioNode;
	}

	main() {



	}
}