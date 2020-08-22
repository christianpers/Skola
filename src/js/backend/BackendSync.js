export default class BackendSync {
    constructor() {
        this.selectedDrawing = null;
        this.nodesAddedCounter = 0;
    }

    setSelectedDrawing(drawing) {
        this.selectedDrawing = drawing;
    }

    onNodeAdded() {
        this.nodesAddedCounter++;

        if (this.isDone()) {
            this.initNodeSettings();
            this.initGroups();
        }
    }

    initNodeSettings() {
        const connectedModifierNodes = this.selectedDrawing.nodes.filter(t => !!t.data.connectionData)
            .sort((a, b) => {
                const aNode = window.NS.singletons.ConnectionsManager.nodes[a.id];
                const bNode = window.NS.singletons.ConnectionsManager.nodes[b.id];
                return bNode.nodeSortIndex - aNode.nodeSortIndex 
            });
        
        for (let i = 0; i < connectedModifierNodes.length; i++) {
            const modifierNodeData = connectedModifierNodes[i];
            const outNode = window.NS.singletons.ConnectionsManager.nodes[modifierNodeData.id];
            const inNode = window.NS.singletons.ConnectionsManager.nodes[modifierNodeData.data.connectionData.node];
            const paramContainer = inNode.nodeType.paramContainers.find(t => t.ID === modifierNodeData.data.connectionData.paramContainer);
            if (paramContainer && outNode) {
                outNode.nodeType.activateAsChild(paramContainer, false, true);
            }
            const paramConnections = modifierNodeData.data.paramConnections ? modifierNodeData.data.paramConnections : [];
            for (let q = 0; q < paramConnections.length; q++) {
                const paramObj = window.NS.singletons.ConnectionsManager.params[modifierNodeData.data.paramConnections[q]];
                if (paramObj) {
                    window.NS.singletons.ConnectionsManager.addParamConnection(paramObj, outNode);
                }
                
            }
        }
    }

    initGroups() {
        const groups = this.selectedDrawing.groups || [];
        groups.forEach(t => {
            const group = window.NS.singletons.NodeGroupManager.createGroup(null, t, null);
            t.data.renderOrder.forEach(tN => {
                const node = window.NS.singletons.ConnectionsManager.nodes[tN];
                group.addNonagon(node, true);
            });
        });
    }

    isDone() {
        return this.selectedDrawing.nodes.length === this.nodesAddedCounter;
    }
}