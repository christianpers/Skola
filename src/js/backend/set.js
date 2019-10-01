const db = firebase.firestore();

export const createDrawing = (data) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return window.NS.singletons.refs.getUserRef().collection('Drawings').add(saveData);
};

// export const createParamContainer = (data, nodeID) => {
//     const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
//     return window.NS.singletons.refs.getNodeRef(nodeID).collection('ParamContainers').add(saveData);
// };

export const createNode = (data) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    return window.NS.singletons.refs.getDrawingRef().collection('Nodes').add(saveData);
};

export const updateNode = (data, id) => {
    const saveData = Object.assign({}, data, { timestamp: firebase.firestore.FieldValue.serverTimestamp() });
    const ref = window.NS.singletons.refs.getNodeRef(id);
    return ref.update(saveData);
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

