import GraphicNode from './GraphicNode';
import Picker from 'vanilla-picker';

export default class ColorNode extends GraphicNode{
	constructor(renderer, backendData) {
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

		if (backendData && backendData.data && backendData.data.visualSettings) {
			this.currentColor = new THREE.Color(backendData.data.visualSettings.color);
		} else {
			this.currentColor = new THREE.Color(1.0, 1.0, 1.0);
		}

		// this.picker = new Picker(colorConfig);
		this.onPickerChangeBound = this.onPickerChange.bind(this);

		this.onColorClickBound = this.onColorClick.bind(this);

		// this.picker.onChange = this.onPickerChangeBound;

		// this.settings = {
		// 	el: new Picker(colorConfig)
		// };
	}

	// event from connectionsmanager
	onConnectionAdd(e) {
		
		const detail = e.detail;

		if (this.ID === detail.inNodeID) {
			super.onConnectionAdd(e.detail);
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

	// event from connectionsmanager
	onConnectionRemove(e) {
		const detail = e.detail;
		if (this.ID === detail.inNodeID) {
			super.onConnectionRemove(e);
		} else if (this.ID === detail.connection.outNodeID) {
			this.disableOutput(detail.connection.paramID);
			this.currentColor = new THREE.Color(1.0, 1.0, 1.0);
		}
	}

	onColorClick() {
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
		// const picker = new Picker(colorConfig);
		this.picker.setOptions(colorConfig);
		// this.picker.show();
		this.picker.onChange = this.onPickerChangeBound;

		if (this.currentColor) {
			const hex =  `#${this.currentColor.getHexString()}`;
			this.setColor(hex);
		}
		
	}

	hideSettings() {
		this.colorPreview.removeEventListener('click', this.onColorClickBound);
	}

	onPickerChange(color) {
		if (!color._rgba) {
			return;
		}

		const cssColor = `rgb(${color._rgba[0]},${color._rgba[1]},${color._rgba[2]})`;
		
		this.setColor(cssColor);
		this.currentColor = new THREE.Color(color.rgbString);

		this.syncVisualSettings({
			color: color.rgbString,
		});

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
		if (this.colorPreview) {
			this.colorPreview.style.background = color;
		}	
	}

	enableOutput(param, connection) {
		// console.log('enable output color');
		// super.enableOutput();

		// this.currentOutConnections.push(connection);
		// this.currentOutConnectionsLength = this.currentOutConnections.length;

		super.enableOutput(param, connection);

		if (this.currentOutConnectionsLength === 1) {
			let hex = `#${param.defaultVal.getHexString()}`;
			if (!this.currentColor) {
				this.currentColor = param.defaultVal;
			} else {
				hex = this.currentColor.getHexString();
			}
			if (this.picker) {
				this.picker.color = hex;
			}
			
			this.setColor(hex);
		}
	}
}