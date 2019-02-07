export default class SynthCopy{
	constructor(step) {

		this.nodes = {};
		this.step = step;
		this.currentConnections = [];

		this.triggerNodes = [];
	}

	updateConnections(connections) {

		// debugger;

		// DISCONNECT
		for (let i = 0; i < connections.length; i++) {
			const connection = connections[i];
			const audioNodeOut = this.nodes[connection.out.ID];
			let audioNodeIn = this.nodes[connection.in.ID];

			if (!audioNodeOut || !audioNodeIn) {
				continue;
			}

			if (connection.out.isParam) {
			
				// const param = connection.in.getParamConnection();
				// const param = connection.param.objSettings.param;
				// audioNodeOut.connect(audioNodeIn[param]);
						
			} else {
				// audioNodeOut.disconnect(audioNodeIn);
				audioNodeIn.disconnect();
			}
		}

		// debugger;

		this.nodes = {};
		this.currentConnections = connections;
		this.triggerNodes = [];

		for (let i = 0; i < connections.length; i++) {
			const connection = connections[i];

			if (connection.out.isSequencer) {
				continue;
			}

			if (!this.nodes[connection.in.ID]) {
				this.nodes[connection.in.ID] = connection.in.getAudioNode();
			}

			if (!this.nodes[connection.out.ID]) {
				const audioNode = connection.out.getAudioNode(connection.param ? connection.param.param : undefined);
				this.nodes[connection.out.ID] = audioNode;
				if (connection.out.isEnvelope) {
					this.triggerNodes.push(audioNode);
				}
			}
		}

		for (let i = 0; i < connections.length; i++) {
			const connection = connections[i];
			const audioNodeOut = this.nodes[connection.out.ID];
			let audioNodeIn = this.nodes[connection.in.ID];

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

	onParamChange(node, params) {

		if (this.nodes[node.ID]) {
			if (node.isOscillator) {
				this._updateOscillatorParams(this.nodes[node.ID], params, node);
			} else {
				const nodeParam = node.params
				this._updateParams(this.nodes[node.ID], params, node);
			}
		}
	}

	_updateOscillatorParams(audioNode, params, node) {
		audioNode['frequency'].value = node.getFrequency(this.step);
		// audioNode['type'] = params.type;
	}

	_updateParams(audioNode, params, node) {
		const nodeParamIsConnected = (node, param) => {

			for (const key in node.params) {
				if (node.params[key].param === param) {
					return node.params[key].isConnected;
				}
			}
		};

		for (const key in audioNode.params) {
			if (key === 'gain') {
				if (nodeParamIsConnected(node, key)) {
					continue;
				}
			}
			
			if (key === 'frequency' || key === 'amplitude' || key === 'Q' || key === 'gain' || key === 'threshold' || key === 'ratio') {
				audioNode[key].value = params[key].value;

			} else {
				audioNode[key] = params[key].value;
			}
		}
	}

	play(time) {

		const triggerNodesLength = this.triggerNodes.length;

		// !!TODO LOOP NODES INSTEAD OF CONNECTIONS!!
		for (let i = 0; i < this.currentConnections.length; i++) {
			const connection = this.currentConnections[i];

			if (connection.out.isSequencer) {
				continue;
			}

			const audioNode = this.nodes[connection.out.ID];

			const params = connection.out.getParams(this.step);
			
			if (connection.out.isOscillator && connection.out.hasConnectedTrigger) {
				this._updateOscillatorParams(audioNode, params, connection.out);
				audioNode.start(time);
		
			} else {
				this._updateParams(audioNode, params, connection.out);
			}
			
			
			
		}

		for (let i = 0; i < this.triggerNodes.length; i++) {
			this.triggerNodes[i].triggerAttackRelease("16n", time);
		}

		

		for (let i = 0; i < this.currentConnections.length; i++) {
			const connection = this.currentConnections[i];
			
			const audioNode = this.nodes[connection.out.ID];
			if (connection.out.isOscillator && triggerNodesLength === 0) {
				audioNode.stop("32n");
			
			}
			// const params = connection.out.getParams(this.step);
			// this._updateParams(audioNode, params, connection.out);
			
		}
	}

	keyDown() {

		// !!TODO LOOP NODES INSTEAD OF CONNECTIONS!!
		for (let i = 0; i < this.currentConnections.length; i++) {
			const connection = this.currentConnections[i];

			const audioNode = this.nodes[connection.out.ID];
			const params = connection.out.getParams(this.step);

			if (connection.out.isOscillator) {
				this._updateOscillatorParams(audioNode, params, connection.out);
				audioNode.start();
		
			} else {
				this._updateParams(audioNode, params, connection.out);
			}
			
			
		}

		for (let i = 0; i < this.triggerNodes.length; i++) {
			this.triggerNodes[i].triggerAttack();
		}
	}

	keyUp() {

		const triggerNodesLength = this.triggerNodes.length;

		for (let i = 0; i < this.currentConnections.length; i++) {
			const connection = this.currentConnections[i];
			
			const audioNode = this.nodes[connection.out.ID];
			if (connection.out.isOscillator && triggerNodesLength === 0) {
				audioNode.stop();
			}
			// const params = connection.out.getParams(this.step);
			// this._updateParams(audioNode, params, connection.out);
			
		}

		for (let i = 0; i < triggerNodesLength; i++) {
			this.triggerNodes[i].triggerRelease();
		}
	}
}