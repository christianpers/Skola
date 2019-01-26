import Node from '../views/Nodes/Node';
import NodeParam from '../views/Nodes/NodeComponents/NodeParam';

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

	init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onParameterChange, onSequencerTrigger) {
		super.init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive);

		this.onParameterChange = onParameterChange;
		this.onSequencerTrigger = onSequencerTrigger;

		for (const key in this.params) {
			if (this.params[key].useAsInput) {
				const param = new NodeParam(this.topPartEl, this.params[key], this.onInputClickBound);
				this.inputParams[this.params[key].objSettings.param] = param;
			}
		}

		if (this.isSequencer) {
			this.el.classList.add('sequencer');
			this.createUI();
			this.setup();
		}

		this.activateDrag();
	}

	getDotPos(el) {
		
		return el.getBoundingClientRect();
	}

	enableParam(param) {
		console.log('enable param', param);

		const paramComponent = this.inputParams[param.objSettings.param];
		param.isConnected = true;
		paramComponent.enable();

	}

	disableParam(param) {
		const paramComponent = this.inputParams[param.objSettings.param];
		param.isConnected = false;
		paramComponent.disable();
	}

	onParameterUpdate() {
		const params = this.getParams();

		this.onParameterChange(this, params);
	}

	getParams() {

		const params = {};
		for (const key in this.params) {
			const obj = this.params[key];
			params[obj.objSettings.param] = this.paramVals[obj.objSettings.param];
		}

		// console.log(params);
		
		return params;
	}

	setParamVal(val, key) {
		this.paramVals[key] = val;
	}

	main() {



	}
}