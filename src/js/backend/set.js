const db = firebase.firestore();

export const createDrawing = (data) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return window.NS.singletons.refs.getUserRef().collection('Drawings').add(saveData);
};

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
        return ref.update(saveData);
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

