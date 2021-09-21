import GraphicNode from '../../../GraphicNode';
import ColorNode from '../../../ColorNode';

import './index.scss';

export default class StyleModifierNode extends ColorNode{
	constructor(renderer, backendData) {
		super();

		// const initData = backendData ? backendData.data.visualSettings : { x: DEFAULT_VAL, y: DEFAULT_VAL, z: DEFAULT_VAL };

		this.isParam = true;
		this.title = 'Position';

        // this._inputs = {};

        // this._convertedValues = new Map();
		// this._inputValues = new Map();

        // INPUT_DEF.forEach(t => {
		// 	const val = initData[t.id];
		// 	this._convertedValues.set(t.id, t.conversion(val));
		// 	this._inputValues.set(t.id, val);
		// });

		// this.onInputChangeBound = this.onInputChange.bind(this);
		
		// this.getSettings();
	}

    /* TODO */
	// updateVisualSettings() {
	// 	const obj = {};
	// 	this._inputValues.forEach((val, key) => obj[key] = val);
	// 	this.syncVisualSettings(obj);
	// }

	/* TODO */
    // onInputChange(value, name) {
    //     const { id, conversion } = getDefFromName(name);
	// 	const convertedVal = conversion(value);
    //     this._convertedValues.set(id, convertedVal);
	// 	this._inputValues.set(id, value);

	// 	for (let i = 0; i < this.currentOutConnectionsLength; i++) {
	// 		const param = window.NS.singletons.ConnectionsManager.params[this.currentOutConnections[i].connection.paramID];
	// 		const inNode = window.NS.singletons.ConnectionsManager.nodes[this.currentOutConnections[i].inNodeID];
	// 		inNode.updateParam(param, this);
	// 	}

	// 	this.updateVisualSettings();
	// }

    /* TODO */
	// getSettings() {
	// 	if (!this.settingsContainer) {
	// 		const settingsContainer = document.createElement('div');
	// 		settingsContainer.className = 'node-settings math-position-node';


    //         INPUT_DEF.forEach(def => {
	// 			const defaultSettings = {
	// 				value: this._inputValues.get(def.id),
	// 				step: 1,
	// 				min: 0,
	// 				max: RANGE,
	// 			};
    //             const input = new InputComponent(
    //                 settingsContainer,
    //                 INPUT_DEF.find(t => t.id === def.id).name,
    //                 defaultSettings,
    //                 this.onInputChangeBound
    //             );

    //             this._inputs[def.id] = input;
    //         });

	// 		this.settingsContainer = settingsContainer;
	// 	}
	// 	return this.settingsContainer;
	// }

    /* TODO */
	// getValue(param) {
	// }

	reset() {
        /* TODO */
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