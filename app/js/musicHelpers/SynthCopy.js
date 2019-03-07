import Tone from 'tone';

export default class SynthCopy{
	constructor(step) {

		this.nodes = {};
		this.step = step;
		this.currentConnections = [];
		this.oscillatorNodes = [];
		this.synthOscillatorNodes = [];

		this.triggerNodes = [];
	}

	reset(connections) {
		for (let i = 0; i < this.currentConnections.length; i++) {
			const connection = this.currentConnections[i];
			const audioNodeOut = this.nodes[connection.out.ID] ? this.nodes[connection.out.ID].audioNode : undefined;
			let audioNodeIn = this.nodes[connection.in.ID] ? this.nodes[connection.in.ID].audioNode : undefined;
			const musicNodeIn = this.nodes[connection.in.ID] ? this.nodes[connection.in.ID].musicNode : undefined;

			if (!audioNodeOut || !audioNodeIn) {
				continue;
			}

			if (connection.out.isParam) {
			
				// const param = connection.in.getParamConnection();
				// const param = connection.param.objSettings.param;
				// audioNodeOut.connect(audioNodeIn[param]);
						
			} else {
				// audioNodeOut.disconnect(audioNodeIn);
				if (musicNodeIn && musicNodeIn.isAnalyser) {
					continue;
				} else {
					// if (audioNodeIn.dispose) {
					// 	audioNodeIn.dispose();
					// } else {
					audioNodeIn.disconnect();
					// }
				}
			}
		}

		this.nodes = {};
		this.oscillatorNodes = [];
		this.currentConnections = connections;
		this.triggerNodes = [];
		this.synthOscillatorNodes = [];
	}

	updateConnections(connections) {

		// debugger;
		console.log('updateConnections');

		// DISCONNECT
		this.reset(connections);

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

				if (connection.out.isSynthOscillator) {
					this.synthOscillatorNodes.push(obj);
				}
			}
		}

		for (let i = 0; i < connections.length; i++) {
			const connection = connections[i];
			const audioNodeOut = this.nodes[connection.out.ID] ? this.nodes[connection.out.ID].audioNode : undefined;
			let audioNodeIn = this.nodes[connection.in.ID] ? this.nodes[connection.in.ID].audioNode : undefined;
			const musicNodeOut = this.nodes[connection.out.ID] ? this.nodes[connection.out.ID].musicNode : undefined;
			const musicNodeIn = this.nodes[connection.in.ID] ? this.nodes[connection.in.ID].musicNode : undefined;

			if (connection.out.isSequencer && !audioNodeOut) {
				continue;
			}

			if (connection.out.isParam) {
			
				const param = connection.param.param;
				audioNodeOut.connect(audioNodeIn[param]);
						
			} else {

				// console.log(musicNodeOut, musicNodeIn);
				
				audioNodeOut.connect(audioNodeIn);

				
			}
		}
	}

	onParamChange(node) {
		if (this.nodes[node.ID]) {
			if (node.isOscillator) {
				this._updateOscillatorParams(this.nodes[node.ID].audioNode, node);
			} else if (node.isSynthOscillator) {

			} else {
				this._updateParams(this.nodes[node.ID].audioNode, node);
			}
		}
	}

	_updateSynthOscillatorParams(audioNode, node) {
		for (let i = 0; i < node.synthParams.length; i++) {
			const param = node.params[node.synthParams[i]];
			if (param.setParam) {
				param.setParam(audioNode, param.value);
			} else {
				audioNode[node.synthParams[i]].value = param.value;
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

	play(time, sequencerID) {

		const triggerNodesLength = this.triggerNodes.length;
		const oscNodesLength = this.oscillatorNodes.length;
		const synthOscLength = this.synthOscillatorNodes.length;

		for (const key in this.nodes) {
			const obj = this.nodes[key];
			if (obj.musicNode.isOscillator) {
				this._updateOscillatorParams(obj.audioNode, obj.musicNode);
			} else if (obj.musicNode.isSynthOscillator) {
				this._updateSynthOscillatorParams(obj.audioNode, obj.musicNode);
			} else {
				this._updateParams(obj.audioNode, obj.musicNode);
			}
		}

		for (let i = 0; i < triggerNodesLength; i++) {
			this.triggerNodes[i].triggerAttackRelease(Tone.Time("8n"), time);
		}




		for (let i = 0; i < oscNodesLength; i++) {
			const obj = this.oscillatorNodes[i];
			if (obj.musicNode.isOscillator && obj.musicNode.hasConnectedTrigger && obj.musicNode.connectedTriggerID === sequencerID) {
				if (obj.musicNode.hasEnvelopeConnection) {
					obj.audioNode.start(time).stop(time + Tone.Time(2));
				} else {
					obj.audioNode.start(time).stop(time + Tone.Time("8n"));
				}
				
			} else if (obj.musicNode.isLFO) {
				obj.audioNode.phase = 0;
				obj.audioNode.start(time);
			}
		}

		for (let i = 0; i < synthOscLength; i++) {
			const obj = this.synthOscillatorNodes[i];
			if (obj.musicNode.connectedTriggerID === sequencerID) {
				const freq = obj.musicNode.getFrequency(this.step);
				obj.audioNode.triggerAttackRelease(freq, "8n");
			}	
		}
	}

	keyDown() {

		const triggerNodesLength = this.triggerNodes.length;
		const oscNodesLength = this.oscillatorNodes.length;
		const synthOscLength = this.synthOscillatorNodes.length;

		for (const key in this.nodes) {
			const obj = this.nodes[key];
			if (obj.musicNode.isOscillator) {
				this._updateOscillatorParams(obj.audioNode, obj.musicNode);
			} else if (obj.musicNode.isSynthOscillator) {
				this._updateSynthOscillatorParams(obj.audioNode, obj.musicNode);
			} else {
				this._updateParams(obj.audioNode, obj.musicNode);
			}
		}

		for (let i = 0; i < oscNodesLength; i++) {
			const obj = this.oscillatorNodes[i];
			if (obj.musicNode.isOscillator) {
				obj.audioNode.start();
			} else if (obj.musicNode.isLFO) {
				obj.audioNode.phase = 0;
				obj.audioNode.start();
			}
		}


		for (let i = 0; i < triggerNodesLength; i++) {
			this.triggerNodes[i].triggerAttack();
		}

		for (let i = 0; i < synthOscLength; i++) {
			const obj = this.synthOscillatorNodes[i];
			const freq = obj.musicNode.getFrequency(this.step);
			obj.audioNode.triggerAttack(freq);
		}

	}

	keyUp() {

		const triggerNodesLength = this.triggerNodes.length;
		const oscNodesLength = this.oscillatorNodes.length;
		const synthOscLength = this.synthOscillatorNodes.length;

		for (let i = 0; i < oscNodesLength; i++) {
			const obj = this.oscillatorNodes[i];
			if (obj.musicNode.isOscillator) {
				if (!obj.musicNode.hasEnvelopeConnection) {
					obj.audioNode.stop();
				}
				
			} else if (obj.musicNode.isLFO) {
				// if (triggerNodesLength === 0) {
				// obj.audioNode.stop();
				// }
			}
		}

		for (let i = 0; i < triggerNodesLength; i++) {
			this.triggerNodes[i].triggerRelease();
		}

		for (let i = 0; i < synthOscLength; i++) {
			const obj = this.synthOscillatorNodes[i];
			const freq = obj.musicNode.getFrequency(this.step);
			obj.audioNode.triggerRelease();
		}

	}
}