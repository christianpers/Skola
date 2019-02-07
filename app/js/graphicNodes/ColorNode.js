import GraphicNode from './GraphicNode';
import Picker from 'vanilla-picker';
import { Color } from 'three';

export default class ColorNode extends GraphicNode{
	constructor() {
		super();

		this.el.classList.add('no-height');
		this.el.classList.add('color-node');

		this.isParam = true;

		this.paramVals = {};

		this.params = {
		};

		const colorPickerParent = document.createElement('div');
		colorPickerParent.className = 'color-picker-parent prevent-drag';

		const label = document.createElement('h4');
		label.innerHTML = 'Välj färg';

		this.colorPreview = document.createElement('div');
		this.colorPreview.className = 'color-preview';

		colorPickerParent.appendChild(label);
		colorPickerParent.appendChild(this.colorPreview);

		this.topPartEl.appendChild(colorPickerParent);

		const colorConfig = {
			parent: colorPickerParent,
			color: '#FFFFFF',
			alpha: false,
		};

		this.currentColor = undefined;

		this.picker = new Picker(colorConfig);
		this.onPickerChangeBound = this.onPickerChange.bind(this);

		this.picker.onChange = this.onPickerChangeBound;
	}

	onPickerChange(color) {

		const cssColor = `rgb(${color._rgba[0]},${color._rgba[1]},${color._rgba[2]})`;
		
		this.setColor(cssColor);
		this.currentColor = new Color(color.rgbString);

		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const param = this.currentOutConnections[i].param;

			this.currentOutConnections[i].in.updateParam(param, this);
		}
	}

	getValue() {
		return this.currentColor;
	}

	setColor(color) {
		this.colorPreview.style.background = color;
	}

	enableOutput(param, connection) {
		super.enableOutput();

		this.currentOutConnections.push(connection);
		this.currentOutConnectionsLength = this.currentOutConnections.length;

		if (this.currentOutConnectionsLength === 1) {
			const hex = `#${param.defaultVal.getHexString()}`;
			this.picker.color = hex;
			this.currentColor = param.defaultVal;
			this.setColor(hex);

		}
	}


	disableOutput(node, param) {
		const tempOutConnections = this.currentOutConnections.map(t => t);

        let paramConnections = tempOutConnections.filter(t => t.param);
        let nodeConnections = tempOutConnections.filter(t => !t.param);

        if (param) {
            paramConnections = paramConnections.filter(t => t.param && (t.param.title !== param.title));
        } else {
            nodeConnections = nodeConnections.filter(t => t.in.ID !== nodeIn.ID);
        }
        
        const finalConnections = paramConnections.concat(nodeConnections);
        this.currentOutConnections = finalConnections;
        this.currentOutConnectionsLength = this.currentOutConnections.length;

        if (this.currentOutConnectionsLength <= 0) {
            super.disableOutput();

        }
	}

}