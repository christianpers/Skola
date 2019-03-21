import MusicNode from './MusicNode';
import Tone from 'tone';
import RangeSlider from '../views/Nodes/NodeComponents/RangeSlider';
import AudioInputHelpers from '../musicHelpers/AudioInputHelpers';
import WaveTypeSelector from '../views/Nodes/NodeComponents/WaveTypeSelector';

export default class OscillatorNode extends MusicNode{
	constructor() {
		super();

		this.el.classList.add('no-height');

		this.hasConnectedTrigger = false;
		this.connectedTriggerID = -1;

		this.synthParams = [];

		OscillatorNode.BASE_FREQ = 440;
		OscillatorNode.ROOT = Math.pow(2,(1/12));

		this.isKeyboardListener = true;
		this.isSynthOscillator = true;
		this.hasAudioInput = false;
		this.hasEnvelopeConnection = false;

		const rangeContainer = document.createElement('div');
		rangeContainer.className = 'range-container';

		const waveTypeContainer = document.createElement('div');
		waveTypeContainer.className = 'wave-type-container';

		this.topPartEl.appendChild(waveTypeContainer);

		this.onWaveChangeCallbackBound = this.onWaveChangeCallback.bind(this);

		this.waveTypeSelector = new WaveTypeSelector(waveTypeContainer, this.onWaveChangeCallbackBound, 'sine', 'oscillator-type', 'Oscillator vågtyp');
		// this.modulatorWaveTypeSelector = new WaveTypeSelector(waveTypeContainer, this.onWaveChangeCallbackBound, 'sine', 'modulator-type', 'Modulator vågtyp');

		this.topPartEl.appendChild(rangeContainer);

		this.onRangeChangeCallbackBound = this.onRangeChangeCallback.bind(this);

		const octaveRangeConfig = {
			parentEl: rangeContainer,
			title: 'Oktav',
			initValue: 0,
			settings: {min: -4, max: 4},
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

		// const modulationIndexRangeConfig = {
		// 	parentEl: rangeContainer,
		// 	title: 'ModulationIndex',
		// 	initValue: 10,
		// 	settings: {min: 1, max: 40},
		// 	valChangeCallback: this.onRangeChangeCallbackBound,
		// 	param: 'modulationIndex',
		// 	decimals: 0,
		// 	disable: false,
		// };

		// this.modulationIndexRangeSlider = new RangeSlider(
		// 	modulationIndexRangeConfig.parentEl,
		// 	modulationIndexRangeConfig.title,
		// 	modulationIndexRangeConfig.initValue,
		// 	modulationIndexRangeConfig.settings,
		// 	modulationIndexRangeConfig.valChangeCallback,
		// 	modulationIndexRangeConfig.param,
		// 	modulationIndexRangeConfig.decimals,
		// 	modulationIndexRangeConfig.disable,
		// );

		// const modulationIndexParam = {
		// 	useAsInput: false,
		// 	value: modulationIndexRangeConfig.initValue,
		// 	param: 'modulationIndex',
		// 	slider: this.modulationIndexRangeSlider,
		// 	title: 'Modulation',
		// };

		const oscillatorTypeParam = {
			useAsInput: false,
			value: 'sine',
			param: 'oscillator-type',
			title: 'oscillator type',
			setParam: (audioNode, value) => {
				audioNode.oscillator.type = value;
			}
		}

		// const modulatorTypeParam = {
		// 	useAsInput: false,
		// 	value: 'sine',
		// 	param: 'modulator-type',
		// 	title: 'modulator type',
		// 	setParam: (audioNode, value) => {
		// 		audioNode.modulation.type = value;
		// 	}
		// }

		const triggerParam = {
			useAsInput: true,
			param: 'trigger',
			title: 'Trigger',
			helper: AudioInputHelpers.oscillatorTrigger,
		};

		this.params[octaveParam.param] = octaveParam;
		this.params[triggerParam.param] = triggerParam;
		// this.params[modulationIndexParam.param] = modulationIndexParam;
		this.params[oscillatorTypeParam.param] = oscillatorTypeParam;
		// this.params[modulatorTypeParam.param] = modulatorTypeParam;

		// this.synthParams.push(modulationIndexParam.param);
		this.synthParams.push(oscillatorTypeParam.param);
		// this.synthParams.push(modulatorTypeParam.param);

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

	onWaveChangeCallback(wave, param) {
		this.params[param].value = wave;
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

		const oscAudioNode = new Tone.FMSynth();

		// oscAudioNode.oscillator.type = this.synthParams

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