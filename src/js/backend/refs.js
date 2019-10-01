export default class Refs{
    constructor() {
        this.userRef = null;
        this.drawingRef = null;
        this.nodesRef = null;
        this.paramContainerRef = {};

        this.nodesRefs = {};
    }

    hasUserRef() {
        return !!this.userRef;
    }

    setUserRef(ref) {
        this.userRef = ref;
    }

    getUserRef() {
        return this.userRef;
    }

    hasDrawingRef() {
        return !!this.drawingRef;
    }

    setDrawingRef(ref) {
        this.drawingRef = ref; 
    }

    getDrawingRef() {
        return this.drawingRef;
    }

    addNodeRef(ref) {
        this.nodesRefs[ref.id] = ref;
        console.log('add node ref, ', ref.id, this.nodesRefs);
    }

    removeNodeRef(id) {
        delete this.nodesRefs[id];
    }

    getNodeRef(id) {
        return this.nodesRefs[id];
    }

    hasNodeRef(id) {
        return !!this.nodesRefs[id];
    }

    setNodesRef(ref) {
        this.nodesRef = ref;
    }

    hasNodesRef() {
        return !!this.nodesRef;
    }

    getNodesRef() {
        return this.nodesRef;
    }

    // addParamContainerRef(ref) {
    //     this.paramContainerRef[ref.id] = ref;
    // }

    // getParamContainerRef(id) {
    //     return this.paramContainerRef[id];
    // }
}