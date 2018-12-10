import OscillatorNode from '../musicNodes/OscillatorNode';
import GainNode from '../musicNodes/GainNode';
import SpeakerNode from '../musicNodes/SpeakerNode';
import AnalyserNode from '../musicNodes/AnalyserNode';
import LowpassFilterNode from '../musicNodes/LowpassFilterNode';
import EnvelopeNode from '../musicNodes/EnvelopeNode';

export default class AudioNodeManager{
	constructor() {
		this.keyboardListeners = [];
		
		this.trees = {};

		// const oscNode = new OscillatorNode(document.body, onConnectingCallback, onInputConnectionCallback, 'Oscillator');
		// addCallback(oscNode);

		// const gainNode = new GainNode(document.body, onConnectingCallback, onInputConnectionCallback, 'Gain');
		// addCallback(gainNode);

		// const lowpassFilterNode = new LowpassFilterNode(document.body, onConnectingCallback, onInputConnectionCallback, 'LowpassFilter');
		// addCallback(lowpassFilterNode);

		// for (let i = 0; i < 2; i++) {
		// 	const envelopeNode = new EnvelopeNode(document.body, onConnectingCallback, onInputConnectionCallback, `Envelope - ${i + 1}`);
		// 	addCallback(envelopeNode);
		// }

		// // const analyserNode = new AnalyserNode(document.body, onConnectingCallback, onInputConnectionCallback, 'Analyser');
		// // addCallback(analyserNode);

		// const speakerNode = new SpeakerNode(document.body, onConnectingCallback, onInputConnectionCallback, 'Speaker');
		// addCallback(speakerNode);
	}

	init(parentEl, onConnectingCallback, onInputConnectionCallback, addCallback, initData) {
		if (initData) {
			for (let i = 0; i < initData.length; i++) {
				initData[i].node.init(document.body, onConnectingCallback, onInputConnectionCallback, initData[i].type, initData[i]);
				addCallback(initData[i].node);
			}
		}
	}

	updateOscTrees(nodeConnections) {

		const duplicateSynth = nodeConnections.filter(t => !t.in.isSpeaker);

		console.log(duplicateSynth);

		/*

		has to be synced by running on node connection and node connection delete

		find all oscillators -- check if tree exists on osc ID
			find nodes with connected envelopes -- filter out nodes with > 1 AUDIO input
				loop through reverse and see if connected to osc

		tree example: 




		loop through trees to see if tree osc has been deleted
		*/

		// const oscillators = nodeConnections.filter(t => !!t.out.isOscillator);

		// // CHECK FOR DELETED OSC CONNECTIONS AND UPDATE TREES
		// const tempTrees = {};
		// for (const key in this.trees) {
		// 	const keyExists = oscillators.some(t => t.ID === key);
		// 	if (keyExists) {
		// 		tempTrees[key] = oscillators.find(t => key === t.ID);
		// 	}
		// }

		// this.trees = Object.assign({}, tempTrees);

		// console.log(oscillators);

	}

	addKeyboardListener(node) {
		this.keyboardListeners.push(node);
	}

	removeKeyboardListener(node) {
		const tempKeyboardListeners = this.keyboardListeners.filter(t => t.ID !== node.ID);
		this.keyboardListeners = tempKeyboardListeners;
	} 

	keyDown(step) {
		for (let i = 0; i < this.keyboardListeners.length; i++) {
			this.keyboardListeners[i].keyDown(step);
		}
	}

	keyUp(step) {

		for (let i = 0; i < this.keyboardListeners.length; i++) {
			this.keyboardListeners[i].keyUp(step);
		}
	}
}