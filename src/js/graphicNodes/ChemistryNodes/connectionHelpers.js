import {
	isElectron,
	isMainAtom,
    getAngle,
	invertAngle,
	getPointOnRing,
    getPointOnRingRadius,
} from './helpers';

const getSiblingConnectionObj = (id, connection) => {
    const siblingConnection = connection.connectingAtom.id !== id ? connection.connectingAtom : connection.dragAtom;
    return siblingConnection;
};

const getConnections = (id) => {
    return window.NS.singletons.LessonManager.atomConnectionsManager.findConnections(id).map(t => window.NS.singletons.LessonManager.atomConnectionsManager.getConnection(t));
}

const getConnectionsWithoutId = (baseId, withoutId) => {
    return window.NS.singletons.LessonManager.atomConnectionsManager
        .findConnections(baseId)
        .filter(t => {
            const conn = window.NS.singletons.LessonManager.atomConnectionsManager.getConnection(t);
            const ids = [conn.connectingAtom.id, conn.dragAtom.id];
            return !ids.includes(withoutId);
        })
        .map(t => window.NS.singletons.LessonManager.atomConnectionsManager.getConnection(t));
};

const getConnectionObj = (basePos, connectionObj) => {
    const atom = window.NS.singletons.ConnectionsManager.getNode(connectionObj.id);
    const baseDistance = basePos.distanceTo(atom.position);
    const angle = invertAngle(getAngle(basePos, atom.position));

    let connectedElectrons = [];
    const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(connectionObj.id, 'electrons');
    if (electronsModifierNode) {
        connectedElectrons = electronsModifierNode.getConnectedElectrons();
    }

    const baseOffset = getPointOnRingRadius(basePos, angle, baseDistance);
    baseOffset.sub(basePos);

    return {
        ...connectionObj,
        baseOffset,
        connectedElectrons
    };
}

export const getFormattedConnectionObj = (dragId) => {
    const basePos = window.NS.singletons.ConnectionsManager.getNode(dragId).position;

    const loopConnections = (baseId, connections, collectedConnections) => {
        if (connections.length === 0) {
            return collectedConnections;
        } else {
            for (let i = 0; i < connections.length; i++) {
                const connection = connections[i];
                const siblingObj = getSiblingConnectionObj(baseId, connection);
                const connectionObj = getConnectionObj(basePos, siblingObj);
                collectedConnections.push(connectionObj);
                collectedConnections.concat(loopConnections(siblingObj.id, getConnectionsWithoutId(siblingObj.id, baseId), collectedConnections));
            }
            return collectedConnections;
        }
    };

    const connections = getConnections(dragId);
    return loopConnections(dragId, connections, []);
};

export const getNotCompleteOrbitals = (atomID) => {
    const atomNode = window.NS.singletons.ConnectionsManager.getNode(atomID);
    const outerRing = atomNode.outerRing;

    const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(atomID, 'electrons');
    if (electronsModifierNode) {
        const connectedElectrons = electronsModifierNode.getConnectedElectrons();

        const notCompleteOrbitals = outerRing.getNotCompleteOrbitals();
        return {
            notCompleteOrbitals,
            connectedElectrons,
        }
    }

    return {};
}