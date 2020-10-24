import { updateDrawing } from '../../backend/set';

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

        // const { atomConnections } = backendData;
        // if (atomConnections) {
        //     Object.keys(atomConnections).forEach(t => {
        //         const conn = atomConnections[t];
        //         this.connections[t] = [conn[0], conn[1]];
        //     });
        // }
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
        this.connections.set(possIds[0], connectionObj);

        console.log(this.connections);

        // updateAtomConnections(this.connections);
    }

    removeConnection(connectionId) {

        this.connections.delete(connectionId);

        console.log(this.connections);
      
        // updateAtomConnections(this.connections);
    }
}