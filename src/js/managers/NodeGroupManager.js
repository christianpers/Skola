import NodeGroup from '../views/NodeGroup';

export default class NodeGroupManager {
    constructor() {
        this.groups = {};
        this.currentActiveGroup;

        this.nonagons = [];

        this.nonagonsToCheck = [];
        this.nonagonsToCheckLength = 0;

        this.activeNonagon;
        this.overNonagon;
    }

    setActiveNonagon(nonagon) {
        this.activeNonagon = nonagon;

        this.nonagonsToCheck = this.nonagons.filter(t => t.ID !== this.activeNonagon.ID);
        this.nonagonsToCheckLength = this.nonagonsToCheck.length;
    }

    addNonagon(nonagon) {
        this.nonagons.push(nonagon);
    }

    removeNonagon(nonagon) {
        this.nonagons = this.nonagons.filter(t => t.ID !== nonagon.ID);
    }

    getGroupFromNonagon(nonagon) {
        const keys = Object.keys(this.groups);
        const key = keys.find(t => {
            const nonagonsInGroup = Object.keys(this.groups[t].nonagons);
            return nonagonsInGroup.includes(nonagon.ID);
        });
        return key ? this.groups[key] : null;
    }

    getNonagonGroup(overNonagon) {
        const existingGroup = this.getGroupFromNonagon(overNonagon);
        if (existingGroup) {
            console.log('return group', existingGroup.ID)
            return existingGroup;
        }

        console.log('create new group');
        const group = new NodeGroup(overNonagon.parentEl, overNonagon.ID, overNonagon.moveCoords.offset);
        this.groups[overNonagon.ID] = group;

        return group;
    }

    onOverNonagon(overNonagon) {
        overNonagon.setSelected();
        if (!this.currentActiveGroup) {
            this.currentActiveGroup = this.getNonagonGroup(overNonagon);
        }

        this.currentActiveGroup.show();
        this.overNonagon = overNonagon;
    }

    overNonagonCheck() {
        const checkOver = () => {
            for (let i=0; i < this.nonagonsToCheckLength; i++) {
                const nonagonPos = this.nonagonsToCheck[i].getPos();
                const modifierPos = this.activeNonagon.getPos();
                const dist = nonagonPos.distanceTo(modifierPos);
                
                if (dist < 160) {
                    return this.nonagonsToCheck[i];
                }
            }
            return null;
        }

        const overNonagon = checkOver();

        if (overNonagon) {
            this.onOverNonagon(overNonagon);
        } else {
            for (let i = 0; i < this.nonagonsToCheckLength; i++) {
                this.nonagonsToCheck[i].setNotSelected();
            }
            if (this.currentActiveGroup) {
                if (!this.currentActiveGroup.hasNonagons()) {
                    this.currentActiveGroup.delete();
                    delete this.groups[this.overNonagon.ID];
                    this.currentActiveGroup = null;
                }
                
                
                
            }

            this.overNonagon = null;
        }
    }

    removeFromGroup(e, group, nonagon) {
        group.removeNonagon(e, nonagon);
        if (!group.hasNonagons()) {
            group.delete();
            delete this.groups[group.ID];   
        }
    }

    onNodeDragStart(nonagon) {
        this.currentActiveGroup = null;
        this.setActiveNonagon(nonagon);
        this.overNonagonCheck();
    }

    onNodeDragMove(e, nonagon, localDelta) {
        const connectedToGroup = this.getGroupFromNonagon(nonagon);

        if (connectedToGroup) {
            if (Math.abs(localDelta.x) > 5 || Math.abs(localDelta.y) > 5) {
                this.removeFromGroup(e, connectedToGroup, nonagon);
            }
            return;
        }
        this.overNonagonCheck();
    }

    onNodeDragEnd() {
        if (this.currentActiveGroup && this.activeNonagon && this.overNonagon) {
            const keys = Object.keys(this.currentActiveGroup.nonagons);
            if (keys.length === 0) {
                this.currentActiveGroup.addNonagon(this.overNonagon);
                this.currentActiveGroup.addNonagon(this.activeNonagon);
            } else {
                this.currentActiveGroup.addNonagon(this.activeNonagon);
            }
        }

        this.currentActiveGroup = null;
    }
}
