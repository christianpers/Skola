export default class ModifierCollisionManager{
    constructor() {
        this.activeModifier = undefined;
        this.nonagons = [];

        this.nonagonsToCheck = [];

        this.currentCloseParamContainer = undefined;
        this.currentClosestNode = undefined;

        this.onDragStartBound = this.onModifierDragStart.bind(this);
        this.onDragMoveBound = this.onModifierDragMove.bind(this);
        this.onDragReleaseBound = this.onModifierDragRelease.bind(this);

        this.disconnectTimer = -1;
    }

    addNonagon(nonagon) {
        this.nonagons.push(nonagon);
    }

    removeNonagon(nonagon) {
        this.nonagons = this.nonagons.filter(t => t.ID !== nonagon.ID);
    }

    overNonagonCheck() {
        const nonagons = this.nonagonsToCheck;
        for (let i=0; i < nonagons.length; i++) {
            const nonagonPos = nonagons[i].getPos();
            const modifierPos = this.activeModifier.getPos();
            const dist = nonagonPos.distanceTo(modifierPos);
            
            if (dist < 160) {
                console.log('over nonagon');
                // nonagons[i].setSelected();
                window.NS.singletons.SelectionManager.setSelected(nonagons[i]);
            } else {
                // nonagons[i].setNotSelected();
                // window.NS
            }
        }
    }

    onModifierDragStart(activeModifier, e) {
        this.activeModifier = activeModifier;
        this.nonagonsToCheck = this.nonagons.filter(t => (t.groupState.isInGroup && t.groupState.isShowing) || !t.groupState.isInGroup);
        for (let i = 0; i < this.nonagonsToCheck.length; i++) {
            console.log('val: ', this.nonagonsToCheck[i].nodeTitle.el.value);
        }
        this.overNonagonCheck();
    }
    

    onModifierDragMove(e, localDelta) {
        this.overNonagonCheck();

        if (this.activeModifier.isConnected) {
            if (Math.abs(localDelta.x) > 5 || Math.abs(localDelta.y) > 5) {
                this.activeModifier.deactivateAsChild(e);
            }
            return;
        }
        
        const nonagons = this.nonagonsToCheck;
        if (!this.currentCloseParamContainer) {
            for (let i=0; i < nonagons.length; i++) {
                const paramContainers = nonagons[i].getParamContainers();
                for (let q = 0; q < paramContainers.length; q++) {
                    const paramContainer = paramContainers[q];
                    const paramContainerPos = paramContainer.getPos();
                    const modifierPos = this.activeModifier.getPos();
                    const dist = paramContainerPos.distanceTo(modifierPos);
                    
                    if (dist < 15) {
                        this.currentCloseParamContainer = paramContainer;
                        return;
                    }
                }
            }
        } else {
            const paramContainerPos = this.currentCloseParamContainer.getPos();
            const modifierPos = this.activeModifier.getPos();
            const dist = paramContainerPos.distanceTo(modifierPos);
            if (dist >= 15) {
                this.currentCloseParamContainer = undefined;
                this.activeModifier.setAngle(0);
                
            } else {
                if (this.currentCloseParamContainer.isDisabledForConnection) {
                    return;
                }
                const angle = Math.min(((15 - dist) / 5), 1) * this.currentCloseParamContainer.rotation;
                this.activeModifier.setAngle(angle);
            }
        }
    }

    onModifierDragRelease() {
        if (
            (this.currentCloseParamContainer && !this.currentCloseParamContainer.isDisabledForConnection)
            && this.activeModifier && !this.activeModifier.isConnected
        ) {
            this.activeModifier.activateAsChild(this.currentCloseParamContainer, true);
        } else {

            if (this.currentClosestNode) {
                this.currentClosestNode.setNotSelected();
                this.currentClosestNode = undefined;
            }
            
        }
    }
}