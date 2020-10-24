import SelectionManager from '../SelectionManager';

export default class ChemistrySelectionManager extends SelectionManager{
    constructor() {
        super();
    }

    setSelected(node) {
        super.setSelected(node);

        if (node && this.nonagons[node.ID]) {
            const keys = Object.keys(this.nonagons);
            keys.forEach(t => {
                this.nonagons[t].enableHide();
            });
            node.disableHide();
        } else {
            const keys = Object.keys(this.nonagons);
            keys.forEach(t => {
                this.nonagons[t].disableHide();
            });
        }
    }
}