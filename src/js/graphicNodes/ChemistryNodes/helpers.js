import { updateNode } from '../../backend/set';

export const isElectron = (object) => {
    return object.name === 'electron';
}

export const isMainAtom = (object) => {
    return object.name === 'mainAtomGroup';
}

export const isNodeIDAtom = (object, nodeID) => {
    return object.userData && object.userData.nodeID === nodeID;
}

export const isDragEvtAtom = (obj, nodeID, isNodeIDChild) => {
    if (obj.parent && !isNodeIDChild) {
        if (isNodeIDAtom(obj.parent, nodeID)) {
            return isDragEvtAtom(obj, nodeID, true);
        } else {
            return isDragEvtAtom(obj.parent, nodeID, false);
        }
    }
    return isNodeIDChild;
}

const getObj = (obj, selectedObj) => {
    if (obj.parent && !selectedObj) {
        if (isMainAtom(obj.parent)) {
            return getObj(obj, obj.parent);
        } else if (isElectron(obj)) {
            return getObj(obj, obj);
        } else {
            return getObj(obj.parent, null);
        }
    }

    return selectedObj;
}
export const getObjToMove = (intersections) => {
    if (intersections.length > 0) {
        return getObj(intersections[0].object, null);
    }
}

export const createGridSpheres = (parentMesh, nrRows = 3, amountItems, negX = false, color, offsetPos = new THREE.Vector3(), type = '', material) => {
    const amountPerRow = nrRows;
    const rows = Math.ceil(amountItems/amountPerRow);
    for (let row = 0; row < rows; row++) {
        const offsetNumPos = row * amountPerRow;
        const amountInRow = Math.min(amountItems - offsetNumPos, amountPerRow);
        const y = (row + (rows / 2) - rows) * 1.3;
        // const z = (row + (rows / 2) - rows) * 1.3;
        for (let col = 1; col <= amountInRow; col++) {
            // console.log('row: ',row, ' col: ', col, ' amount in row: ', amountInRow);
            const x = negX ? -col * 1.3 : col * 1.3;

            const geometry = new THREE.SphereGeometry(0.5, 10, 10);
            // const material = new THREE.MeshBasicMaterial( { color } );
            const mesh = new THREE.Mesh(geometry, material);
            mesh.name = type;

            const z = 0;

            const pos = new THREE.Vector3(x, y, z);
            pos.add(offsetPos);

            // console.log('x: ', x, ' y: ', y);
            mesh.position.set(pos.x, pos.y, pos.z);

            parentMesh.add(mesh);
        }
    }
}

export const getGridPositions = (nrRows = 3, amountItems, negX = false, offsetPos) => {
    const ret = [];
    const amountPerRow = nrRows;
    const rows = Math.ceil(amountItems/amountPerRow);
    for (let row = 0; row < rows; row++) {
        const offsetNumPos = row * amountPerRow;
        const amountInRow = Math.min(amountItems - offsetNumPos, amountPerRow);
        const y = (row + (rows / 2) - rows) * 1.3;
        // const z = (row + (rows / 2) - rows) * 1.3;
        for (let col = 1; col <= amountInRow; col++) {
            // console.log('row: ',row, ' col: ', col, ' amount in row: ', amountInRow);
            const x = negX ? -col * 1.3 : col * 1.3;

            const z = 0;

            const pos = new THREE.Vector3(x, y, z);
            pos.add(offsetPos);

            ret.push(pos);
        }
    }

    return ret;
}

export const getAmountRings = (amount, ringsDef) => {
    let amountRings = 0;
    let currentAmountRemaining = amount;

    Object.keys(ringsDef).forEach((t) => {
        const amountInRing = ringsDef[t].amountElectrons;
        currentAmountRemaining -= amountInRing;
        if (currentAmountRemaining >= 0) {
            amountRings++;
        }
        
    });

    return amountRings;
}

const updateProtonsNeuronsMeshType = (group, paramKey, meshGroup) => {
    const meshToRemove = group.getObjectByName(paramKey);
    if (meshToRemove) {
        group.remove(meshToRemove);
    }

    group.add(meshGroup);
};

const updateElectronsMeshType = (group, paramKey, meshGroup, initRingConnections, electrons, getCartesianPos) => {
    const meshExists = group.getObjectByName(paramKey);
    if (!meshExists) {
        group.add(meshGroup);
        const keys = Object.keys(initRingConnections);
        let meshChildOffset = 0;
        keys.forEach((ringIndex, i) => {
            const amountElectronsInRing = initRingConnections[ringIndex];
            for (let q = 0; q < amountElectronsInRing; q++) {
                const childToConnect = meshGroup.children[q + meshChildOffset];
                if (childToConnect) {
                    const angle = (q + meshChildOffset) * .3;
                    const pos = getCartesianPos(angle, ringIndex);
                    childToConnect.position.x = pos.x;
                    childToConnect.position.y = pos.y;
                    const electronObj = electrons[childToConnect.userData.ID];
                    electronObj.setConnectionStatus(ringIndex);
                    electronObj.currentAngle = angle;

                }
            }
            meshChildOffset += amountElectronsInRing;
        });
        // meshGroup.children.forEach(t => console.log(t.userData));
    }
};

export const updateMeshTypeMapper = {
    'electrons': updateElectronsMeshType,
    'protons': updateProtonsNeuronsMeshType,
    'neutrons': updateProtonsNeuronsMeshType,
};

export const updateConnectedElectrons = (nodeID, connectedElectrons) => {
    const connections = {};
    connectedElectrons.forEach(t => {
        const ringIndex = t.getRingIndex();
        if (connections[ringIndex]) {
            connections[ringIndex]++;
        } else {
            connections[ringIndex] = 1;
        }
    });
    
    updateNode({
        ringConnections: connections,
    }, nodeID, true)
    .then(() => {
        console.log('circle connections updated');
    })
    .catch(() => {
        console.log('error updating node');
    });
}

export class DragObjectsSync{
    contructor() {
        this.objects = [];
    }

    setObjects(objects, meshGroupName) {
        const currentObjects = this.objects.filter(t => t.userData.groupName !== meshGroupName);
        objects.forEach(t => t.userData.groupName = meshGroupName);

        this.objects = [...currentObjects, ...objects];
    }
}
