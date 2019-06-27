import GraphicNode from './GraphicNode';
import Picker from 'vanilla-picker';

export default class ColorNode extends GraphicNode{
	constructor() {
		super();

		// this.el.classList.add('no-height');
		this.el.classList.add('color-node');
		this.title = 'Color modifier';

		this.isParam = true;

		this.paramVals = {};

		this.params = {
		};

		// const colorPickerParent = document.createElement('div');
		// colorPickerParent.className = 'color-picker-parent prevent-drag';

		// const label = document.createElement('h4');
		// label.innerHTML = 'Välj färg';

		// this.colorPreview = document.createElement('div');
		// this.colorPreview.className = 'color-preview';

		// colorPickerParent.appendChild(label);
		// colorPickerParent.appendChild(this.colorPreview);

		// this.topPartEl.appendChild(colorPickerParent);

		

		this.currentColor = undefined;

		// this.picker = new Picker(colorConfig);
		this.onPickerChangeBound = this.onPickerChange.bind(this);

		this.onColorClickBound = this.onColorClick.bind(this);

		// this.picker.onChange = this.onPickerChangeBound;

		// this.settings = {
		// 	el: new Picker(colorConfig)
		// };
	}

	onConnectionAdd(e) {
		const detail = e.detail;

		if (this.ID === detail.inNodeID) {
			super.onConnectionAdd(e);
		} else if (this.ID === detail.connection.outNodeID) {
			const connectionObj = {
				paramID: detail.connection.paramID,
				outNodeID: detail.connection.outNodeID,
				inNodeID: detail.inNodeID,
			};

			const param = window.NS.singletons.ConnectionsManager.params[connectionObj.paramID];
			this.enableOutput(param.param, connectionObj);
		}
	}

	onConnectionRemove(e) {
		const detail = e.detail;
		if (this.ID === detail.inNodeID) {
			super.onConnectionRemove(e);
		} else if (this.ID === detail.connection.outNodeID) {
			this.disableOutput(detail.connection.paramID);
		}
	}

	onColorClick() {
		console.log('sfsdf');
		this.picker.show();
	}

	getSettings() {
		if (!this.settingsContainer) {
			this.settingsContainer = document.createElement('div');
			this.settingsContainer.className = 'node-settings color-node';

			const label = document.createElement('h4');
			label.innerHTML = 'Välj färg';

			this.colorPreview = document.createElement('div');
			this.colorPreview.className = 'color-preview';
			

			this.settingsContainer.appendChild(label);
			this.settingsContainer.appendChild(this.colorPreview);

			this.picker = new Picker();
		}

		this.colorPreview.addEventListener('click', this.onColorClickBound);

		return this.settingsContainer;
	}

	afterSettingsAddedToDom() {
		const colorConfig = {
			parent: this.settingsContainer,
			color: this.currentColor ? this.currentColor.getStyle() : '#FFFFFF',
			alpha: false,
		};
		console.log('test');
		// const picker = new Picker(colorConfig);
		this.picker.setOptions(colorConfig);
		// this.picker.show();
		this.picker.onChange = this.onPickerChangeBound;
	}

	hideSettings() {
		this.colorPreview.removeEventListener('click', this.onColorClickBound);
	}

	onPickerChange(color) {

		console.log('picker change');

		if (!color._rgba) {
			return;
		}

		const cssColor = `rgb(${color._rgba[0]},${color._rgba[1]},${color._rgba[2]})`;
		
		this.setColor(cssColor);
		this.currentColor = new THREE.Color(color.rgbString);

		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const paramID = this.currentOutConnections[i].paramID;
			const inNodeID = this.currentOutConnections[i].inNodeID;
			const param = window.NS.singletons.ConnectionsManager.params[paramID];
			const inNode = window.NS.singletons.ConnectionsManager.nodes[inNodeID];

			inNode.updateParam(param, this);
		}
	}

	getValue() {
		return this.currentColor;
	}

	setColor(color) {
		this.colorPreview.style.background = color;
	}

	enableOutput(param, connection) {
		console.log('enable output');
		// super.enableOutput();

		// this.currentOutConnections.push(connection);
		// this.currentOutConnectionsLength = this.currentOutConnections.length;

		super.enableOutput(param, connection);

		if (this.currentOutConnectionsLength === 1) {
			const hex = `#${param.defaultVal.getHexString()}`;
			this.picker.color = hex;
			this.currentColor = param.defaultVal;
			this.setColor(hex);
		}
	}
}