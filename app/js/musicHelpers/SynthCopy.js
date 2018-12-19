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

			if (!this.nodes[connection.in.ID]) {
				this.nodes[connection.in.ID] = connection.in.getAudioNode(this.step);
			}

			if (!this.nodes[connection.out.ID]) {
				const audioNode = connection.out.getAudioNode(this.step);
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

			if (connection.out.isParam) {
			
				// const param = connection.in.getParamConnection();
				const param = connection.param.objSettings.param;
				audioNodeOut.connect(audioNodeIn[param]);
						
			} else {
				audioNodeOut.connect(audioNodeIn);
			}
		}
	}

	onParamChange(nodeID, params) {
		if (this.nodes[nodeID]) {
			this._updateParams(this.nodes[nodeID], params);
		}
	}

	_updateParams(audioNode, params) {
		for (const key in params) {
			if (key === 'frequency' || key === 'amplitude' || key === 'Q') {
				audioNode[key].value = params[key];

			} else {
				audioNode[key] = params[key];
			}
		}
	}

	keyDown() {

		// !!TODO LOOP NODES INSTEAD OF CONNECTIONS!!
		for (let i = 0; i < this.currentConnections.length; i++) {
			const connection = this.currentConnections[i];
			
			const audioNode = this.nodes[connection.out.ID];
			if (connection.out.isOscillator) {
				audioNode.start();
			}
			const params = connection.out.getParams(this.step);
			this._updateParams(audioNode, params);
			
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
			const params = connection.out.getParams(this.step);
			this._updateParams(audioNode, params);
			
		}

		for (let i = 0; i < triggerNodesLength; i++) {
			this.triggerNodes[i].triggerRelease();
		}
	}
}