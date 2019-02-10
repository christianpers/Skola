import Tone from 'tone';

export default class SynthCopy{
	constructor(step) {

		this.nodes = {};
		this.step = step;
		this.currentConnections = [];
		this.oscillatorNodes = [];

		this.triggerNodes = [];
	}

	updateConnections(connections) {

		// debugger;

		// DISCONNECT
		for (let i = 0; i < this.currentConnections.length; i++) {
			const connection = this.currentConnections[i];
			const audioNodeOut = this.nodes[connection.out.ID] ? this.nodes[connection.out.ID].audioNode : undefined;
			let audioNodeIn = this.nodes[connection.in.ID] ? this.nodes[connection.in.ID].audioNode : undefined;

			if (!audioNodeOut || !audioNodeIn) {
				continue;
			}

			if (connection.out.isParam) {
			
				// const param = connection.in.getParamConnection();
				// const param = connection.param.objSettings.param;
				// audioNodeOut.connect(audioNodeIn[param]);
						
			} else {
				// audioNodeOut.disconnect(audioNodeIn);
				if (audioNodeIn.dispose) {
					console.log('dispose');
					audioNodeIn.dispose();
				} else {
					audioNodeIn.disconnect();
				}
				console.log('disconnect');
			}
		}


		// for (const key in this.nodes) {
		// 	const audioNode = this.nodes[key].audioNode;
		// 	const musicNode = this.nodes[key].musicNode;

		// 	if (!audioNode) {
		// 		continue;
		// 	}

		// 	if (musicNode.isParam) {
		// 		continue;
		// 	}

		// 	if (audioNode.dispose) {
		// 		audioNode.dispose();
		// 	} else {
		// 		audioNode.disconnect();
		// 	}
		// }
		// debugger;

		this.nodes = {};
		this.oscillatorNodes = [];
		this.currentConnections = connections;
		this.triggerNodes = [];

		for (let i = 0; i < connections.length; i++) {
			const connection = connections[i];

			if (connection.out.isSequencer) {
				continue;
			}

			if (!this.nodes[connection.in.ID]) {
				const obj = {
					audioNode: connection.in.getAudioNode(),
					musicNode: connection.in,
				};
				this.nodes[connection.in.ID] = obj;
			}

			if (!this.nodes[connection.out.ID]) {
				const audioNode = connection.out.getAudioNode(connection.param ? connection.param.param : undefined);
				const obj = {
					audioNode: audioNode,
					musicNode: connection.out,
				};
				this.nodes[connection.out.ID] = obj;
				if (connection.out.isEnvelope) {
					this.triggerNodes.push(audioNode);
				}

				if (connection.out.isOscillator || connection.out.isLFO) {
					this.oscillatorNodes.push(obj);
				}
			}
		}

		for (let i = 0; i < connections.length; i++) {
			const connection = connections[i];
			const audioNodeOut = this.nodes[connection.out.ID] ? this.nodes[connection.out.ID].audioNode : undefined;
			let audioNodeIn = this.nodes[connection.in.ID] ? this.nodes[connection.in.ID].audioNode : undefined;

			if (connection.out.isSequencer) {
				continue;
			}

			if (connection.out.isParam) {
			
				const param = connection.param.param;
				audioNodeOut.connect(audioNodeIn[param]);
						
			} else {
				audioNodeOut.connect(audioNodeIn);
			}
		}
	}

	onParamChange(node) {
		if (this.nodes[node.ID]) {
			if (node.isOscillator) {
				this._updateOscillatorParams(this.nodes[node.ID].audioNode, node);
			} else {
				this._updateParams(this.nodes[node.ID].audioNode, node);
			}
		}
	}

	_updateOscillatorParams(audioNode, node) {
		audioNode['frequency'].value = node.getFrequency(this.step);
		// audioNode['type'] = params.type;
	}

	_updateParams(audioNode, node) {
		const nodeParamIsConnected = (node, param) => {

			for (const key in node.params) {
				if (node.params[key].param === param) {
					return node.params[key].isConnected;
				}
			}
		};

		// console.log('_updateparams', audioNode.param)

		for (const key in node.params) {
			if (key === 'gain') {
				if (nodeParamIsConnected(node, key)) {
					continue;
				}
			}
			
			if (key === 'frequency' || key === 'amplitude' || key === 'Q' || key === 'gain' || key === 'threshold' || key === 'ratio') {
				audioNode[key].value = node.params[key].value;

			} else {
				audioNode[key] = node.params[key].value;
			}
		}
	}

	/*

	GENERAL UPDATES
	COLLECT OSC AND LFO TO OWN ARRAY


	CHECK IN UPDATE LOOP IF CONNECTED TO SEQUENCER


	*/

	// FROM SEQUENCER
	play(time) {

		const triggerNodesLength = this.triggerNodes.length;
		const oscNodesLength = triggerNodesLength === 0 ? this.oscillatorNodes.length : 0;

		for (const key in this.nodes) {
			const obj = this.nodes[key];
			if (obj.musicNode.isOscillator) {
				this._updateOscillatorParams(obj.audioNode, obj.musicNode);
			} else {
				this._updateParams(obj.audioNode, obj.musicNode);
			}
		}


		for (let i = 0; i < oscNodesLength; i++) {
			const obj = this.oscillatorNodes[i];
			if (obj.musicNode.isOscillator && obj.musicNode.hasConnectedTrigger) {
				obj.audioNode.start(time).stop("+16n");
			} else if (obj.musicNode.isLFO) {
				obj.audioNode.start(time).stop(time + .5);
			}
		}


		for (let i = 0; i < triggerNodesLength; i++) {
			this.triggerNodes[i].triggerAttackRelease("4n", time);
		}

		// for (let i = 0; i < oscNodesLength; i++) {
		// 	const obj = this.oscillatorNodes[i];
		// 	if (obj.musicNode.isOscillator) {
		// 		obj.audioNode.stop(2.0);
		// 	} else if (obj.musicNode.isLFO) {
		// 		obj.audioNode.stop(2.0);
		// 	}
		// }

	}

	keyDown() {

		const triggerNodesLength = this.triggerNodes.length;
		const oscNodesLength = triggerNodesLength === 0 ? this.oscillatorNodes.length : 0;

		for (const key in this.nodes) {
			const obj = this.nodes[key];
			if (obj.musicNode.isOscillator) {
				this._updateOscillatorParams(obj.audioNode, obj.musicNode);
			} else {
				this._updateParams(obj.audioNode, obj.musicNode);
			}
		}


		for (let i = 0; i < oscNodesLength; i++) {
			const obj = this.oscillatorNodes[i];
			if (obj.musicNode.isOscillator) {
				obj.audioNode.start();
			} else if (obj.musicNode.isLFO) {
				obj.audioNode.start();
			}
		}


		for (let i = 0; i < triggerNodesLength; i++) {
			this.triggerNodes[i].triggerAttack();
		}

	}

	keyUp() {

		const triggerNodesLength = this.triggerNodes.length;
		const oscNodesLength = triggerNodesLength === 0 ? this.oscillatorNodes.length : 0;

		for (let i = 0; i < oscNodesLength; i++) {
			const obj = this.oscillatorNodes[i];
			if (obj.musicNode.isOscillator) {
				obj.audioNode.stop();
			} else if (obj.musicNode.isLFO) {
				obj.audioNode.stop();
			}
		}


		for (let i = 0; i < triggerNodesLength; i++) {
			this.triggerNodes[i].triggerRelease();
		}

	}
}