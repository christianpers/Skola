import { updateDrawing } from '../../backend/set';

import AnimateAlongCircle from '../../graphicNodes/ChemistryNodes/AnimateAlongCircle';

import {
	invertAngle,
} from '../../graphicNodes/ChemistryNodes/helpers';

const getPossConnectionIds = (ids) => {
    return [`${ids[0]}-${ids[1]}`, `${ids[1]}-${ids[0]}`];
};

const findId = (ids, connections) => {
    const possIds = getPossConnectionIds(ids);
    const index = possIds.findIndex(t => connections.has(t));
    return possIds[index];
};

const updateAtomConnections = (atomConnections) => {
    updateDrawing({
        atomConnections,
    })
    .then(() => {
        console.log('drawing updated');
    })
    .catch(() => {
        console.log('err updating');
    });
};

export default class AtomConnectionsManager{
    constructor(backendData) {
        this.connections = new Map();

        const { atomConnections } = backendData;
        if (atomConnections) {
            Object.keys(atomConnections).forEach(key => {
                const conn = atomConnections[key];
                this.connections.set(key, conn);

                const { id: connectingId, orbitalAngle: connectingAngle } = conn.connectingAtom;
                const { id: draggingId, orbitalAngle: draggingAngle } = conn.dragAtom;

                const draggingAtom = window.NS.singletons.ConnectionsManager.getNode(draggingId);
                    
                const outerRing = draggingAtom.outerRing;

                const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(draggingId, 'electrons');
			    const connectedElectrons = electronsModifierNode.getConnectedElectrons();

                // USE THIS TO SET CORRECT ELECTRON CONNECTED POSITION IE ANGLE
                const connectionRadian = invertAngle(connectingAngle * (Math.PI / 180));
                const connectionAngle = connectionRadian * (180 / Math.PI);
                const electronToConnect = connectedElectrons.find(t => Number(t.getRingIndex()) === outerRing.index && t.orbitalAngle === draggingAngle);
                if (draggingAngle !== connectionAngle) {
                    const animateObj = new AnimateAlongCircle(electronToConnect.mesh, draggingAngle, connectionAngle, outerRing.radius, draggingAtom.position);
                    electronToConnect.overrideConnectionAngle = connectionAngle;
                }
            });
        }
    }

    getConnection(id) {
        return this.connections.get(id);
    }

    hasConnections(atomId) {
        const connections = this.findConnections(atomId);

        return connections.length > 0;
    }

    findConnections(atomId) {
        const foundConnections = [];
        for (let [key, value] of this.connections.entries()) {
            if (atomId === value.dragAtom.id || atomId === value.connectingAtom.id) {
                foundConnections.push(key);
            }
        }
        
        return foundConnections;
    }

    addConnection(dragAtomID, connectingAtomID, dragOrbitalAngle, connectingOrbitalAngle, dragAtomOrbitConnectionPositionKey, connectingAtomConnectionPositionKey) {
        const connectionObj = {
            dragAtom: { id: dragAtomID, orbitalAngle: dragOrbitalAngle, positionKey: dragAtomOrbitConnectionPositionKey },
            connectingAtom: { id: connectingAtomID, orbitalAngle: connectingOrbitalAngle, positionKey: connectingAtomConnectionPositionKey },
        };
        const possIds = getPossConnectionIds([dragAtomID, connectingAtomID]);
        if (!this.connections.has(possIds[0]) && !this.connections.has(possIds[1])) {
            this.connections.set(possIds[0], connectionObj);
        }

        console.log(this.connections);
    }

    removeConnection(connectionId) {
        this.connections.delete(connectionId);

        console.log(this.connections);
    }

    syncConnections() {
        const syncObj = {};
        for (let [key, value] of this.connections.entries()) {
            syncObj[key] = value;
        }
        updateAtomConnections(syncObj);
    }
}