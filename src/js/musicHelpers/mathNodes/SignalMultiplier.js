import MusicNode from '../../musicNodes/MusicNode';
import Tone from 'tone';

export default class SignalMultiplier extends MusicNode{
	constructor() {
		super();

		this.isParam = true;
		this.isSignalMath = true;
		this.audioNode = new Tone.Add(10);
		// this.audioNode.convert = false;
		this.connections = 0;

		this.el.classList.add('signal-math-node');

		setInterval(() => {
			console.log('multiplier val: ', this.audioNode.value);
			// console.log(this.audioNode);
		}, 1000);

	}

	getParams(step) {
		const params = {};
		
		return params;
	}

	getAudioNode() {

		const signal = new Tone.Multiply();

		return signal;
	}

	enableInput(outputAudioNode) {
		super.enableInput();

		// debugger;

		// const signal = new Tone.Signal();
		// outputAudioNode.audioNode.connect(signal);
		// // signal.connect();
		// outputAudioNode.audioNode.fre.connect(this.audioNode, 0, this.connections);
		console.log('connected');

		this.connections++;
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();
		nodeToDisconnect.audioNode.disconnect(this.audioNode);

		this.connections--;
	}
}