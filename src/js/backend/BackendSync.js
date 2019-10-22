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
        }
    }

    initNodeSettings() {
        console.log('init backend node settings');

        const connectedModifierNodes = this.selectedDrawing.nodes.filter(t => !!t.data.connectionData);
        for (let i = 0; i < connectedModifierNodes.length; i++) {
            const modifierNodeData = connectedModifierNodes[i];
            const outNode = window.NS.singletons.ConnectionsManager.nodes[modifierNodeData.id];
            const inNode = window.NS.singletons.ConnectionsManager.nodes[modifierNodeData.data.connectionData.node];
            const paramContainer = inNode.nodeType.paramContainers.find(t => t.ID === modifierNodeData.data.connectionData.paramContainer);
            if (paramContainer && outNode) {
                outNode.nodeType.activateAsChild(paramContainer, false);
            }
            
            const paramConnections = modifierNodeData.data.paramConnections ? modifierNodeData.data.paramConnections : [];
            for (let q = 0; q < paramConnections.length; q++) {
                const paramObj = window.NS.singletons.ConnectionsManager.params[modifierNodeData.data.paramConnections[q]];
                
                window.NS.singletons.ConnectionsManager.addParamConnection(paramObj, outNode);
            }
        }
    }

    isDone() {
        return this.selectedDrawing.nodes.length === this.nodesAddedCounter;
    }
}