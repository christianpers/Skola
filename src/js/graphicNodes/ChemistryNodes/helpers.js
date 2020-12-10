import { updateNode } from '../../backend/set';

export const PERIODIC_SCHEME = Object.freeze({
    1: 'H',
    2: 'He',
    3: 'Li',
    4: 'Be',
    5: 'B',
    6: 'C',
    7: 'N',
    8: 'O',
    9: 'F',
    10: 'Ne',
    11: 'Na',
    12: 'Mg',
    13: 'Al',
    14: 'Si',
    15: 'P',
    16: 'S',
    17: 'Cl',
    18: 'Ar',
    19: 'K',
    20: 'Ca',
    21: 'Sc',
});

export const isElectron = (object) => {
    return object.name === 'electron';
}

export const isMainAtom = (object) => {
    return object.name === 'mainAtomGroup';
}

export const isNodeIDAtom = (object, nodeID) => {
    return object.userData && object.userData.nodeID === nodeID;
}

export const resetElectronAndRing = (atomId, posKey) => {
    const modifierNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(atomId, 'electrons');

    const atom = window.NS.singletons.ConnectionsManager.getNode(atomId);
    const orbital = atom.outerRing.getOrbitalFromPositionKey(posKey);
    orbital.positions.forEach(t => {
        const electronToReset = modifierNode.getElectronByPositionKeyAndRingIndex(parseInt(t), atom.outerRing.index);
        if (electronToReset) {
            electronToReset.overrideConnectionAngle = undefined;
            electronToReset.orbitalConnected = false;

            const ring = atom.rings[electronToReset.getRingIndex()];
            const electronPos = ring.getConnectedElectronPosition(atom.position, electronToReset.ringPositionKey, electronToReset.overrideConnectionAngle);

            electronToReset.mesh.position.set(electronPos.x, electronPos.y, 0);
        }
    });

    atom.outerRing.markPositionAsAvailable(posKey);
};

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

// USE TO GET INITIAL POSITIONS FOR NEUTRONS AND PROTONS
export const getProtonsNeutronsPositions = () => {
    const ret = {};
    let index = 0;

    const rings = [4, 10, 16, 24];
    const startRadius = 0.8;
    const radiusIncrease = 1.1;

    for (let i = 0; i < rings.length; i++) {
        const radius = startRadius + radiusIncrease * i;
        const angleIncrease = 360 / rings[i];
        for (let q = 0; q < rings[i]; q++) {
            const angle = angleIncrease * q;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);

            const pos = new THREE.Vector2(x, y);
            const obj = {
                pos,
                type: index % 2 === 0 ? 'protons' : 'neutrons',
            };
            const id = `${i}-${q}`;
            ret[id] = obj;
            index++;
        }
    }
    return ret;
}

export const createProtonsNeutronsMesh = (parentMesh, material, pos) => {
    const geometry = new THREE.SphereGeometry(0.5, 10, 10);
    // const material = new THREE.MeshBasicMaterial( { color } );
    const mesh = new THREE.Mesh(geometry, material);
    // mesh.name = type;

    const z = 0;

    mesh.position.set(pos.x, pos.y, z);

    parentMesh.add(mesh);
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
        if (currentAmountRemaining >= 0) {
            amountRings++;
        }
        currentAmountRemaining -= amountInRing;
    });

    if (amount > 0 && amountRings === 0) {
        amountRings = 1;
    }

    return amountRings;
}

const updateProtonsNeuronsMeshType = (group, paramKey, meshGroup) => {
    const meshToRemove = group.getObjectByName(paramKey);
    if (meshToRemove) {
        group.remove(meshToRemove);
    }

    group.add(meshGroup);
};

const updateElectronsMeshType = (group, paramKey, meshGroup, initRingConnections, electrons, visibleRings, atomPosition) => {
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
                    const electronObj = electrons[childToConnect.userData.ID];
                    const ringObj = visibleRings[ringIndex];
                    const { key, pos, orbitalAngle } = ringObj.getAvailableElectronPosition(atomPosition);
                    electronObj.ringPositionKey = key;
                    electronObj.orbitalAngle = orbitalAngle;
                    ringObj.markPositionAsTaken(key);

                    childToConnect.position.x = pos.x;
                    childToConnect.position.y = pos.y;
                    
                    electronObj.setConnectionStatus(ringIndex);
                }
            }
            meshChildOffset += amountElectronsInRing;
        });
    }
};

export const updateMeshTypeMapper = {
    'electrons': updateElectronsMeshType,
    'protons': updateProtonsNeuronsMeshType,
    'neutrons': updateProtonsNeuronsMeshType,
};

export const getCurrentElectronConnections = (connectedElectrons) => {
    return connectedElectrons.reduce((connections, t) => {
        const ringIndex = t.getRingIndex();
        if (connections[ringIndex]) {
            connections[ringIndex]++;
        } else {
            connections[ringIndex] = 1;
        }
        return connections;
    }, {});
}

export const syncConnectedElectrons = (nodeID, connectedElectrons) => {
    const connections = getCurrentElectronConnections(connectedElectrons);
    
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

export const syncAtomPos = (nodeID, pos) => {
    updateNode({
        visualPos: pos,
    }, nodeID, true)
    .then(() => {
    })
    .catch(() => {
        console.log('error updating node');
    });
}

export const rotatePoint = (cx, cy, x, y, angle) => {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const nx = (cos * (x - cx)) - (sin * (y - cy)) + cx;
    const ny = (cos * (y - cy)) + (sin * (x - cx)) + cy;
    return { x: nx, y: ny };
}

export const getAngle = (pos1, pos2) => {
    const diffX = pos1.x - pos2.x;
    const diffY = pos1.y - pos2.y;
    return Math.atan2(diffY, diffX);
};

export const invertAngle = (radian) => {
  return (radian + Math.PI) % (2 * Math.PI);
};

export const getPointOnRingRadius = (centerPoint, angle, radius) => {
    const x = centerPoint.x + radius * Math.cos(angle);
    const y = centerPoint.y + radius * Math.sin(angle);

    return new THREE.Vector2(x, y);
};

export const getPointOnRing = (centerPoint, ring, angle) => {
    const x = centerPoint.x + ring.mesh.position.x + ring.radius * Math.cos(angle);
    const y = centerPoint.y + ring.mesh.position.y + ring.radius * Math.sin(angle);

    return new THREE.Vector2(x, y);
};

export const getDebugPointOnRing = (objectPos, ring, angle) => {
    const x = ring.mesh.position.x + ring.radius * Math.cos(angle);
    const y = ring.mesh.position.y + ring.radius * Math.sin(angle);

    return new THREE.Vector2(x, y);
};


/* BEZIER HELPERS */

const cubicBezier = (p1, p2, p3, p4, t) => {
    const x1 = Math.pow(1-t, 3) * p1.x;
    const x2 = 3 * Math.pow(1-t, 2) * t * p2.x;
    const x3 = 3 * (1-t) * Math.pow(t, 2) * p3.x;
    const x4 = Math.pow(t, 3) * p4.x;

    const y1 = Math.pow(1-t, 3) * p1.y;
    const y2 = 3 * Math.pow(1-t, 2) * t * p2.y;
    const y3 = 3 * (1-t) * Math.pow(t, 2) * p3.y;
    const y4 = Math.pow(t, 3) * p4.y;

    const x = x1 + x2 + x3 + x4;
    const y = y1 + y2 + y3 + y4;
    return { x, y };
}

const getPoints = (detail, centerX, centerY, sizeX, sizeY, reverse) => {
    const points= [];
    const p1 = {x: centerX - sizeX, y: centerY - 0};
    const p2 = {x: centerX - sizeX, y: centerY - (0.552 * sizeY) };
    const p3 = {x: centerX - (0.552 * sizeX), y: centerY - sizeY};
    const p4 = {x: centerX - 0, y: centerY - sizeY};
    if (reverse) {
        for (let i = detail; i >= 0; i--) {
            const t = i / detail;
            const point = cubicBezier(p1, p2, p3, p4, t);
            points.push(point);
        }
    } else {
        for (let i = 0; i <= detail; i++) {
            const t = i / detail;
            const point = cubicBezier(p1, p2, p3, p4, t);
            points.push(point);
        }
    }

    return points;
}

export const getCircle = (detail, centerX, centerY, sizeX, sizeY) => {
    const points0 = getPoints(detail, centerX, centerY, -sizeX, sizeY);
    const points1 = getPoints(detail, centerX, centerY, sizeX, sizeY, true);
    const points2 = getPoints(detail, centerX, centerY, sizeX, -sizeY);
    const points3 = getPoints(detail, centerX, centerY, -sizeX, -sizeY, true);

    return [
        ...points1, ...points2, ...points3, ...points0,
    ];
}

export const getDoubleCircle = (rotateOrigin, rotateAngle, detail, centerX, centerY, sizeX, sizeY) => {
    const offset = 0;
    const secOffset = sizeX * 2 + offset;

    const points0 = getPoints(detail, centerX + secOffset, centerY, sizeX, sizeY); //top left right
    const points1 = getPoints(detail, centerX + offset, centerY, sizeX, sizeY, true); //top left left
    const points2 = getPoints(detail, centerX + offset, centerY, sizeX, -sizeY); //bottm left left
    const points3 = getPoints(detail, centerX + offset, centerY, -sizeX, -sizeY, true); // bottom left right

    const points4 = getPoints(detail, centerX + secOffset, centerY, -sizeX, sizeY, true); // top right right
    const points5 = getPoints(detail, centerX + offset, centerY, -sizeX, sizeY); // top right left
    const points6 = getPoints(detail, centerX + secOffset, centerY, sizeX, -sizeY, true); // bottom right left
    const points7 = getPoints(detail, centerX + secOffset, centerY, -sizeX, -sizeY); 

    const points = [
        ...points1, ...points2, ...points3, ...points0,
        ...points4, ...points7, ...points6,  ...points5,
    ];

    const ret = [];
    points.forEach(t => {
        const rpoint = rotatePoint(rotateOrigin.x, rotateOrigin.y, t.x, t.y, rotateAngle);
        ret.push(rpoint);
    });

    return ret;
}


