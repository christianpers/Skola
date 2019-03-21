import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import AudioInputHelpers from '../musicHelpers/AudioInputHelpers';

export default class OscillatorNode extends MusicNode{
	constructor() {
		super();

		this.el.classList.add('no-height');

		this.hasConnectedTrigger = false;
		this.connectedTriggerID = -1;
		this.synthParams = [];

		// OscillatorNode.BASE_OCTAVE = 4;
		OscillatorNode.BASE_FREQ = 440;
		OscillatorNode.ROOT = Math.pow(2,(1/12));

		this.isKeyboardListener = true;
		this.isSynthOscillator = true;
		this.hasAudioInput = false;
		this.hasEnvelopeConnection = false;

		const rangeContainer = document.createElement('div');
		rangeContainer.className = 'range-container';

		this.topPartEl.appendChild(rangeContainer);

		this.onRangeChangeCallbackBound = this.onRangeChangeCallback.bind(this);

		const octaveRangeConfig = {
			parentEl: rangeContainer,
			title: 'Oktav',
			initValue: -2,
			settings: {min: -4, max: 0},
			valChangeCallback: this.onRangeChangeCallbackBound,
			param: 'octave',
			decimals: 0,
			disable: false,
		};

		this.octaveRangeSlider = new RangeSlider(
			octaveRangeConfig.parentEl,
			octaveRangeConfig.title,
			octaveRangeConfig.initValue,
			octaveRangeConfig.settings,
			octaveRangeConfig.valChangeCallback,
			octaveRangeConfig.param,
			octaveRangeConfig.decimals,
			octaveRangeConfig.disable,
		);

		const octaveParam = {
			useAsInput: false,
			value: octaveRangeConfig.initValue,
			param: 'octave',
			slider: this.octaveRangeSlider,
			title: 'Octave',
		};

		const triggerParam = {
			useAsInput: true,
			param: 'trigger',
			title: 'Trigger',
			helper: AudioInputHelpers.oscillatorTrigger,
		};

		this.params[octaveParam.param] = octaveParam;
		this.params[triggerParam.param] = triggerParam;

		this.paramVals = {};
	}

	enableParam(param, connectionData) {
		super.enableParam(param);

		if (param.param === 'trigger') {
			this.hasConnectedTrigger = true;
			this.connectedTriggerID = connectionData.out.ID;
		}

	}

	disableParam(param) {
		super.disableParam(param);

		if (param.param === 'trigger') {
			this.hasConnectedTrigger = false;
			this.connectedTriggerID = -1;
		}
	}

	onRangeChangeCallback(value, param) {
		this.params[param].value = value;
		this.onParameterChange(this);
	}

	getParams(step) {
		if (!step) {
			step = 0;
		}
		
		const params = {};
		// params.frequency = this.getFrequency(step);
		// params.type = "sawtooth";

		return params;
	}

	getAudioNode() {

		const oscAudioNode = new Tone.MembraneSynth();

		// oscAudioNode.type = "sawtooth";

		return oscAudioNode;
	}

	getFrequency(step) {

		// const octaveOffset = parseInt(this.params['Octave'].objSettings.val);
		const octaveOffset = parseInt(this.params['octave'].value);
		// console.log(octaveOffset);

		const tempOctave = octaveOffset;
		const tempSteps = 12 * tempOctave + step;
		
		const freq = OscillatorNode.BASE_FREQ * Math.pow(OscillatorNode.ROOT, tempSteps);

		return freq;
	}


}