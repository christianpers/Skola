import {
	isElectron,
	isMainAtom,
    getAngle,
	invertAngle,
	getPointOnRing,
    getPointOnRingRadius,
} from './helpers';

import { getFormattedConnectionObj, getNotCompleteOrbitals } from './connectionHelpers';

import AnimateObject from './AnimateObject';
import AnimateAlongCircle from './AnimateAlongCircle';

export const onElectronDragEnd = (ringToReleaseOn, electronObj, visibleRings, position, object) => {
	if (ringToReleaseOn) {
        // getAvailableElectronPosition sets position as taken if it returns key
        const { key, pos, orbitalAngle } = ringToReleaseOn.getAvailableElectronPosition(position);
        if (key) {
            electronObj.setConnectionStatus(ringToReleaseOn.index);
            electronObj.ringPositionKey = key;
            electronObj.orbitalAngle = orbitalAngle;
            ringToReleaseOn.markPositionAsTaken(key);

            const animateObj = new AnimateObject(object, pos);

            ringToReleaseOn.setDefault();
        }
    } else {
        const ring = visibleRings[electronObj.getRingIndex()];
        if (ring) {
            ring.markPositionAsAvailable(electronObj.ringPositionKey);
        }
        electronObj.ringPositionKey = undefined;
        electronObj.orbitalAngle = undefined;
        electronObj.setConnectionStatus(-1);
    }
}

export const onAtomDragEnd = (draggingAtomInstance, connectedElectrons) => {
    const { dragData, position, outerRing, rings, ID, debugMesh } = draggingAtomInstance;
    const connectionDataKeys = Object.keys(dragData.connectionData);

    const draggingAtomHasOrbitalWithCorrectAngle = (draggingOrbitals, connectionAngle) => {
        return draggingOrbitals.find(t => ((t.orbital.angle - 180) === connectionAngle || ((t.orbital.angle + 180) === connectionAngle)) || t.orbital.allowConnectionMove );
    };

    const getClosestOrbital = () => {
        const currentObj = { dist: Number.MAX_SAFE_INTEGER, orbital: undefined };
        connectionDataKeys.forEach(t => {
            const { notCompleteOrbitals, atom } = dragData.connectionData[t];
            const centerPos = atom.position;
            notCompleteOrbitals.forEach(obj => {
                const { orbital, availablePositionKey } = obj;
                const currentDistance = orbital.currentDistance;
                orbital.resetConnecting();
                if (currentDistance < currentObj.dist) {
                    currentObj.dist = currentDistance;
                    currentObj.orbital = orbital;
                    currentObj.atom = atom;
                    currentObj.connectingPositionKey = availablePositionKey;
                }
            });
        });

        if (currentObj.dist < 2) {
            return currentObj;
        }

        return undefined;
    }
    
    const closestOrbital = getClosestOrbital();

    if (!closestOrbital) {
        return;
    }

    const dragAtomPos = position;
    const { notCompleteOrbitals } = dragData.draggingAtomData;

    const draggingAtomOrbital = draggingAtomHasOrbitalWithCorrectAngle(notCompleteOrbitals, closestOrbital.orbital.angle);

    if (draggingAtomOrbital) {
        const closestObj = {
            positionKey: closestOrbital.connectingPositionKey,
            outerRing: closestOrbital.atom.outerRing,
        };
        //set connecting atom position as taken
        closestObj.outerRing.markPositionAsTaken(closestObj.positionKey);

        //set dragging atom position as taken
        outerRing.markPositionAsTaken(draggingAtomOrbital.availablePositionKey);

        // get docking point
        const targetRadian = closestOrbital.orbital.angleRadian;
        const dockingRadius = closestOrbital.orbital.radius + outerRing.radius;
        const dockingPoint = getPointOnRingRadius(closestOrbital.atom.position, targetRadian, dockingRadius);
        draggingAtomInstance.position = dockingPoint;

        dragData.draggingAtomData.connectedElectrons.forEach(t => {
            const ring = rings[t.getRingIndex()];
            const pos = ring.getConnectedElectronPosition(dockingPoint, t.ringPositionKey, t.overrideConnectionAngle);

            t.position = pos;
        });

        // do connection
        const connectionRadian = invertAngle(closestOrbital.orbital.angleRadian);
        const connectionAngle = connectionRadian * (180 / Math.PI);
        const electronToConnect = connectedElectrons.find(t => Number(t.getRingIndex()) === outerRing.index && t.orbitalAngle === draggingAtomOrbital.orbital.angle);
        if (draggingAtomOrbital.orbital.angle !== connectionAngle) {
            
            const animateObj = new AnimateAlongCircle(electronToConnect.mesh, draggingAtomOrbital.orbital.angle, connectionAngle, outerRing.radius, dockingPoint);
            electronToConnect.overrideConnectionAngle = connectionAngle;
        }
        // send in position key to connection to be able set as available on disconnect
        window.NS.singletons.LessonManager.atomConnectionsManager.addConnection(
            ID,
            closestOrbital.atom.ID,
            draggingAtomOrbital.orbital.angle,
            closestOrbital.orbital.angle,
            draggingAtomOrbital.availablePositionKey,
            closestObj.positionKey,
        );
    }
};

export const getDraggingElectronDragData = (dragObj, visibleRings, dragData) => {
    const ret = {};
    const { centerPoint } = dragData;
    const angle = getAngle(dragObj.position, centerPoint);
    
    const visibleRingsLength = visibleRings.length;
    for (let i = 0; i < visibleRingsLength; i++) {
        const ring = visibleRings[i];

        if (ring.isFull) {
            continue;
        }

        const circlePoint = getPointOnRing(centerPoint, ring, angle);
        const dragObjVector = new THREE.Vector2(dragObj.position.x, dragObj.position.y);
        const dist = circlePoint.distanceTo(dragObjVector);

        if (dist < 1.0) {
            ret.ringToReleaseOn = ring;
            ret.releasePoint = circlePoint;
            ring.setHighlighted();
        } else {
            if (dragData.ringToReleaseOn && dragData.ringToReleaseOn.index === ring.index) {
                ret.ringToReleaseOn = null;
                ret.releasePoint = null;
            }
            ring.setDefault();
        }
    }

    // this.dragData.electronObj.currentAngle = angle;
    return ret;
};

export const getDraggingAtomDragData = (object, draggingAtomInstance) => {
    const { dragData, position, outerRing, rings, ID, debugMesh } = draggingAtomInstance;
    const ret = {};

    /* CHECk FOR DISTANCE FROM OTHER ATOMS.. */
    const connectionDataKeys = Object.keys(dragData.connectionData);
    const draggingAtomData = dragData.draggingAtomData;
    const dragAtomPos = position;
    const dragAtomOuterRing = outerRing;

    /*
        COLLECT DISTANCES FROM AVAILABLE ORBITALS
    */

    connectionDataKeys.forEach(t => {
        const { notCompleteOrbitals, atom } = dragData.connectionData[t];
        const centerPos = atom.position;
        notCompleteOrbitals.forEach(obj => {
            const { orbital, availablePositionKey } = obj;
            const targetRadian = orbital.angleRadian;
            const dockingRadius = orbital.radius + dragAtomOuterRing.radius;
            orbital.setRadius(dockingRadius);
            const dockingPoint = getPointOnRingRadius(centerPos, targetRadian, dockingRadius);
            const dist = dockingPoint.distanceTo(dragAtomPos);
            orbital.setDistance(dist);
        });
    });

    draggingAtomData.connectedElectrons.forEach(t => {
        const ring = rings[t.getRingIndex()];
        const pos = ring.getConnectedElectronPosition(object.position, t.ringPositionKey, t.overrideConnectionAngle);

        t.position = pos;
    });

    draggingAtomData.connectedAtoms.forEach(t => {
        const atom = window.NS.singletons.ConnectionsManager.getNode(t.id);
        const pos = object.position.clone().add(t.baseOffset);
        atom.position = pos;

        t.connectedElectrons.forEach(electron => {
            const ring = atom.rings[electron.getRingIndex()];
            const electronPos = ring.getConnectedElectronPosition(pos, electron.ringPositionKey, electron.overrideConnectionAngle);

            electron.mesh.position.set(electronPos.x, electronPos.y, 0);
        });
    });
    return ret;
}


export const getStartDragDataAtom = (ID, type, atomPosition, outerRing) => {
    const { atomRulesManager } = window.NS.singletons.LessonManager;

    const ret = {
        isConnected: window.NS.singletons.LessonManager.atomConnectionsManager.hasConnections(ID),
    };

    const getAtomInitData = (ID) => {
        const { notCompleteOrbitals, connectedElectrons = [] } = getNotCompleteOrbitals(ID);
        
        return {
            notCompleteOrbitals,
            connectedElectrons, // electrons connected to the rings of the atom
        };
    };
    
    const draggingAtomInfo = getAtomInitData(ID);
    draggingAtomInfo.connectedAtoms = getFormattedConnectionObj(ID);

    ret.connectedElectrons = draggingAtomInfo.connectedElectrons;
    if (draggingAtomInfo.notCompleteOrbitals && draggingAtomInfo.notCompleteOrbitals.length > 0) {
        const atomNodes = window.NS.singletons.ConnectionsManager.getNodesWithType(type, ID);
        const finalAtoms = atomNodes || [];
        const connectionData = {};
        const availAtoms = finalAtoms.forEach(t => {
            const { notCompleteOrbitals } = getAtomInitData(t.ID);
            if (notCompleteOrbitals && notCompleteOrbitals.length > 0) {
                notCompleteOrbitals.forEach(t => {
                    t.orbital.showMesh();
                });
                connectionData[t.ID] = { notCompleteOrbitals, atom: t };
            }
        });
        ret.connectionData = connectionData;
        ret.draggingAtomData = draggingAtomInfo;
    } else {
        ret.connectionData = {};
        ret.draggingAtomData = draggingAtomInfo;
    }

    return ret;
}

export const getStartDragDataElectron = (ID, atomPosition, object) => {
    const ret = {};
    const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(ID, 'electrons');
    ret.centerPoint = {};
    const electronObj = electronsModifierNode.getElectron(object.userData.ID);
    ret.electronObj = electronObj;
    
    ret.centerPoint.x = atomPosition.x;
    ret.centerPoint.y = atomPosition.y;

    return ret;
}
