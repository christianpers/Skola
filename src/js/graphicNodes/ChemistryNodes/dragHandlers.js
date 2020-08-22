import {
	isElectron,
	isMainAtom,
    getAngle,
	invertAngle,
	getPointOnRing,
} from './helpers';

import AnimateObject from './AnimateObject';

export const onElectronDragEnd = (ringToReleaseOn, electronObj, visibleRings, position, object) => {
	if (ringToReleaseOn) {
        electronObj.setConnectionStatus(ringToReleaseOn.index);
        ringToReleaseOn.addConnectedElectron(electronObj.ID);
        const electronIndexInRing = ringToReleaseOn.getElectronRingIndex(electronObj.ID);
        const pos = ringToReleaseOn.getElectronPosition(position, electronIndexInRing);

        const animateObj = new AnimateObject(object, pos);

        ringToReleaseOn.setDefault();
    } else {
        const ring = visibleRings[electronObj.getRingIndex()];
        ring.removeConnectedElectron(electronObj.ID);
        electronObj.setConnectionStatus(-1);
    }
}

export const getDraggingElectronDragData = (dragObj, visibleRings, dragData) => {
    const ret = {};
    const { centerPoint } = dragData;
    const angle = getAngle(dragObj.position, centerPoint);
    
    const visibleRingsLength = visibleRings.length;
    for (let i = 0; i < visibleRingsLength; i++) {
        const ring = visibleRings[i];

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

export const getDraggingAtomDragData = (object, dragData, position, outerRing, rings, ID) => {
    const ret = {};
    /* CHECk FOR DISTANCE FROM OTHER ATOMS.. */
    const atomsLength = dragData.atoms.length;
    const dragAtomPos = position;
    const dragAtomOuterRing = outerRing;

    for (let i = 0; i < atomsLength; i++) {
        const atom = dragData.atoms[i];
        const atomPos = atom.position;
        const atomOuterRing = atom.outerRing;
        const angle = getAngle(atomPos, dragAtomPos);
        const invertedAngle = invertAngle(angle);

        const atomRingPoint = getPointOnRing(atomPos, atomOuterRing, invertedAngle);
        const dragAtomRingPoint = getPointOnRing(dragAtomPos, dragAtomOuterRing, angle);

        // atom.debugMesh.position.x = atomRingPoint.x;
        // atom.debugMesh.position.y = atomRingPoint.y;

        // this.debugMesh.position.x = dragAtomRingPoint.x;
        // this.debugMesh.position.y = dragAtomRingPoint.y;
        
        const dist = dragAtomRingPoint.distanceTo(atomRingPoint);

        console.log('dist: ', dist);

        if (dist < 1.0) {
            const centerPoint = atom.position;
            const direction = new THREE.Vector2();
            const result = new THREE.Vector2();
            const distance = dragAtomOuterRing.radius - .1;

            direction.subVectors( atomRingPoint, centerPoint ).normalize();
            result.copy( atomRingPoint ).addScaledVector( direction, distance );
            ret.atomToConnect = atom;
            ret.releasePoint = result;

            // this.debugMesh.position.x = result.x;
            // this.debugMesh.position.y = result.y;
            atomOuterRing.setHighlighted();
        } else {
            if (dragData.atomToConnect && dragData.atomToConnect.ID === atom.ID) {
                dragData.atomToConnect = null;
                dragData.releasePoint = null;
            }
            atomOuterRing.setDefault();

            window.NS.singletons.LessonManager.atomConnectionsManager.removeConnection(ID, atom.ID);
        }
    }

    dragData.connectedElectrons.forEach(t => {
        const ring = rings[t.getRingIndex()];
        const electronIndexInRing = ring.getElectronRingIndex(t.ID);
        const pos = ring.getElectronPosition(object.position, electronIndexInRing);

        t.mesh.position.x = pos.x;
        t.mesh.position.y = pos.y;
    });

    return ret;
}

export const getStartDragData = (object, ID, type, atomPosition) => {
    const ret = {};
    const electronsModifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(ID, 'electrons');
    if (isMainAtom(object)) {
        const { atomRulesManager, ATOM_STATUS } = window.NS.singletons.LessonManager;

        const { status, connectedElectrons } = atomRulesManager.getAtomStatus(ID);
        ret.connectedElectrons = connectedElectrons;
        console.log('s: ', status);
        if (status === ATOM_STATUS.POSITIVE) {
            const atomNodes = window.NS.singletons.ConnectionsManager.getNodesWithType(type, ID);
            const finalAtomNodes = atomNodes || [];
            const positiveChargedAtoms = finalAtomNodes.filter(t => atomRulesManager.getAtomStatus(t.ID).status === ATOM_STATUS.POSITIVE);
            ret.atoms = positiveChargedAtoms;
        } else {
            ret.atoms = [];
        }
    }

    if (electronsModifierNode) {
        if (isElectron(object)) {
            ret.centerPoint = {};
            const electronObj = electronsModifierNode.getElectron(object.userData.ID);
            ret.electronObj = electronObj;
            
            ret.centerPoint.x = atomPosition.x;
            ret.centerPoint.y = atomPosition.y;
        }
    }

    return ret;
}
