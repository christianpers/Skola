import GraphicNode from '../GraphicNode';
import InputComponent from '../../views/Nodes/NodeComponents/InputComponent';
import { createGridSpheres } from './helpers';
import { SIMPLE_3D_VERTEX_LIGHT, NEUTRON_FRAGMENT } from '../../../shaders/SHADERS';

export default class NeutronsModifer extends GraphicNode {
    constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;
		this.onInputChangeBound = this.onInputChange.bind(this);
		// this.needsUpdate = true;
		this.title = 'Neutrons modifier';
		this.hasMeshToAdd = true;

		this.isParam = true;

		this.outValues = {};

		this.mesh = new THREE.Group();
		this.mesh.name = 'neutrons';

		this.addToGroup = 'mainAtomGroup';

		this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
				{
					lightIntensity: {type: 'f', value: 1.0}
				}
			]),
            vertexShader: SIMPLE_3D_VERTEX_LIGHT,
            fragmentShader: NEUTRON_FRAGMENT,
			lights: true
        });
		
		this.getSettings();
	}

	hideSettings() {
		
	}

	getMeshGroup() {
		const getAmountNeutrons = () => {
			if (this.visualSettings) {
				return this.visualSettings.amountNeutrons;
			}

			if (this.initValues && this.initValues.amountNeutrons) {
				return this.initValues.amountNeutrons;
			}

			return 1;
		}

		const amountNeutrons = getAmountNeutrons();

		for (let i = this.mesh.children.length - 1; i >= 0; i--) {
			this.mesh.remove(this.mesh.children[i]);
		}

		createGridSpheres(this.mesh, 3, amountNeutrons, true, 0x000000, new THREE.Vector3(0, 0, 0), '', this.material);

		return this.mesh;
	}

	onInputChange(value) {
		this.updateVisualSettings(value);

		if (value !== this.mesh.children.length) {
			// this.updateMeshGroup();
			for (let i = 0; i < this.currentOutConnectionsLength; i++) {
				const param = window.NS.singletons.ConnectionsManager.params[this.currentOutConnections[i].connection.paramID];
				// const param = this.currentOutConnections[i].param;
				const inNode = window.NS.singletons.ConnectionsManager.nodes[this.currentOutConnections[i].inNodeID];
				inNode.updateParam(param, this);
			}
		}
	}

	getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings neutrons-modifier-node';

			const defaultSettings = {
				value: (this.initValues && this.initValues.amountNeutrons) ? this.initValues.amountNeutrons : 1,
				step: 1,
				min: 0,
				max: 50,
			};

			this.amountInput = new InputComponent(
				settingsContainer,
				'Antal Neutroner',
				defaultSettings,
				this.onInputChangeBound
			);

			this.settingsContainer = settingsContainer;
		}

		return this.settingsContainer;
	}

	updateVisualSettings(val) {
		this.syncVisualSettings({
			amountNeutrons: val,
		});
	}

    reset() {

    }


	onConnectionAdd(e) {
		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
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