import Dropdown from '../../views/Nodes/NodeComponents/Dropdown';

export default class CenterPointSettings{
    constructor(parentEl, onSelectedCallback, initValue, onResetCallback) {
        this.onSelectedCallback = onSelectedCallback;

        // const initValue = undefined;


        const html = `
            <div class="center-point-settings">
                <div class="dropdown-container">
                </div>
            </div>
        `;

        this.el = document.createElement('div');
        this.el.innerHTML = html;

        const dropdownContainer = this.el.querySelector('.dropdown-container');

        const nodes = this.getNodes();
        this.dropdown = new Dropdown(dropdownContainer, nodes, 'Nodes', this.onSelectedCallback, initValue, onResetCallback);

        this._groupEl = parentEl.closest('.orbit-slider-group');

        parentEl.appendChild(this.el);
    }

    getNodes(connectedNodeID) {
        const selectableNodes = [];
        const keys = Object.keys(window.NS.singletons.ConnectionsManager.nodes);
        for (let i = 0; i < keys.length; i++) {
            const node = window.NS.singletons.ConnectionsManager.nodes[keys[i]];
            if (!node.isModifier && (node.ID !== connectedNodeID)) {
                selectableNodes.push(node);
            }
        }

        return selectableNodes;
    }

    refresh(connectedNodeID, resetSelected) {
        const nodes = this.getNodes(connectedNodeID);

        if (!nodes.length) {
            this.disable();
        } else {
            this.enable();
        }

        this.dropdown.update(nodes, resetSelected);
    }

    enable() {
        this._groupEl.classList.remove('disabled');
    }

    disable() {
        this._groupEl.classList.add('disabled');
    }
}