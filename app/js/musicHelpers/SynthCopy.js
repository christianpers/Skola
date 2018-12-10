export default class SynthCopy{
	constructor(step) {

		this.nodes = {};
		this.step = step;
		this.currentConnections = [];

		this.triggerNodes = [];
	}

	updateConnections(connections) {

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
			
				const param = connection.in.getParamConnection();
				audioNodeOut.connect(audioNodeIn[param]);
						
			} else {
				audioNodeOut.connect(audioNodeIn);
			}
		}
	}

	keyDown() {

		// !!TODO LOOP NODES INSTEAD OF CONNECTIONS!!
		for (let i = 0; i < this.currentConnections.length; i++) {
			const connection = this.currentConnections[i];
			
			const audioNode = this.nodes[connection.out.ID];
			const params = connection.out.getParams(this.step);
			for (const key in params) {
				if (key === 'frequency' || key === 'amplitude') {
					audioNode[key].value = params[key];

				} else {
					audioNode[key] = params[key];
				}
			}
		}

		for (let i = 0; i < this.triggerNodes.length; i++) {
			this.triggerNodes[i].triggerAttack();
		}
	}

	keyUp() {

		for (let i = 0; i < this.triggerNodes.length; i++) {
			this.triggerNodes[i].triggerRelease();
		}
	}
}