export default class Refs{
    constructor() {
        this.userRef = null;
        this.drawingRef = null;
        // this.nodesRef = null;
        // this.groupsRef = null;
        this.paramContainerRef = {};

        this.nodesRefs = {};
        this.groupsRefs = {};
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

    // setNodesRef(ref) {
    //     this.nodesRef = ref;
    // }

    // hasNodesRef() {
    //     return !!this.nodesRef;
    // }

    // getNodesRef() {
    //     return this.nodesRef;
    // }

    addGroupRef(ref) {
        this.groupsRefs[ref.id] = ref
    }

    hasGroupRef(id) {
        return !!this.groupsRefs[id];
    }

    getGroupRef(id) {
        return this.groupsRefs[id];
    }

    removeGroupRef(id) {
        delete this.groupsRefs[id];
    }

    // setGroupsRef(ref) {
    //     this.groupsRef = ref;
    // }

    // hasGroupsRef() {
    //     return !!this.groupsRef;
    // }

    // getGroupsRef() {
    //     return this.groupsRef;
    // }

    // addParamContainerRef(ref) {
    //     this.paramContainerRef[ref.id] = ref;
    // }

    // getParamContainerRef(id) {
    //     return this.paramContainerRef[id];
    // }
}