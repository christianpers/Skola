import GraphicNode from '../GraphicNode';
import VerticalSlider from '../../views/Nodes/NodeComponents/VerticalSlider';

import './index.scss';

export default class RotationDriverNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;

		this.needsUpdate = true;
		this.title = 'Rotation modifier';

		this.isParam = true;

		this.currentRotationY = (this.initValues && this.initValues.rotationX) ? this.initValues.rotationX : 0;
		this.currentRotationX = (this.initValues && this.initValues.rotationY) ? this.initValues.rotationY : 0;

		this.outValues = {
			Rotation: {
				x: 0,
				y: 0,
			}
		};

		// const targetParam = {
		// 	title: 'Center Point',
		// 	param: 'center',
		// 	useAsInput: true,
		// 	defaultVal: new THREE.Vector3(),
		// 	paramHelpersType: 'target',
		// 	needsFrameUpdate: false,
		// };

		// this.targetPosition = new THREE.Vector3();

		// this.params = {
		// 	targetParam,
		// };

		// this.paramVals = {};

		this.onRotationChangeYBound = this.onRotationChangeY.bind(this);
		this.onRotationChangeXBound = this.onRotationChangeX.bind(this);
		
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


			const rotationXSlider = new VerticalSlider(
				rotationSliderContainer,
				this.initValues ? this.initValues['rotationX'] : 0,
				this.onRotationChangeXBound, 
				3,
				{min: -.1, max: .1},
				'Rotation X',
				60,
				true,
			);

			const rotationYSlider = new VerticalSlider(
				rotationSliderContainer,
				this.initValues ? this.initValues['rotationY'] : 0,
				this.onRotationChangeYBound,
				3,
				{min: -.1, max: .1},
				'Rotation Y',
				60,
				true,
			);

			this.rotationSliders = {
				Rotation: {
					x: rotationXSlider,
					y: rotationYSlider,
				},
			};

			settingsContainer.appendChild(rotationSliderContainer);

			this.settingsContainer = settingsContainer;
		}

		return this.settingsContainer;
	}

	onRotationChangeX(val) {
		this.currentRotationX = val;
		this.updateVisualSettings();
	}

	onRotationChangeY(val) {
		this.currentRotationY = val;
		this.updateVisualSettings();
	}

	updateVisualSettings() {
		this.syncVisualSettings({
			rotationX: this.currentRotationX,
			rotationY: this.currentRotationY,
    	});
	}

    reset() {

    }

	getValue(param) {
		return this.outValues[param.parent][param.param];
	}

	update() {
		this.outValues['Rotation'].y += this.currentRotationY;
		this.outValues['Rotation'].x += this.currentRotationX;
		
		// console.log(this.currentOutConnectionsLength);

    	for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const connectionData = this.currentOutConnections[i];
			const inNode = window.NS.singletons.ConnectionsManager.nodes[connectionData.inNodeID];
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connectionData.connection.paramID];
			
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
			
			this.rotationSliders[paramContainer.param.parent][paramContainer.param.param].show();
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
			
			this.rotationSliders[paramContainer.param.parent][paramContainer.param.param].hide();

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