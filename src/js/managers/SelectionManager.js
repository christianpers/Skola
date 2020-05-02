export default class SelectionManager {
    constructor() {
        this.nonagons = {};
    }

    addNonagon(nonagon) {
        this.nonagons[nonagon.ID] = nonagon;
    }

    removeNonagon(nonagon) {
        delete this.nonagons[nonagon.ID];
    }

    setSelected(nonagon) {
        this.deselectAllNonagons();

        nonagon.setSelected();
    }

    deselectAllNonagons(filteredNonagons) {
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