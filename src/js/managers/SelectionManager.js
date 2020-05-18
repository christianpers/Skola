export default class SelectionManager {
    constructor() {
        this.nonagons = {};

        this.currentSelectedNode = null;
    }

    addNonagon(nonagon) {
        this.nonagons[nonagon.ID] = nonagon;
    }

    removeNonagon(nonagon) {
        delete this.nonagons[nonagon.ID];
    }

    setSelected(node) {
        this.deselectAllNonagons();

        node.setSelected();
        if (this.nonagons[node.ID]) {
            console.log('current selected node: ', node.ID);
            this.currentSelectedNode = node;
        }

        window.NS.singletons.CanvasNode.onNodeDeselect();
        
    }

    deselectAllNonagons(filteredNonagons) {
        this.currentSelectedNode = null;
        if (filteredNonagons) {
            for (let i = 0; i < filteredNonagons.length; i++) {
                filteredNonagons[i].setNotSelected();
            }
            return;
        }
        
        const keys = Object.keys(this.nonagons);

        keys.forEach(t => {
            this.nonagons[t].setNotSelected();
        });
    }
}