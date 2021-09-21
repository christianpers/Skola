import GraphicNode from '../../../GraphicNode';
import InputComponent from '../../../../views/Nodes/NodeComponents/InputComponent';

import './index.scss';

/*

	x: 
		amount
		step
	y:
		amount
		step
	z:
		amount
		step

*/

export default class DrawingModifier extends GraphicNode{
	code(index) {
		return `var drawingmodifiernode${index} = new DrawingModifier`;
	}
    constructor(renderer, backendData) {
		super();

		// const initData = backendData ? backendData.data.visualSettings : { x: DEFAULT_VAL, y: DEFAULT_VAL, z: DEFAULT_VAL };

		this.isParam = true;
		this.title = 'Rita';
    }

    updateVisualSettings() {}

    onInputChange() {}

    getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings math-drawing-node';


            // INPUT_DEF.forEach(def => {
			// 	const defaultSettings = {
			// 		value: this._inputValues.get(def.id),
			// 		step: 1,
			// 		min: 0,
			// 		max: RANGE,
			// 	};
            //     const input = new InputComponent(
            //         settingsContainer,
            //         INPUT_DEF.find(t => t.id === def.id).name,
            //         defaultSettings,
            //         this.onInputChangeBound
            //     );

            //     this._inputs[def.id] = input;
            // });

			this.settingsContainer = settingsContainer;
		}
		return this.settingsContainer;
	}

    getValue() {}

    reset() {}

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