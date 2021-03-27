import GraphicNode from '../GraphicNode';
// import VerticalSlider from '../../views/Nodes/NodeComponents/VerticalSlider';
import InputComponent from '../../views/Nodes/NodeComponents/InputComponent';

const FULL_RADIAN = Math.PI * 2;

export default class PlanetRotationModifer extends GraphicNode {
    constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;

		this.needsUpdate = true;
		this.title = 'Planet rotation';

		this.isParam = true;

		const hasYVal = (this.initValues && this.initValues.rotationY);
		this.currentRotationY = hasYVal ? this.initValues.rotationY : 0;

		this.outValues = {
			Rotation: {
				y: 0,
			}
		};

		this.onInputChangeBound = this.onInputChange.bind(this);
		
		this.getSettings();
	}

	hideSettings() {
		
	}

	getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings rotation-driver-node';

			const rotationSliderContainer = document.createElement('div');
			rotationSliderContainer.className = 'slider-row';

			const defaultSettings = {
				value: this.initValues ? this.initValues['rotationY'] : 1,
				step: 1,
				min: 0,
				max: 20000,
			};

			const input = new InputComponent(
				rotationSliderContainer,
				'Rotation (Timmar)',
				defaultSettings,
				this.onInputChangeBound
			);

			this.rotationSliders = {
				Rotation: {
					y: input,
				},
			};

			settingsContainer.appendChild(rotationSliderContainer);

			this.settingsContainer = settingsContainer;
		}

		return this.settingsContainer;
	}

	onInputChange(val) {
		this.currentRotationY = val;
		this.updateVisualSettings();
	}

	updateVisualSettings() {
		this.syncVisualSettings({
			rotationY: this.currentRotationY,
    	});
	}

    reset() {
		this.outValues['Rotation'].y = 0.0;
		this.rotationSliders['Rotation'].y.setValue(0.0);
		this.currentRotationY = 0.0;
    }

	getValue(param) {
		return this.outValues[param.parent][param.param];
	}

	update() {
		if (this.currentRotationY > 0) {
			const normalizedRotation = window.NS.singletons.LessonManager.space.spaceTimeController.getNormalizedCurrentHourInDay(this.currentRotationY / 24);
			const val = normalizedRotation * FULL_RADIAN;
			const finalVal = -Math.round((val + Number.EPSILON) * 1000) / 1000;
			this.outValues['Rotation'].y = -Math.round((val + Number.EPSILON) * 1000) / 1000;
		} else {
			this.outValues['Rotation'].y = 0;
		}
		
    	for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const connectionData = this.currentOutConnections[i];
			const inNode = window.NS.singletons.ConnectionsManager.nodes[connectionData.inNodeID];
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connectionData.connection.paramID];
			// if (inNode.ID === 'gKc0wgRdBiGbw9MbzTMQ') {
			// 	console.log(normalizedRotation);
			// }
			inNode.updateParam(paramContainer, this);
		}
	}

	render() {

	}

	onConnectionAdd(e) {
		// console.log('graphic node on connection add orbit: ', e.detail, e.type, this.ID);
		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
			// this.rotationSliders[paramContainer.param.parent][paramContainer.param.param].show();
			this.currentOutConnections.push(e.detail);
			this.currentOutConnectionsLength = this.currentOutConnections.length;
		}
	}

	onConnectionRemove(e) {
		// console.log('graphic node on connection remove: ', e.detail, e.type, this.ID);

		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramIDToRemove = connection.paramID;
			const outIDToRemove = connection.outNodeID;
			const inIDToRemove = e.detail.inNodeID;
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			// if (this.rotationSliders[paramContainer.param.parent][paramContainer.param.param]) {
			// 	this.rotationSliders[paramContainer.param.parent][paramContainer.param.param].hide();

				
			// }
			
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

	enableInput(outputNode) {
		super.enableInput();		
	}

	removeFromDom() {
		this.reset();

		// this.speedSlider.remove();

		// this.orbitXSlider.remove();
		// this.orbitYSlider.remove();
		// this.orbitZSlider.remove();

		// this.rotationXSlider.remove();

		// this.rotationYSlider.remove();

		super.removeFromDom();

	}
}