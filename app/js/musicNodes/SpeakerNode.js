import MusicNode from './MusicNode';
import Tone from 'tone';

export default class SpeakerNode extends MusicNode{
	constructor() {
		super();

		this.audioNode = Tone.context.destination;
		this.isSpeaker = true;
	}

	getAudioNode() {

		return Tone.context.destination;
	}

	setup() {


	}

	enableInput(outputAudioNode) {
		super.enableInput();

		// if (Array.isArray(outputAudioNode)) {
		// 	for (let i = 0; i < outputAudioNode.length; i++) {
		// 		outputAudioNode[i].audioNode.connect(this.audioNode);
		// 	}

		// 	return;
		// }

		// outputAudioNode.audioNode.connect(this.audioNode);
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();
		
		// if (Array.isArray(nodeToDisconnect)) {
		// 	for (let i = 0; i < nodeToDisconnect.length; i++) {
		// 		nodeToDisconnect[i].audioNode.disconnect(this.audioNode);
		// 	}

		// 	return;
		// }

		// nodeToDisconnect.audioNode.disconnect(this.audioNode);
	}
}