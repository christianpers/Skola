import TextureSelectorNode from '../../TextureSelectorNode';
import Dropdown from '../../../views/Nodes/NodeComponents/Dropdown';
import textures from './textures';

export default class PlanetTextureSelector extends TextureSelectorNode {
    constructor(renderer, backendData) {
        super(renderer, backendData);

		this.title = 'Planet textur';
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
}