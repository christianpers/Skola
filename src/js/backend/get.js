const db = firebase.firestore();

export const getNodeRef = (id) => {
    return window.NS.singletons.refs.getDrawingRef().collection('Nodes').doc(id);
};

export const getDrawingRef = (id) => {
    return window.NS.singletons.refs.getUserRef().collection('Drawings').doc(id);
};

export const getAllNodesFromAllDrawings = (drawings) => {
    const promises = [];
    const keys = Object.keys(drawings);
    keys.forEach((t) => {
        promises.push(getNodes(t));
    });

    return Promise.all(promises);
};

export const getNodes = (drawingId) => {
    return new Promise((resolve, reject) => {
        const userRef = window.NS.singletons.refs.getUserRef();
        // const hasNodesRef = window.NS.singletons.refs.hasNodesRef();
        const nodesRef = userRef.collection("Drawings").doc(drawingId).collection('Nodes');
        
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

export const getDrawings = (username) => {
    return new Promise((resolve, reject) => {
        const hasUserRef = window.NS.singletons.refs.hasUserRef();
        const userRef = hasUserRef ? window.NS.singletons.refs.getUserRef() : db.collection("Users").doc(username);

        const drawingsRef = userRef.collection("Drawings");
        
        drawingsRef.get().then(function(querySnapshot) {
            const respArr = {};
            querySnapshot.forEach(function(doc) {
                // respArr.push({ref: doc, data: doc.data()});
                respArr[doc.id] = doc.data();
            });

            resolve(respArr);
        }).catch((err) => {
            reject(err);
        });
    });
};

export const checkUserExists = (username) => {
    return new Promise((resolve, reject) => {
        const hasUserRef = window.NS.singletons.refs.hasUserRef();
        const userRef = hasUserRef ? window.NS.singletons.refs.getUserRef() : db.collection("Users").doc(username);
        if (!hasUserRef) {
            window.NS.singletons.refs.setUserRef(userRef);
        }
        userRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                resolve(true);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                resolve(false);
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
            reject();
        });
    });
}