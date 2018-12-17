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

	init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onParameterChange) {
		super.init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive);

		this.onParameterChange = onParameterChange;

		for (const key in this.params) {
			if (this.params[key].useAsInput) {
				const param = new NodeParam(this.topPartEl, this.params[key], this.onInputClickBound);
				this.inputParams[this.params[key].objSettings.param] = param;
			}
		}
	}

	enableParam(param) {
		console.log('enable param', param);

		const paramComponent = this.inputParams[param.objSettings.param];
		paramComponent.enable();
	}

	disableParam(param) {
		const paramComponent = this.inputParams[param.objSettings.param];
		paramComponent.disable();
	}

	onParameterUpdate() {
		const params = this.getParams();

		this.onParameterChange(this.ID, params);
	}

	getParams(step) {

		const params = {};
		for (const key in this.params) {
			const obj = this.params[key];
			params[obj.objSettings.param] = obj.objSettings.val;
		}
		
		return params;
	}

	setParamVal(val, key) {
		this.params[key].objSettings.val = val;
	}

	setup() {

		
	}


	// enableInput(outputAudioNode) {
	// 	super.enableInput();
	// 	// outputAudioNode.connect(this.audioNode);
	// }

	// disableInput(nodeToDisconnect) {
	// 	super.disableInput();
	// 	// nodeToDisconnect.disconnect(this.audioNode);
	// }

	main() {



	}
}