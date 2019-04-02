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
		this.isLFO = false;
		this.isAnalyser = false;
		this.isSynthOscillator = false;

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

	init(pos, parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onParameterChange, onNodeRemove) {
		super.init(pos, parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onNodeRemove);

		this.onParameterChange = onParameterChange;

		this.connectedInputs = [];
		this.connectedOutputs = [];

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

		this.postInit();

	}

	enableParam(param) {
		const paramComponent = this.inputParams[param.title];
		param.isConnected = true;
		paramComponent.enable();

		if (param.slider && param.disableSliderOnConnection) {
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

	enableOutput(param, connectionData) {
		super.enableOutput();


		this.connectedOutputs.push(connectionData.in.ID);
	}

	disableOutput(inNode, param) {
		const tempConnectedOutputs = this.connectedOutputs.filter(t => t !== inNode.ID);
		this.connectedOutputs = tempConnectedOutputs;

		if (this.connectedOutputs.length === 0) {
			super.disableOutput();
		}
	}

	enableInput(outNode) {
		super.enableInput();

		this.connectedInputs.push(`${outNode.ID}-${this.ID}`);
	}

	disableInput(outNode) {

		const idToRemove = `${outNode.ID}-${this.ID}`;

		const tempConnectedInputs = this.connectedInputs.filter(t => t !== idToRemove);
		this.connectedInputs = tempConnectedInputs;

		if (this.connectedInputs.length === 0) {
			super.disableInput();
		}
		
	}

}