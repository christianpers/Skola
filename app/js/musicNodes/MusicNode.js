import Node from '../views/Nodes/Node';

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

	}

	init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onParameterChange) {
		super.init(parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive);

		this.onParameterChange = onParameterChange;
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