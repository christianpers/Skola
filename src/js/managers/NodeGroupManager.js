import NodeGroup from '../views/NodeGroup';
import { deleteGroup } from '../backend/set';

export default class NodeGroupManager {
    constructor() {
        this.groups = {};
        this.currentActiveGroup;

        this.nonagons = [];

        this.nonagonsToCheck = [];
        this.nonagonsToCheckLength = 0;

        this.activeNonagon;
        this.overNonagon;

        this.onAddGroupToBackendBound = this.onAddGroupToBackend.bind(this);
        document.documentElement.addEventListener('add-new-group', this.onAddGroupToBackendBound);
    }

    onAddGroupToBackend(e) {
        const group = this.groups[e.detail];
        group.syncBackend()
            .then((ID) => {
                this.groups[ID] = group;
                delete this.groups[e.detail]; 
                console.log('success', this.groups);
            })
            .catch(() => {
                console.log('err');
            })
    }

    updateGroupNodeTabTitle(nodeID, title) {
        const group = this.getGroupFromNonagon(this.nonagons.find(t => t.ID === nodeID));
        if (group) {
            group.setNodeTabTitle(nodeID, title);
        }
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

    createGroup(pos, initGroupConfig, tempID) {
        if (initGroupConfig) {
            const group = new NodeGroup(null, initGroupConfig, null);
            this.groups[group.ID] = group;
            return group;
        }
        const group = new NodeGroup(pos, initGroupConfig, tempID);
        if (tempID) {
            this.groups[tempID] = group;    
        }

        
        return group;
    }

    getNonagonGroup(overNonagon) {
        // alert('get nonagon group fix !!');
        const existingGroup = this.getGroupFromNonagon(overNonagon);
        if (existingGroup) {
            console.log('return existing group', existingGroup.ID);
            return existingGroup;
        }

        console.log('create new group');
        const group = this.createGroup(overNonagon.moveCoords.offset, null, overNonagon.ID);
        // const group = new NodeGroup(overNonagon.parentEl, overNonagon.ID, overNonagon.moveCoords.offset);
        // this.groups[overNonagon.ID] = group;


        return group;
    }

    onOverNonagon(overNonagon) {
        // overNonagon.setSelected();
        // window.NS.singletons.SelectionManager.setSelected(overNonagon);
        // const nodeSelectedEvent = new CustomEvent('node-selected', { detail: overNonagon });
        // document.documentElement.dispatchEvent(nodeSelectedEvent);
        if (!this.currentActiveGroup) {
            this.currentActiveGroup = this.getNonagonGroup(overNonagon);
        }

        // this.currentActiveGroup.show();
        
        this.overNonagon = overNonagon;
    }

    overNonagonCheck() {
        
        const checkOverNonagon = () => {
            const modifierPos = this.activeNonagon.getPos();
            for (let i=0; i < this.nonagonsToCheckLength; i++) {
                const nonagonPos = this.nonagonsToCheck[i].getPos();
                const dist = nonagonPos.distanceTo(modifierPos);
                
                if (dist < 160) {
                    return this.nonagonsToCheck[i];
                }
            }
            return null;
        }

        const checkOverGroup = () => {
            const groupKeys = Object.keys(this.groups).filter(t => this.groups[t].isExpanded());
            const L = groupKeys.length;
            const modifierPos = this.activeNonagon.getPos();
            for (let i=0; i < L; i++) {
                const groupPos = this.groups[groupKeys[i]].getPos();
                
                const dist = groupPos.distanceTo(modifierPos);

                if (dist < 280) {
                    return this.groups[groupKeys[i]];
                }
            }
            return null;
        }

        const overGroup = checkOverGroup();
        if (!overGroup && this.currentActiveGroup) {
            this.currentActiveGroup.hideAddRemoveVisualHelper();
        }
        if (this.alreadyConnected && !overGroup) {
            this.alreadyConnected = false;
        }
        const overNonagon = checkOverNonagon();

        if (overNonagon) {
            this.onOverNonagon(overNonagon);
        } else if (overGroup) {
            if (this.currentActiveGroup && this.currentActiveGroup.ID !== overGroup.ID) {
                this.currentActiveGroup.hideAddRemoveVisualHelper();
            }
            this.currentActiveGroup = overGroup;
        } else {
            window.NS.singletons.SelectionManager.deselectAllNonagons(this.nonagonsToCheck);
            if (this.currentActiveGroup) {
                this.currentActiveGroup.hideAddRemoveVisualHelper();
                if (!this.currentActiveGroup.hasNonagons()) {
                    this.currentActiveGroup.delete();
                    delete this.groups[this.overNonagon.ID];
                }
                this.currentActiveGroup = null;

            }
            this.overNonagon = null;
        }
    }

    removeFromGroup(e, group, nonagon) {
        group.removeNonagon(e, nonagon);
        if (!group.hasNonagons()) {
            const ID = group.ID;
            deleteGroup(ID)
                .then(() => {
                    console.log('group deleted', ID);
                    window.NS.singletons.refs.removeGroupRef(ID);
                })
                .catch((err) => {
                    console.log('error deleting', err);
                });
            
            group.delete();
            delete this.groups[group.ID];
            this.currentActiveGroup = null;
        }
    }

    onNodeDragStart(nonagon) {
        this.currentActiveGroup = null;
        this.setActiveNonagon(nonagon);
        
        const connectedToGroup = this.getGroupFromNonagon(nonagon);
        if (connectedToGroup) {
            // FLAG TO MARK THAT ALREADY CONNECTED NONAGON TO GROUP
            // USED FOR EXAMPLE IN THAT HELPER SHOULDNT SHOW ON DISCONNECT
            this.alreadyConnected = true;
        }

        this.overNonagonCheck();
    }

    onNodeDragMove(e, nonagon, localDelta) {
        const connectedToGroup = this.getGroupFromNonagon(nonagon);
        if (connectedToGroup) {
            connectedToGroup.hideAddRemoveVisualHelper();
            if (Math.abs(localDelta.x) > 20 || Math.abs(localDelta.y) > 20) {
                this.removeFromGroup(e, connectedToGroup, nonagon);
            }
            return;
        } else {
            if (this.currentActiveGroup && !this.alreadyConnected) {
                this.currentActiveGroup.showAddHelper();
            }
        }
        this.overNonagonCheck();
    }

    onNodeDragEnd() {
        if (this.currentActiveGroup && this.activeNonagon) {
            const keys = Object.keys(this.currentActiveGroup.nonagons);
            if (keys.length === 0) {
                this.currentActiveGroup.addNonagon(this.overNonagon);
                this.currentActiveGroup.addNonagon(this.activeNonagon);
                this.currentActiveGroup.triggerAddEvent();
            } else {
                if (!this.currentActiveGroup.hasNonagon(this.activeNonagon.ID)) {
                    this.currentActiveGroup.addNonagon(this.activeNonagon);
                }
                
            }

            this.currentActiveGroup.hideAddRemoveVisualHelper();
            
        }
        this.alreadyConnected = false;
        this.currentActiveGroup = null;

        
    }
}
