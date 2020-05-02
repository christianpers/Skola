const db = firebase.firestore();

export const createDrawing = (data) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return window.NS.singletons.refs.getUserRef().collection('Drawings').add(saveData);
};

/* Use for updating title on drawing */
export const updateDrawing = (data) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return window.NS.singletons.refs.getDrawingRef().update(saveData);
}

export const createNode = (data) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return window.NS.singletons.refs.getDrawingRef().collection('Nodes').add(saveData);
};

export const updateNode = (data, id, forceWriteToBackend) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    
    if (!forceWriteToBackend) {
        window.NS.singletons.StatusWindow.addEvent({id, saveData});
        return new Promise((resolve) => {
            resolve();
        });
    } else {
        const ref = window.NS.singletons.refs.getNodeRef(id);
        if (ref) {
            return ref.update(saveData);
        } else {
            console.log('didnt find ref on update');
            return Promise.reject(new Error('didnt find ref on update'));
        }   
    }
};

export const deleteNode = (id) => {
    return window.NS.singletons.refs.getDrawingRef().collection('Nodes').doc(id).delete();
};

export const setDrawingFromRef = (ref, data) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return ref.set(saveData);
};

export const updateDrawingFromRef = (ref, data) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return ref.update(saveData);
};

export const createGroup = (data) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return window.NS.singletons.refs.getDrawingRef().collection('Groups').add(saveData);
};

export const deleteGroup = (id) => {
    return window.NS.singletons.refs.getDrawingRef().collection('Groups').doc(id).delete();
};

export const updateGroup = (data, id, forceWriteToBackend) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    
    if (!forceWriteToBackend) {
        window.NS.singletons.StatusWindow.addEvent({id, saveData});
        return new Promise((resolve) => {
            resolve();
        });
    } else {
        const ref = window.NS.singletons.refs.getGroupRef(id);
        if (ref) {
            return ref.update(saveData);
        } else {
            console.log('didnt find ref on update');
            return Promise.reject(new Error('didnt find ref on update'));
        }
        
    }
};

export const copyDrawingToGeneric = (data) => {
    const genericDrawingsRef = db.collection("GenericDrawings");
    const refs = { drawing: null, nodes: {}, groups: {} };

    const createGenericDrawing = (dataIn) => {
        const saveData = Object.assign({}, dataIn, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        return genericDrawingsRef.add(saveData);
    };

    const createNode = (id, dataIn) => {
        const saveData = Object.assign({}, dataIn, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        // return refs.drawing.collection('Nodes').add(saveData);
        return refs.drawing.collection('Nodes').doc(id).set(saveData);
    };

    const createAllNodes = (dataIn) => {
        const promises = [];
        dataIn.nodes.forEach(t => {
            promises.push(createNode(t.id, t.data));
        });

        return Promise.all(promises);
    }

    

    const createGroup = (id, dataIn) => {
        const saveData = Object.assign({}, dataIn, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        return refs.drawing.collection('Groups').doc(id).set(saveData);
    };

    const createAllGroups = (dataIn) => {
        const promises = [];
        dataIn.groups.forEach(t => {
            promises.push(createGroup(t.id, t.data));
        });

        return Promise.all(promises);
    }

    return new Promise((resolve, reject) => {
        createGenericDrawing(data.drawing.doc)
            .then((ref) => {
                console.log('drawing created');
                refs.drawing = ref;
                return createAllNodes(data);
                // resolve();
            })
            .then(() => {
                return createAllGroups(data);
                
            })
            .then(() => {
                resolve();
            })
            .catch((err) => {
                console.log('err: ', err);
                reject(err);
            });
    })
}

export const createDrawingFromGeneric = (data) => {
    const refs = { drawing: null, nodes: {}, groups: {} };

    const createNode = (id, dataIn) => {
        const saveData = Object.assign({}, dataIn, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        return refs.drawing.collection('Nodes').doc(id).set(saveData);
    };

    const createAllNodes = (dataIn) => {
        const promises = [];
        dataIn.nodes.forEach(t => {
            promises.push(createNode(t.id, t.data));
        });

        return Promise.all(promises);
    }

    const createGroup = (id, dataIn) => {
        const saveData = Object.assign({}, dataIn, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
        return refs.drawing.collection('Groups').doc(id).set(saveData);
    };

    const createAllGroups = (dataIn) => {
        const promises = [];
        dataIn.groups.forEach(t => {
            promises.push(createGroup(t.id, t.data));
        });

        return Promise.all(promises);
    }

    return new Promise((resolve, reject) => {
        createDrawing(data.drawing.doc)
            .then((ref) => {
                console.log('drawing created');
                refs.drawing = ref;
                return createAllNodes(data);
                // resolve();
            })
            .then(() => {
                return createAllGroups(data);
                
            })
            .then(() => {
                resolve(refs.drawing);
            })
            .catch((err) => {
                console.log('err: ', err);
                reject(err);
            });
    })
}

