import { updateDrawing } from '../../backend/set';

const getConnPossibleIDs = (atomOneID, atomTwoID) => {
    const possOne = `${atomOneID}-${atomTwoID}`;
    const possTwo = `${atomTwoID}-${atomOneID}`;

    return { possOne, possTwo };
}

const getExistingConnections = (connections, atomOneID, atomTwoID) => {
    const { possOne, possTwo } = getConnPossibleIDs(atomOneID, atomTwoID);
    const existingConnections = [];
    if (connections[possOne]) {
        existingConnections.push(possOne);
    }

    if (connections[possTwo]) {
        existingConnections.push(possTwo);
    }

    return existingConnections;
}

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
}

export default class AtomConnectionsManager{
    constructor(backendData) {
        this.connections = {};

        const { atomConnections } = backendData;
        if (atomConnections) {
            Object.keys(atomConnections).forEach(t => {
                const conn = atomConnections[t];
                this.connections[t] = [conn[0], conn[1]];
            });
        }
    }

    addConnection(atomOneID, atomTwoID) {
        this.removeConnection(atomOneID, atomTwoID);
        const { possOne: connID } = getConnPossibleIDs(atomOneID, atomTwoID);
        
        const conn = [atomOneID, atomTwoID];
        this.connections[connID] = conn;

        updateAtomConnections(this.connections);
    }

    removeConnection(atomOneID, atomTwoID) {
        const existingConnections = getExistingConnections(this.connections, atomOneID, atomTwoID);
        existingConnections.forEach(t => delete this.connections[t]);

        if (existingConnections.length > 0) {
            updateAtomConnections(this.connections);
        }   
    }
}