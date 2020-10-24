import {
	isElectron,
	isMainAtom,
    getAngle,
	invertAngle,
	getPointOnRing,
    getPointOnRingRadius,
} from './helpers';

import AnimateObject from './AnimateObject';
import AnimateAlongCircle from './AnimateAlongCircle';

export const onElectronDragEnd = (ringToReleaseOn, electronObj, visibleRings, position, object) => {
	if (ringToReleaseOn) {
        // getAvailableElectronPosition sets position as taken if it returns key
        const { key, pos, orbitalAngle } = ringToReleaseOn.getAvailableElectronPosition(position);
        if (key) {
            electronObj.setConnectionStatus(ringToReleaseOn.index, key);
            electronObj.ringPositionKey = key;
            electronObj.orbitalAngle = orbitalAngle;

            const animateObj = new AnimateObject(object, pos);

            ringToReleaseOn.setDefault();
        }
    } else {
        const ring = visibleRings[electronObj.getRingIndex()];
        if (ring) {
            ring.markPositionAsAvailable(electronObj.ringPositionKey);
        }
        electronObj.ringPositionKey = null;
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

        if (currentObj.dist < 1) {
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

    console.log('dragdata: ', dragData);

    const draggingAtomOrbital = draggingAtomHasOrbitalWithCorrectAngle(notCompleteOrbitals, closestOrbital.orbital.angle);

    console.log('dragging orbital: ', draggingAtomOrbital, ' closest orbital: ', closestOrbital);

    if (draggingAtomOrbital) {
        const closestObj = {
            positionKey: closestOrbital.connectingPositionKey,
            outerRing: closestOrbital.atom.outerRing,
        };
        //set connecting atom position as taken
        closestObj.outerRing.markPositionAsTaken(closestObj.positionKey);

        //set dragging atom position as taken
        outerRing.markPositionAsTaken(draggingAtomOrbital.availablePositionKey);

        // do connection
        const connectionRadian = invertAngle(closestOrbital.orbital.angleRadian);
        const connectionAngle = connectionRadian * (180 / Math.PI);
        if (draggingAtomOrbital.orbital.angle !== connectionAngle) {
            const electronToMove = connectedElectrons.find(t => Number(t.getRingIndex()) === outerRing.index && t.orbitalAngle === draggingAtomOrbital.orbital.angle);
            const animateObj = new AnimateAlongCircle(electronToMove.mesh, draggingAtomOrbital.orbital.angle, connectionAngle, outerRing.radius, position);
        }
        // send in position key to connection to be able set as available on disconnect
        window.NS.singletons.LessonManager.atomConnectionsManager.addConnection(
            ID,
            closestOrbital.atom.ID,
            draggingAtomOrbital.orbital.angle,
            closestOrbital.orbital.angle,
            draggingAtomOrbital.availablePositionKey,
            closestObj.positionKey
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

            atom.debugMesh.position.x = dockingPoint.x;
            atom.debugMesh.position.y = dockingPoint.y;
        });
    });

    draggingAtomData.connectedElectrons.forEach(t => {
        const ring = rings[t.getRingIndex()];
        const pos = ring.getConnectedElectronPosition(object.position, t.ringPositionKey);

        t.mesh.position.x = pos.x;
        t.mesh.position.y = pos.y;
    });

    draggingAtomData.connectedAtoms.forEach(t => {
        const getConnObj = (connectionObj) => {
            const ret = {};
            if (connectionObj.dragAtom.id !== ID) {
                ret.connectingAngleObj = {
                    ...connectionObj.connectingAtom,
                };
                ret.radiusObj = {
                    ...connectionObj.dragAtom,
                };
                return ret;
            }

            ret.connectingAngleObj = {
                ...connectionObj.dragAtom,
            };
            ret.radiusObj = {
                ...connectionObj.connectingAtom,
            };
            return ret;
        };
        const connObj = getConnObj(t);

        const connectingAngleAtom = window.NS.singletons.ConnectionsManager.getNode(connObj.connectingAngleObj.id);
        const connectingAngleOrbital = connectingAngleAtom.outerRing.getOrbitalForAngle(connObj.connectingAngleObj.orbitalAngle);
        const targetRadian = connectingAngleOrbital.angleRadian;

        const radiusAtom = window.NS.singletons.ConnectionsManager.getNode(connObj.radiusObj.id);
        const radiusOrbital = radiusAtom.outerRing.getOrbitalForAngle(connObj.radiusObj.orbitalAngle);

        const dockingRadius = radiusOrbital.radius + dragAtomOuterRing.radius;
        const dockingPoint = getPointOnRingRadius(object.position, targetRadian, dockingRadius);
        
        // const atom = window.NS.singletons.ConnectionsManager.getNode(connObj.id);
        // const orbital = atom.outerRing.getOrbitalForAngle(connObj.connectingAngle);
        // const centerPos = object.position;

        console.log('angle: ', connObj);

        // const targetRadian = orbital.angleRadian; // not gonna work if connecting angle moved
        // const dockingRadius = orbital.radius + dragAtomOuterRing.radius;
        // const dockingPoint = getPointOnRingRadius(centerPos, targetRadian, dockingRadius);
        radiusAtom.position = dockingPoint;


    });

    return ret;
}


export const getStartDragDataAtom = (object, ID, type, atomPosition, outerRing) => {
    const { atomRulesManager } = window.NS.singletons.LessonManager;

    const ret = {
        isConnected: window.NS.singletons.LessonManager.atomConnectionsManager.hasConnections(ID),
    };

    const getAtomInitData = (ID) => {
        const { notCompleteOrbitals, connectedElectrons } = atomRulesManager.getNotCompleteOrbitals(ID);
        
        return {
            notCompleteOrbitals,
            connectedElectrons, // electrons connected to the rings of the atom
        };
    }
    

    const draggingAtomInfo = getAtomInitData(ID);
    const connectedAtoms = window.NS.singletons.LessonManager.atomConnectionsManager.findConnections(ID).map(t => window.NS.singletons.LessonManager.atomConnectionsManager.getConnection(t));
    draggingAtomInfo.connectedAtoms = connectedAtoms;

    /* have to add the electrons on the connected atoms aswell.. but have to adjust with connecting angle if electron moved angle on connection 
        filter out ID from connected atoms and loop and get the connected electrons.. but have to adjust somewhere to get correct angle
    
    */

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
