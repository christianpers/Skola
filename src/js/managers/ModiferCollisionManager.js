export default class ModifierCollisionManager{
    constructor(showConnectionsWindow) {
        this.activeModifier = undefined;
        this.nonagons = [];
        this.showConnectionsWindow = showConnectionsWindow;

        this.currentCloseParamContainer = undefined;

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

    onModifierDragStart(activeModifier, e) {
        this.activeModifier = activeModifier;
        clearTimeout(this.disconnectTimer);
        if (this.activeModifier.isConnected) {
            this.disconnectTimer = setTimeout(() => {
                console.log('deactivate as child');
                this.activeModifier.deactivateAsChild(e);
            }, 300);
            this.showConnectionsWindow(this.activeModifier.assignedParamContainer);
        }
    }

    onModifierDragMove() {
        if (!this.currentCloseParamContainer) {
            for (let i=0; i < this.nonagons.length; i++) {
                const paramContainers = this.nonagons[i].getParamContainers();
                for (let q = 0; q < paramContainers.length; q++) {
                    const paramContainer = paramContainers[q];
                    const paramContainerPos = paramContainer.getPos();
                    const modifierPos = this.activeModifier.getPos();
                    const dist = paramContainerPos.distanceTo(modifierPos);
                    // console.log(paramContainerPos, modifierPos);
                    
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
                // console.log((10 - dist) / 10);
                if (this.currentCloseParamContainer.isDisabledForConnection) {
                    return;
                }
                const angle = Math.min(((15 - dist) / 5), 1) * (this.currentCloseParamContainer.index * 40);
                this.activeModifier.setAngle(angle);
                // this.el.style.transform = `rotate(${(this.index) * 40}deg)`;
            }

        }
        

    }

    onModifierDragRelease() {
        clearTimeout(this.disconnectTimer);
        if (
            (this.currentCloseParamContainer && !this.currentCloseParamContainer.isDisabledForConnection)
            && this.activeModifier && !this.activeModifier.isConnected
        ) {
            console.log('activate as child');
            this.activeModifier.activateAsChild(this.currentCloseParamContainer);
        }
    }
}