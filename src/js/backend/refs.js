import { observable, toJS } from 'mobx';

export default class Refs{
    constructor() {
        this.userRef = null;
        this.drawingRef = null;
        // this.nodesRef = null;
        // this.groupsRef = null;
        this.paramContainerRef = {};

        this._state = observable({
            nodesRefs: {}
        });

        // this.nodesRefs = {};
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

    get $nodesRefs() {
        return { ...this._state.nodesRefs };
        // return toJS(this._state.nodesRefs);
    }

    addNodeRef(ref) {
        // console.log('add node ref');
        console.log('--- add node ref ----');
        // console.trace();
        // this.nodesRefs[ref.id] = ref;
        // this._state.nodesRefs.push(ref);
        this._state.nodesRefs[ref.id] = ref;
        // const nodesRefs = this.nodesRefs;
        // this._state.nodesRefs = {
        //     ...this.nodesRefs,
        //     ref
        // };
    }

    removeNodeRef(id) {
        console.log('--- remove node from ref ---');
        // delete this.nodesRefs[id];
        delete this._state.nodesRefs[id];
    }

    getNodeRef(id) {
        // return this.nodesRefs[id];
        return this._state.nodesRefs[id];
    }

    hasNodeRef(id) {
        // return !!this.nodesRefs[id];
        return !!this._state.nodesRefs[id];
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