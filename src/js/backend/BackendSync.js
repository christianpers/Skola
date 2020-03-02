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

    initGroups() {
        const nodesWithGroups = this.selectedDrawing.nodes.filter(t => t.data.group);
        const groups = {};

        const getRootGroupNode = (nodes, id) => {
            return nodes.find(t => t.ID === id);
        }

        const addNodesToGroup = (nodes, group) => {
            nodes.forEach(t => {
                group.addNonagon(t);
            });
        }

        nodesWithGroups.forEach((t) => {
            const node = window.NS.singletons.ConnectionsManager.nodes[t.id];

            if (!groups[t.data.group.Id]) {
                groups[t.data.group.Id] = [node];
            } else {
                groups[t.data.group.Id].push(node);
            }
        });

        const keys = Object.keys(groups);
        keys.forEach(t => {
            const nodes = groups[t];
            const rootNode = getRootGroupNode(nodes, t);
            if (rootNode) {
                const group = window.NS.singletons.NodeGroupManager.getNonagonGroup(rootNode);
                addNodesToGroup(nodes, group);
            }
        });
    }

    isDone() {
        return this.selectedDrawing.nodes.length === this.nodesAddedCounter;
    }
}