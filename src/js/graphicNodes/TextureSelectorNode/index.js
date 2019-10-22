import GraphicNode from '../GraphicNode';
import textures from './textures';
import Dropdown from '../../views/Nodes/NodeComponents/Dropdown';

export default class TextureSelectorNode extends GraphicNode{
	constructor(renderer, backendData) {
		super();

		this.initValues = backendData ? backendData.data.visualSettings : null;

		console.log('init: ', this.initValues);

		this.isBackgroundNode = true;

		this.isParam = true;
		this.title = 'Texture Selector';

		this.hasSelectedTexture = false;

		// this.currentOutConnections = [];

		this.onTextureSelectedBound = this.onTextureSelected.bind(this);

		this.texture = new THREE.TextureLoader().load( 'assets/textures/blank.jpg' );
		this.texture.magFilter = THREE.LinearFilter;
		this.texture.minFilter = THREE.LinearFilter;

		this.params = {
		};

		this.paramVals = {};

		this.dropdowns = {};

		this.getSettings();
	}

	updateVisualSettings(itemKey, listKey) {
		this.syncVisualSettings({
			[listKey]: itemKey,
		});
	}

	getSettings() {
		if (!this.settingsContainer) {
			const settingsContainer = document.createElement('div');
			settingsContainer.className = 'node-settings texture-selector-node';
			
			const keys = Object.keys(textures);
			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				const obj = textures[key];
				const initValue = this.initValues ? this.initValues[key] : null;
				const dropdown = new Dropdown(settingsContainer, obj, key, this.onTextureSelectedBound, initValue);
				this.dropdowns[key] = dropdown;
			}

			this.settingsContainer = settingsContainer;
		}
		return this.settingsContainer;
	}

	onTextureSelected(fromInit, obj, listKey) {
		const src = `assets/textures/${obj.name}`;
		this.texture = new THREE.TextureLoader().load( src );

		if (!fromInit) {
			this.updateVisualSettings(obj.title, listKey);
		}

		this.hasSelectedTexture = true;
		
		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const param = window.NS.singletons.ConnectionsManager.params[this.currentOutConnections[i].connection.paramID];
			const inNode = window.NS.singletons.ConnectionsManager.nodes[this.currentOutConnections[i].inNodeID];

			inNode.updateParam(param, this);
		}
	}

	onConnectionAdd(e) {
		console.log('texture node on connection add param: ', e.detail, e.type, this.ID);

		if (e.detail.connection.outNodeID === this.ID) {
			this.currentOutConnections.push(e.detail);
			this.currentOutConnectionsLength = this.currentOutConnections.length;

			if (this.hasSelectedTexture) {
				const param = window.NS.singletons.ConnectionsManager.params[this.currentOutConnections[this.currentOutConnectionsLength-1].connection.paramID];
				const inNode = window.NS.singletons.ConnectionsManager.nodes[this.currentOutConnections[this.currentOutConnectionsLength-1].inNodeID];

				inNode.updateParam(param, this);
			}
		}
	}

	onConnectionRemove(e) {
		console.log('texture node on connection remove: ', e.detail, e.type, this.ID);

		if (e.detail.connection.outNodeID === this.ID) {
			const connection = e.detail.connection;
			const paramIDToRemove = connection.paramID;
			const outIDToRemove = connection.outNodeID;
			const inIDToRemove = e.detail.inNodeID;
			// const paramContainer = window.NS.singletons.ConnectionsManager.params[connection.paramID];
			
			const tempOutConnections = this.currentOutConnections.map(t => t);

			const paramConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.paramID !== paramIDToRemove));
			const nodeConnections = tempOutConnections.filter(t => (t.inNodeID === inIDToRemove && t.connection.outNodeID !== outIDToRemove));
			
			const finalConnections = paramConnections.concat(nodeConnections);
			this.currentOutConnections = finalConnections;
			this.currentOutConnectionsLength = this.currentOutConnections.length;

			// if (this.currentOutConnectionsLength <= 0) {
			// 	this.reset();
			// }
		}
	}

	// enableOutput(param, connection) {
	// 	super.enableOutput();

	// 	this.currentOutConnections.push(connection);
	// 	this.currentOutConnectionsLength = this.currentOutConnections.length;
		
	// }


	// disableOutput(nodeIn, param) {
	// 	const tempOutConnections = this.currentOutConnections.map(t => t);

    //     let paramConnections = tempOutConnections.filter(t => t.param);
    //     let nodeConnections = tempOutConnections.filter(t => !t.param);

    //     if (param) {
    //         paramConnections = paramConnections.filter(t => t.param && (t.param.title !== param.title));
    //     } else {
    //         nodeConnections = nodeConnections.filter(t => t.in.ID !== nodeIn.ID);
    //     }
        
    //     const finalConnections = paramConnections.concat(nodeConnections);
    //     this.currentOutConnections = finalConnections;
    //     this.currentOutConnectionsLength = this.currentOutConnections.length;

    //     if (this.currentOutConnectionsLength <= 0) {
    //         super.disableOutput();

    //     }
		
		
	// }

}