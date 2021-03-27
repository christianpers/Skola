const db = firebase.firestore();

export const getNodeRef = (id) => {
    return window.NS.singletons.refs.getDrawingRef().collection('Nodes').doc(id);
};

export const getGroupRef = (id) => {
    return window.NS.singletons.refs.getDrawingRef().collection('Groups').doc(id);
};

export const getDrawingRef = (id) => {
    return window.NS.singletons.refs.getUserRef().collection('Drawings').doc(id);
};

export const getGenericDrawingRef = (id) => {
    return db.collection("GenericDrawings").doc(id);
};

export const getDrawingsCollectionRef = () => {
    const userRef = window.NS.singletons.refs.getUserRef();
    if (userRef) {
        return userRef.collection("Drawings");
    }

    return undefined;
}

export const getGenericDrawingsCollectionRef = () => {
    return db.collection("GenericDrawings");
}

export const getData = (drawings, collectionRef) => {
    const ret = { nodes: [], groups: [], drawings };
    return new Promise((resolve, reject) => {
        getAllNodesFromAllDrawings(drawings, collectionRef)
            .then((resp) => {
                ret.nodes = resp;

                return getAllGroupsFromAllDrawings(drawings, collectionRef);
            })
            .then((resp) => {
                ret.groups = resp;
                resolve(ret);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export const getAllNodesFromAllDrawings = (drawings, collection) => {
    const promises = [];
    const keys = Object.keys(drawings);
    keys.forEach((t) => {
        promises.push(getNodes(t, collection));
    });

    return Promise.all(promises);
};

export const getNodes = (drawingId, collection) => {
    return new Promise((resolve, reject) => {
        const userRef = window.NS.singletons.refs.getUserRef();
        // const hasNodesRef = window.NS.singletons.refs.hasNodesRef();
        // const nodesRef = userRef.collection("Drawings").doc(drawingId).collection('Nodes');

        const nodesRef = collection.doc(drawingId).collection('Nodes');
        
        // if (!hasNodesRef) {
        //     window.NS.singletons.refs.setNodesRef(nodesRef);
        // }


        nodesRef.get().then(function(querySnapshot) {
            const respArr = {};
            respArr[drawingId] = [];
            querySnapshot.forEach(function(doc) {
                // respArr.push({ref: doc, data: doc.data()});
                respArr[drawingId].push({id: doc.id, data: doc.data()});
            });

            resolve(respArr);
        }).catch((err) => {
            reject(err);
        });
    });
};

export const getAllGroupsFromAllDrawings = (drawings, collection) => {
    const promises = [];
    const keys = Object.keys(drawings);
    keys.forEach((t) => {
        promises.push(getGroups(t, collection));
    });

    return Promise.all(promises);
};

export const getGroups = (drawingId, collection) => {
    return new Promise((resolve, reject) => {
        const userRef = window.NS.singletons.refs.getUserRef();
        // const groupsRef = userRef.collection("Drawings").doc(drawingId).collection('Groups');
        const groupsRef = collection.doc(drawingId).collection('Groups');
        
        
        // if (!hasNodesRef) {
        //     window.NS.singletons.refs.setNodesRef(nodesRef);
        // }


        groupsRef.get().then(function(querySnapshot) {
            const respArr = {};
            respArr[drawingId] = [];
            querySnapshot.forEach(function(doc) {
                // respArr.push({ref: doc, data: doc.data()});
                respArr[drawingId].push({id: doc.id, data: doc.data()});
            });

            resolve(respArr);
        }).catch((err) => {
            reject(err);
        });
    });
};

export const getGenericDrawings = (username) => {
    return new Promise((resolve, reject) => {
        // const hasUserRef = window.NS.singletons.refs.hasUserRef();
        // const userRef = hasUserRef ? window.NS.singletons.refs.getUserRef() : db.collection("Users").doc(username);

        // const drawingsRef = userRef.collection("Drawings");
        const drawingsRef = db.collection("GenericDrawings");
        
        drawingsRef.get().then(function(querySnapshot) {
            const respArr = {};
            querySnapshot.forEach(function(doc) {
                const path = doc.ref.path;
                respArr[doc.id] = {doc: doc.data(), path};
            });

            resolve(respArr);
        }).catch((err) => {
            reject(err);
        });
    });
};

export const getSingleDrawing = (username, drawingId) => {
    const getForSingle = (drawingRef, collectionType) => {
        return new Promise((resolve, reject) => {
            const nodesRef = drawingRef.collection(collectionType);
            nodesRef.get().then(function(querySnapshot) {
                const ret = [];
                querySnapshot.forEach(function(doc) {
                    // respArr.push({ref: doc, data: doc.data()});
                    ret.push({id: doc.id, data: doc.data()});
                });

                resolve(ret);
            }).catch((err) => {
                reject(err);
            });
        });
    };
    return new Promise((resolve, reject) => {
        const hasUserRef = window.NS.singletons.refs.hasUserRef();
        const userRef = hasUserRef ? window.NS.singletons.refs.getUserRef() : db.collection("Users").doc(username);

        const drawingRef = userRef.collection("Drawings").doc(drawingId);
        if (!drawingRef) {
            resolve(undefined);
        }

        const ret = {
            drawing: {},
            nodes: [],
            groups: []
        };

        
        drawingRef.get().then(doc => {
            if (doc.exists) {
                //This is only done cause object stupidly formatted from the beginning
                ret.drawing = {
                    doc: doc.data()
                };
                const promises = [getForSingle(drawingRef, 'Nodes'), getForSingle(drawingRef, 'Groups')];
                return Promise.all(promises);
            } else {
                resolve(undefined);
            }
        }).then(resp => {
            const [nodes, groups] = resp;
            ret.nodes = nodes;
            ret.groups = groups;
            resolve(ret);

        }).catch(err => {
            reject(err);
        });
    })
}

export const getDrawings = (username) => {
    return new Promise((resolve, reject) => {
        const hasUserRef = window.NS.singletons.refs.hasUserRef();
        const userRef = hasUserRef ? window.NS.singletons.refs.getUserRef() : db.collection("Users").doc(username);

        const drawingsRef = userRef.collection("Drawings");
        
        drawingsRef.get().then(function(querySnapshot) {
            const respArr = {};
            querySnapshot.forEach(function(doc) {
                const path = doc.ref.path;
                respArr[doc.id] = {doc: doc.data(), path};
            });

            resolve(respArr);
        }).catch((err) => {
            reject(err);
        });
    });
};

export const getUserData = () => {
    return new Promise((resolve, reject) => {
        const userRef = window.NS.singletons.refs.getUserRef();

        userRef.get().then(doc => {
            if (doc.exists) {
                resolve(doc.data());
            }

            resolve(undefined);
        }).catch(err => {
            reject(err);
        });
    });
}

export const checkUserExists = (username) => {
    return new Promise((resolve, reject) => {
        const hasUserRef = window.NS.singletons.refs.hasUserRef();
        const userRef = hasUserRef ? window.NS.singletons.refs.getUserRef() : db.collection("Users").doc(username);
        if (!hasUserRef) {
            console.log('set user ref', userRef);
            window.NS.singletons.refs.setUserRef(userRef);
        }
        userRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc, '  ', doc.data());
                resolve(true);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                userRef.set({ username });
                resolve(false);
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            reject();
        });
    });
}

export const checkDrawingExists = (drawingId) => {
    return new Promise((resolve, reject) => {
        const drawingRef = window.NS.singletons.refs.getUserRef().collection("Drawings").doc(drawingId);
        drawingRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc, '  ', doc.data());
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            reject();
        });
    });
}