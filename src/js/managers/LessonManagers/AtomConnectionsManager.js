import { updateDrawing } from '../../backend/set';
import * as Events from '../../graphicNodes/ChemistryNodes/events';

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

        
    }

    init(backendData) {
        const { atomConnections } = backendData;
        if (atomConnections) {
            Object.keys(atomConnections).forEach(key => {
                const conn = atomConnections[key];
                this.connections.set(key, conn);

                const { id: connectingId, orbitalAngle: connectingAngle, positionKey: connectingPositionKey } = conn.connectingAtom;
                const { id: draggingId, orbitalAngle: draggingAngle, positionKey: draggingPositionKey } = conn.dragAtom;

                const draggingAtom = window.NS.singletons.ConnectionsManager.getNode(draggingId);
                const connectingAtom = window.NS.singletons.ConnectionsManager.getNode(connectingId);
                    
                const outerRing = draggingAtom.outerRing;
                outerRing.markPositionAsTaken(draggingPositionKey);

                const connectingAtomOuterRing = connectingAtom.outerRing;
                connectingAtomOuterRing.markPositionAsTaken(connectingPositionKey);

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

            const connectionUpdateEvent = new CustomEvent(Events.ON_ATOM_CONNECTION_UPDATE);
            document.documentElement.dispatchEvent(connectionUpdateEvent);
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

    getConnectionPart(atomID, connection) {
        if (connection.dragAtom.id === atomID) {
            return connection.dragAtom;
        }

        return connection.connectingAtom;
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

        this.syncConnections();

    }

    removeConnection(connectionId) {
        this.connections.delete(connectionId);
    }

    syncConnections() {
        const syncObj = {};
        for (let [key, value] of this.connections.entries()) {
            syncObj[key] = value;
        }
        updateAtomConnections(syncObj);

        const connectionUpdateEvent = new CustomEvent(Events.ON_ATOM_CONNECTION_UPDATE);
        document.documentElement.dispatchEvent(connectionUpdateEvent);
    }
}