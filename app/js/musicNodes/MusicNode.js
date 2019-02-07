import Node from '../views/Nodes/Node';
import NodeParam from '../views/Nodes/NodeComponents/NodeParam';
import AudioInputHelpers from '../musicHelpers/AudioInputHelpers';

export default class MusicNode extends Node{
	constructor() {
		super();

		this.audioNode = null;
		this.isParam = false;
		this.isKeyboardListener = false;
		this.isOscillator = false;
		this.isEnvelope = false;
		this.isSpeaker = false;
		this.isSignalMath = false;
		this.hasAudioInput = true;
		this.isSequencer = false;

		this.inputHelpersType = AudioInputHelpers.single;

		this.params = {};

		this.canBeConnected = false;

		this.el = document.createElement('div');
		this.el.className = 'node';

		this.topPartEl = document.createElement('div');
		this.topPartEl.className = 'top-part';

		this.el.appendChild(this.topPartEl);

		this.bottomPartEl = document.createElement('div');
		this.bottomPartEl.className = 'bottom-part';

		this.el.appendChild(this.bottomPartEl);

		this.inputParams = {};
	}

	init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onParameterChange, onSequencerTrigger, onNodeRemove) {
		super.init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onNodeRemove);

		this.onParameterChange = onParameterChange;
		this.onSequencerTrigger = onSequencerTrigger;

		this.connectedInputs = [];

		for (const key in this.params) {
			if (this.params[key].useAsInput) {
				const param = new NodeParam(this.topPartEl, this.params[key], this.onInputClickBound);
				this.inputParams[this.params[key].title] = param;
			}
		}

		if (this.isSequencer) {
			this.el.classList.add('sequencer');
			this.createUI();
			this.setup();
		}

		this.activateDrag();
	}

	enableParam(param) {
		const paramComponent = this.inputParams[param.title];
		param.isConnected = true;
		paramComponent.enable();

		if (param.slider) {
			param.slider.disableSlider();
		}

	}

	disableParam(param) {
		const paramComponent = this.inputParams[param.title];
		param.isConnected = false;
		paramComponent.disable();

		if (param.slider) {
			param.slider.enableSlider();
		}
	}

	onParameterUpdate() {
		const params = this.getParams();

		this.onParameterChange(this, params);
	}

	getParams() {

		const params = {};
		for (const key in this.params) {
			const obj = this.params[key];
			params[obj.param] = this.params[obj.param].value;
		}
		
		return params;
	}

	enableInput(outNode) {
		super.enableInput();

		this.connectedInputs.push(outNode.ID);
	}

	disableInput(outNode) {

		const tempConnectedInputs = this.connectedInputs.filter(t => t !== outNode.ID);
		this.connectedInputs = tempConnectedInputs;

		if (this.connectedInputs.length === 0) {
			super.disableInput();
		}
		
	}

}