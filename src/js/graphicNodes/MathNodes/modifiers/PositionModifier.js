import GraphicNode from '../../GraphicNode';
import InputComponent from '../../../views/Nodes/NodeComponents/InputComponent';

const DEFAULT_VAL = 0;

const RANGE = 20;

const INPUT_DEF = [
    {
        name: 'X',
        id: 'x',
        conversion: (value) => (value - RANGE / 2) * 2
    },
    {
        name: 'Y',
        id: 'y',
        conversion: (value) => value
    },
    {
        name: 'Z',
        id: 'z',
        conversion: (value) => -value
    }
];

const getDefFromName = (name) => {
    const obj = INPUT_DEF.find(t => t.name === name);
    return obj;
}

export default class PositionModifierNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		const initData = backendData ? backendData.data.visualSettings : { x: DEFAULT_VAL, y: DEFAULT_VAL, z: DEFAULT_VAL };

		console.log(initData);

		this.isParam = true;
		this.title = 'Position';

        this._inputs = {};



        this._convertedValues = new Map();
		this._inputValues = new Map();

        INPUT_DEF.forEach(t => {
			const val = initData[t.id];
			this._convertedValues.set(t.id, t.conversion(val));
			this._inputValues.set(t.id, val);
		});

		this.onInputChangeBound = this.onInputChange.bind(this);
		
		this.getSettings();
	}

	updateVisualSettings() {
		const obj = {};
		this._inputValues.forEach((val, key) => obj[key] = val);
		this.syncVisualSettings(obj);
	}

	onInputChange(value, name) {
        const { id, conversion } = getDefFromName(name);
		const convertedVal = conversion(value);
        this._convertedValues.set(id, convertedVal);
		this._inputValues.set(id, value);

		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const param = window.NS.singletons.ConnectionsManager.params[this.currentOutConnections[i].connection.paramID];
			const inNode = window.NS.singletons.ConnectionsManager.nodes[this.currentOutConnections[i].inNodeID];
			inNode.updateParam(param, this);
		}

		this.updateVisualSettings();
	}

	getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings math-position-node';


            INPUT_DEF.forEach(def => {
				const defaultSettings = {
					value: this._inputValues.get(def.id),
					step: 1,
					min: 0,
					max: RANGE,
				};
                const input = new InputComponent(
                    settingsContainer,
                    INPUT_DEF.find(t => t.id === def.id).name,
                    defaultSettings,
                    this.onInputChangeBound
                );

                this._inputs[def.id] = input;
            });

			this.settingsContainer = settingsContainer;
		}
		return this.settingsContainer;
	}

	getValue(param) {
        return this._convertedValues.get(param.param);
	}

	reset() {
		this.currentConvertedValue = this.getConvertedVal(DEFAULT_VAL);
		this._convertedValues.clear();
		this._inputValues.clear();
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