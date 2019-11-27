import GraphicNode from '../GraphicNode';
import VerticalSlider from '../../views/Nodes/NodeComponents/VerticalSlider';

import './index.scss';

export default class ShapeNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;

		this.needsUpdate = true;
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

			const orbitSliderContainer = document.createElement('div');
			orbitSliderContainer.className = 'slider-row';

			const bottomContainer = document.createElement('div');
			bottomContainer.className = 'slider-row bottom-container';
			
			const orbitXSlider = new VerticalSlider(
				orbitSliderContainer,
				this.initValues ? this.initValues['orbitX'] : 10,
				this.onOrbitXChangeBound,
				0,
				{min: 0, max: 40},
				'Radie X',
				60,
				true,
			);

			const orbitYSlider = new VerticalSlider(
				orbitSliderContainer,
				this.initValues ? this.initValues['orbitY'] : 10,
				this.onOrbitYChangeBound,
				0,
				{min: 0, max: 40},
				'Radie Y',
				60,
				true,
			);

			const orbitZSlider = new VerticalSlider(
				orbitSliderContainer,
				this.initValues ? this.initValues['orbitY'] : 10,
				this.onOrbitZChangeBound,
				0,
				{min: 0, max: 40},
				'Radie Z',
				60,
				true,
			);

			this.orbitSliders = {
				Position: {
					x: orbitXSlider,
					y: orbitYSlider,
					z: orbitZSlider,
				},
				Form: {
					x: orbitXSlider,
					y: orbitYSlider,
					z: orbitZSlider,
				},
			};

			settingsContainer.appendChild(orbitSliderContainer);
			settingsContainer.appendChild(bottomContainer);

			this.settingsContainer = settingsContainer;
		}
		
		return this.settingsContainer;
	}

	onOrbitXChange(val) {
		this.curve.xRadius = val;
		this.updateVisualSettings();
	}

	onOrbitYChange(val) {
		this.curve.yRadius = val;
		this.updateVisualSettings();
	}

	onOrbitZChange(val) {
		this.curve.yRadius = val;
		this.updateVisualSettings();
	}

	updateVisualSettings() {
		this.syncVisualSettings({
			orbitX: this.curve.xRadius,
			orbitY: this.curve.yRadius,
		});
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