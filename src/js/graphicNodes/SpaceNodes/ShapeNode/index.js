import GraphicNode from '../../GraphicNode';
import InputComponent from '../../../views/Nodes/NodeComponents/InputComponent';
import ConversionInputs from '../../../views/Nodes/NodeComponents/ConversionInputs';

import './index.scss';

const kmToTellusRadius = (km /* miljoner km */) => {
	return Math.round(((Number(km) + Number.EPSILON) / 149.6) * 100) / 100;
};

const tellusRadiusToKm = (radius) => {
	return Math.round(((radius + Number.EPSILON) * 149.6) * 10) / 10;
};

export default class ShapeNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;

		this.needsUpdate = false;
		this.title = 'Shape modifier';
		this.isForegroundNode = true;
		this.isShapeNode = true;

		this.isParam = true;

		this.onOrbitXChangeBound = this.onOrbitXChange.bind(this);
		this.onOrbitYChangeBound = this.onOrbitYChange.bind(this);
		this.onOrbitZChangeBound = this.onOrbitZChange.bind(this);

        const xRadius = (this.initValues && this.initValues.orbitX) ? this.initValues.orbitX : 0;
        const yRadius = (this.initValues && this.initValues.orbitY) ? this.initValues.orbitY : 0;
		
		this.curve = new THREE.EllipseCurve(
			0,  0,            // ax, aY
			xRadius, yRadius, // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			0                 // aRotation
		);

		const points = this.curve.getPoints( 50 );
		const arrLength = 51;
		const positions = new Float32Array( 51 * 3 );
		let index = 0;

		for (let i = 0; i < arrLength; i++) {
			positions[index++] = points[i].x;
			positions[index++] = 0;
			positions[index++] = points[i].y;
		}
	
		this.updateAxes();
		this.getSettings();
	}

	hideSettings() {
		
	}

	getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings shape-modifier-node';

			const sliderContainer = document.createElement('div');
			sliderContainer.className = 'slider-row';

			const orbitSliderGroup = document.createElement('div');
			orbitSliderGroup.className = 'orbit-slider-group';

			sliderContainer.appendChild(orbitSliderGroup)

			const labelHTML = `
				<div class="orbit-slider-label-group">
					<h4>Orbit</h4>
					<h5>Miljoner km</h5>
				</div>
			`;

			orbitSliderGroup.insertAdjacentHTML('afterbegin', labelHTML);

			const orbitInnerSliderGroup = document.createElement('div');
			orbitInnerSliderGroup.className = 'orbit-inner-slider-group';

			orbitSliderGroup.appendChild(orbitInnerSliderGroup);

			const defaultSettings = {
				value: 0,
				step: 0.000001,
				min: 0,
				max: 4503,
			};

			// X
			const conversionXDefinitionKm = {
				name: 'X (Miljoner km)',
				inputSettings: Object.assign({}, defaultSettings, { value: this.initValues ? this.initValues['orbitX'] : defaultSettings.value }),
				conversionFn: tellusRadiusToKm,
				isMaster: true,
			};

			const conversionXDefinitionTellusRadius = {
				name: 'X (Jord Radie)',
				inputSettings: Object.assign({}, defaultSettings, { step: 0.1, value: this.initValues ? kmToTellusRadius(this.initValues['orbitX']) : kmToTellusRadius(defaultSettings.value) }),
				conversionFn: kmToTellusRadius
			};

			const xDef = {
				disabled: true,
				hideMinMax: false,
				applyCallback: this.onOrbitXChangeBound,
				inputs: [
					conversionXDefinitionKm,
					conversionXDefinitionTellusRadius,
				],
			};

			const orbitXInput = new ConversionInputs(xDef, orbitInnerSliderGroup);


			// Y
			const conversionYDefinitionKm = {
				name: 'Y (Miljoner km)',
				inputSettings: Object.assign({}, defaultSettings, { value: this.initValues ? this.initValues['orbitY'] : defaultSettings.value }),
				conversionFn: tellusRadiusToKm,
				isMaster: true,
			};

			const conversionYDefinitionTellusRadius = {
				name: 'Y (Jord Radie)',
				inputSettings: Object.assign({}, defaultSettings, { step: 0.1, value: this.initValues ? kmToTellusRadius(this.initValues['orbitY']) : kmToTellusRadius(defaultSettings.value) }),
				conversionFn: kmToTellusRadius
			};

			const yDef = {
				disabled: true,
				hideMinMax: false,
				applyCallback: this.onOrbitYChangeBound,
				inputs: [
					conversionYDefinitionKm,
					conversionYDefinitionTellusRadius,
				],
			};

			const orbitYInput = new ConversionInputs(yDef, orbitInnerSliderGroup);

			// Z
			const conversionZDefinitionKm = {
				name: 'Z (Miljoner km)',
				inputSettings: Object.assign({}, defaultSettings, { value: this.initValues ? this.initValues['orbitY'] : defaultSettings.value }),
				conversionFn: tellusRadiusToKm,
				isMaster: true,
			};

			const conversionZDefinitionTellusRadius = {
				name: 'Z (Jord Radie)',
				inputSettings: Object.assign({}, defaultSettings, { step: 0.1, value: this.initValues ? kmToTellusRadius(this.initValues['orbitY']) : kmToTellusRadius(defaultSettings.value) }),
				conversionFn: kmToTellusRadius
			};

			const zDef = {
				disabled: true,
				hideMinMax: false,
				applyCallback: this.onOrbitZChangeBound,
				inputs: [
					conversionZDefinitionKm,
					conversionZDefinitionTellusRadius,
				],
			};

			const orbitZInput = new ConversionInputs(zDef, orbitInnerSliderGroup);

			
			
			this.orbitSliders = {
				// Position: {
				// 	x: orbitXInput,
				// 	y: orbitYInput,
				// 	z: orbitZInput,
				// },
				Form: {
					x: orbitXInput,
					y: orbitYInput,
					z: orbitZInput,
				},
			};

			

			settingsContainer.appendChild(sliderContainer);

			this.settingsContainer = settingsContainer;

			if (this.initValues && this.initValues['orbitX']) {
				this.onOrbitXChange(this.initValues['orbitX'], false);
			}

			if (this.initValues && this.initValues['orbitY']) {
				this.onOrbitYChange(this.initValues['orbitY'], false);
			}

		}
		
		return this.settingsContainer;
	}

	getOrbitVal(value, isRelative) {
		const max = 4503;
		const min = 0;

		const maxScale = 800;

		const val = (value - min) / (max - min);

		if (isRelative) {
			return val * maxScale;
		}

		return val * maxScale + window.NS.singletons.lessons.space.distanceModifier * 3;
	}

	onOrbitXChange(val, updateBackend = true) {
		this.curve.xRadius = this.getOrbitVal(val, true);
		this.currentXInputVal = val;
		if (updateBackend) {
			this.updateVisualSettings();
		}
		

		// this.setDistanceToOrigin();
	}

	onOrbitYChange(val, updateBackend = true) {
		this.curve.yRadius = this.getOrbitVal(val, true);
		this.currentYInputVal = val;
		if (updateBackend) {
			this.updateVisualSettings();
		}

		// this.setDistanceToOrigin();
	}

	onOrbitZChange(val, updateBackend = true) {
		this.curve.yRadius = this.getOrbitVal(val, true);
		this.currentYInputVal = val;
		if (updateBackend) {
			this.updateVisualSettings();
		}

		// this.setDistanceToOrigin();
	}

	// updateVisualSettings() {
	// 	this.syncVisualSettings({
	// 		orbitX: this.curve.xRadius,
	// 		orbitY: this.curve.yRadius,
	// 	});
	// }
	updateVisualSettings() {
		this.syncVisualSettings({
			orbitX: this.orbitSliders.Form.x.getValue(),
			orbitY: this.currentYInputVal
		});

		// this.updateMesh();
	}

	reset() {
	}

	getValue(param) {
		return this.outValues[param.parent][param.param];
	}

	update() {
	}

	updateAxes() {
		this.enabledAxes = {x: false, y: false, z: false};
		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const connectionData = this.currentOutConnections[i];
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connectionData.connection.paramID];
			this.enabledAxes[paramContainer.param.param] = true;	
		}
	}

	render() {

	}

	onConnectionAdd(e) {
		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
			this.orbitSliders[paramContainer.param.parent][paramContainer.param.param].show();
			this.currentOutConnections.push(e.detail);
			this.currentOutConnectionsLength = this.currentOutConnections.length;

			if (this.currentOutConnectionsLength > 0) {

				this.updateAxes();
			}
		}
	}

	onConnectionRemove(e) {
		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramIDToRemove = connection.paramID;
			const outIDToRemove = connection.outNodeID;
			const inIDToRemove = e.detail.inNodeID;
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
			this.orbitSliders[paramContainer.param.parent][paramContainer.param.param].hide();

			const tempOutConnections = this.currentOutConnections.map(t => t);

			const paramConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.paramID !== paramIDToRemove));
			const nodeConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.outNodeID !== outIDToRemove));
			
			const finalConnections = paramConnections.concat(nodeConnections);
			this.currentOutConnections = finalConnections;
			this.currentOutConnectionsLength = this.currentOutConnections.length;

			if (this.currentOutConnectionsLength <= 0) {
				this.reset();
			}

			this.updateAxes();
		}
	}

	enableInput(outputNode) {
		super.enableInput();		
	}

	removeFromDom() {

		this.reset();
		// this.orbitXSlider.remove();
		// this.orbitYSlider.remove();
		// this.orbitZSlider.remove();


		super.removeFromDom();

	}

	updateAllowedInputParams(inputParams) {
		const ret = [];
		const keys = Object.keys(inputParams);
		
		const connectedInputParamKeys = keys.filter(t => inputParams[t].isConnected);
		const notConnectedInputParamKeys = keys.filter(t => !inputParams[t].isConnected);
		if (connectedInputParamKeys.length >= 2) {
			for (let i = 0; i < notConnectedInputParamKeys.length; i++) {
				const key = notConnectedInputParamKeys[i];
				inputParams[key].setConnectionAllowed(false);
			}
		} else {
			for (let i = 0; i < keys.length; i++) {
				inputParams[keys[i]].setConnectionAllowed(true);
			}
		}

		// CHECK THAT BOTH Y AND Z ARENT SELECTED
		const yParamKey = keys.filter(t => inputParams[t].param.param === 'y');
		const zParamKey = keys.filter(t => inputParams[t].param.param === 'z');

		if (inputParams[yParamKey].isConnected) {
			inputParams[zParamKey].setConnectionAllowed(false);
		}

		if (inputParams[zParamKey].isConnected) {
			inputParams[yParamKey].setConnectionAllowed(false);
		}
	}
}