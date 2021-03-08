import GraphicNode from '../GraphicNode';
import InputComponent from '../../views/Nodes/NodeComponents/InputComponent';

/* 

THIS NODE ISNT USED BUT IT MIGHT BE GOOD TO KEEP HERE FOR FUTURE NEEDS !!

*/

export default class ParticleRotationModifierNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;

		this.isParam = true;
		this.returnsSingleNumber = true;
		this.title = 'Particle Rotation modifier';

		this.onInputChangeBound = this.onInputChange.bind(this);
        this.value = (this.initValues && this.initValues.particleRotation) ? this.initValues.particleRotation : 0;
		this.getSettings();
	}

	updateVisualSettings(val) {
		this.syncVisualSettings({
			particleRotation: val,
		});
	}

	onInputChange(value) {
		
		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const param = window.NS.singletons.ConnectionsManager.params[this.currentOutConnections[i].connection.paramID];
			// const param = this.currentOutConnections[i].param;
			const inNode = window.NS.singletons.ConnectionsManager.nodes[this.currentOutConnections[i].inNodeID];
			inNode.updateParam(param, this);
		}

		this.updateVisualSettings(value);
	}

	getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings space-size-node';

			const defaultSettings = {
				value: (this.initValues && this.initValues.particleRotation) ? this.initValues.particleRotation : 0,
				step: 0.001,
				min: -0.2,
				max: .2,
			};

			this.input = new InputComponent(
				settingsContainer,
				'Particle Rotation (hastighet)',
				defaultSettings,
				this.onInputChangeBound
			);
			
			this.settingsContainer = settingsContainer;
		}
		return this.settingsContainer;
	}

	getValue() {
        return this.value;
	}

	onConnectionAdd(e) {
		if (e.detail.connection.outNodeID === this.ID) {
			this.currentOutConnections.push(e.detail);
			this.currentOutConnectionsLength = this.currentOutConnections.length;
		}
	}

	onConnectionRemove(e) {
		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramIDToRemove = connection.paramID;
			const outIDToRemove = connection.outNodeID;
			const inIDToRemove = e.detail.inNodeID;
			
			const tempOutConnections = this.currentOutConnections.map(t => t);

			const paramConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.paramID !== paramIDToRemove));
			const nodeConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.outNodeID !== outIDToRemove));
			
			const finalConnections = paramConnections.concat(nodeConnections);
			this.currentOutConnections = finalConnections;
			this.currentOutConnectionsLength = this.currentOutConnections.length;

			if (this.currentOutConnectionsLength <= 0) {
				this.reset();
			}
		}
	}


	removeFromDom() {
		this.reset();

		super.removeFromDom();
	}
}