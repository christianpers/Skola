export default class ModifierCollisionManager{
    constructor() {
        this.activeModifier = undefined;
        this.nonagons = [];

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
        for (let i=0; i < this.nonagons.length; i++) {
            const nonagonPos = this.nonagons[i].getPos();
            const modifierPos = this.activeModifier.getPos();
            const dist = nonagonPos.distanceTo(modifierPos);
            
            if (dist < 160) {
                this.nonagons[i].setSelected();
            } else {
                this.nonagons[i].setNotSelected();
            }
        }
    }

    onModifierDragStart(activeModifier, e) {
        console.log('active modifier', activeModifier);
        this.activeModifier = activeModifier;
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

        if (!this.currentCloseParamContainer) {
            for (let i=0; i < this.nonagons.length; i++) {
                const paramContainers = this.nonagons[i].getParamContainers();
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
                // this.el.style.transform = `rotate(${(this.index) * 40}deg)`;
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