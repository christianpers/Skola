import GraphicNode from '../GraphicNode';
import InputComponent from '../../views/Nodes/NodeComponents/InputComponent';
import { getGridPositions, updateConnectedElectrons } from './helpers';
import Electron from './Electron';
import { RING_DEF } from './AtomNode';

export default class ElectronsModifer extends GraphicNode {
    constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;
		this.onInputChangeBound = this.onInputChange.bind(this);
		// this.needsUpdate = true;
		this.title = 'Electrons modifier';
		this.hasMeshToAdd = true;

		this.isParam = true;

        this.electrons = {};

        this.enableDragging = true;

		this.outValues = {};

		this.mesh = new THREE.Group();
		this.mesh.name = 'electrons';

        this.addToGroup = 'electronsGroup';
		
		this.getSettings();
	}

	hideSettings() {
		
	}

    getElectron(ID) {
        return this.electrons[ID];
    }

	// THIS IS NOT TESTED ---- FIX !!!!
	// getElectronIndexInRing(ID) {
	// 	const connectedElectrons = this.getConnectedElectrons();
	// 	const electronsWithRingIndex = Object.keys(connectedElectrons).map(t => {
	// 		const ringIndex = this.electrons[t].getRingIndex();
	// 		return { ID: t, ringIndex };
	// 	}).sort((a, b) => a.ringIndex - b.ringIndex);

	// 	const electronIndexInArr = electronsWithRingIndex.findIndex(t => t.ID === ID);

	// 	// const ringDefKeys = Object.keys(RING_DEF);


	// 	if (electronIndexInArr < RING_DEF[0].amountElectrons) {
	// 		return electronIndexInArr;
	// 	} else if (electronsIndexInArr < RING_DEF[1].amountElectrons) {
	// 		return electronIndexInArr - RING_DEF[0].amountElectrons;
	// 	} else if (electronIndexInArr < RING_DEF[2].amountElectrons) {
	// 		return electronIndexInArr - (RING_DEF[1].amountElectrons + RING_DEF[0].amountElectrons);
	// 	}




	// }

    getConnectedElectrons() {
        const keys = Object.keys(this.electrons);
        return keys
            .filter(key => this.electrons[key].isConnected())
            .map(key => this.electrons[key]);
    }

	getMeshGroup(atomNode) {
        /* CALLED FROM PARAMHELPERS WHEN AMOUNT ELECTRONS INPUT CHANGES IN UI */
		const getAmountElectrons = () => {
			if (this.visualSettings) {
				return this.visualSettings.amountElectrons;
			}

			if (this.initValues && this.initValues.amountElectrons) {
				return this.initValues.amountElectrons;
			}

			return 0;
		};

		const amountElectrons = getAmountElectrons();

        const atomPosIndex = atomNode.nodeIndex;
        const positions = getGridPositions(3, amountElectrons, false, new THREE.Vector3(atomPosIndex * 8 + 6, 20, 0));

        const keys = Object.keys(this.electrons);
        const diff = amountElectrons - keys.length;
        if (diff === 0) {
            return this.mesh;
        } else if (diff < 0) {
            const amountToRemove = Math.abs(diff);
            
            let electronsToRemove = [];
            const notConnectedElectronKeys = keys.filter(key => !this.electrons[key].isConnected());
            const connectedElectronKeys = keys.filter(key => this.electrons[key].isConnected());
            if (notConnectedElectronKeys.length < amountToRemove) {
                const remaining = amountToRemove - notConnectedElectronKeys.length;
                for (let i = 0; i < remaining; i++) {
                    electronsToRemove.push(connectedElectronKeys[i]);
                }
                electronsToRemove.push(...notConnectedElectronKeys);
            } else {
                electronsToRemove = notConnectedElectronKeys.slice(0, amountToRemove);
            }

            for (let i = 0; i < electronsToRemove.length; i++) {
                const electron = this.electrons[electronsToRemove[i]];
                electron.remove();
                delete this.electrons[electronsToRemove[i]];
            }

            updateConnectedElectrons(this.ID, this.getConnectedElectrons());
        } else {
            const amountToAdd = diff;
            for (let i = 0; i < amountToAdd; i++) {
                const index = keys.length + i;
                const electronObj = new Electron(index, positions[index], this.mesh);
                this.electrons[electronObj.ID] = electronObj;
            }
        }

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
			settingsContainer.className = 'node-settings electrons-modifier-node';

			const defaultSettings = {
				value: (this.initValues && this.initValues.amountElectrons) ? this.initValues.amountElectrons : 1,
				step: 1,
				min: 0,
				max: 50,
			};

			this.amountInput = new InputComponent(
				settingsContainer,
				'Antal Elektroner',
				defaultSettings,
				this.onInputChangeBound
			);

			this.settingsContainer = settingsContainer;
		}

		return this.settingsContainer;
	}

	updateVisualSettings(val) {
		this.syncVisualSettings({
			amountElectrons: val,
		}, true);
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