import GraphicNode from '../GraphicNode';
import InputComponent from '../../views/Nodes/NodeComponents/InputComponent';

export default class SizeModifierNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;

		console.log(this.initValues);

		this.isParam = true;
		this.returnsSingleNumber = true;
		this.title = 'Space size modifier';

		this.sizeInput = null;
		this.maxScale = 2;
		this.onInputChangeBound = this.onInputChange.bind(this);
		this.currentConvertedValue = (this.initValues && this.initValues.size) ? this.getConvertedVal(this.initValues.size) : 0.01;
		this.currentNormalizedVal = 0;

		this.getSettings();
	}

	getConvertedVal(value) {
		const max = 142980;
		const min = 0;

		// const maxScale = 2;

		const val = (value - min) / (max - min);
		return val * this.maxScale + 0.01;
	}

	updateVisualSettings(val) {
		this.syncVisualSettings({
			size: val,
		});
	}

	onInputChange(value) {
		
		this.currentConvertedValue = this.getConvertedVal(value);
		console.log('size: ', this.currentConvertedValue, value);
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
				value: (this.initValues && this.initValues.size) ? this.initValues.size : 1,
				step: 1,
				min: 0,
				max: 142980,
			};

			this.sizeInput = new InputComponent(
				settingsContainer,
				'Planet diameter (km)',
				defaultSettings,
				this.onInputChangeBound
			);
			
			this.settingsContainer = settingsContainer;
		}
		return this.settingsContainer;
	}

	getValue() {
		/*
			DIAMETER
			4879km
			6792 km
			12 104km
			12 756km
			49 530 km
			51 120 km
			120 540 km
			142 980 km
		*/
        return this.currentConvertedValue;
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
		window.cancelAnimationFrame(this.animateValues.reqAnimFrame);

		super.removeFromDom();
	}
}