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