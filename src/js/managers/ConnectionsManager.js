export default class ConnectionsManager{
    constructor() {
        this.nodes = {};
        this.params = {};

        this.paramConnections = {};

        this.nodeConnections = {};

        this.nodeConnectionsUpdateEvent = new CustomEvent('node-connections-update');
        this.paramConnectionsUpdateEvent = new CustomEvent('param-connections-update');
    }

    addNode(node) {
        this.nodes[node.ID] = node;

        console.log(this.nodes);
    }

    removeNode(node) {
        delete this.nodes[node.ID];
    }

    addParam(param) {
        this.params[param.ID] = param;
    }

    removeParam(param) {
        delete this.params[param.ID];
    }

    // NODES - OUTNODE -> PARAMCONTAINER 

    getNewNodeConnectionObj(outNode, paramContainer) {
        return {
            outNodeID: outNode.ID,
            paramContainerID: paramContainer.ID,
        }
    }

    addNodeConnection(outNode, paramContainer) {
        const connectionObj = this.getNewNodeConnectionObj(outNode, paramContainer);

        const inNodeID = paramContainer.node.ID;
        if (!(inNodeID in this.nodeConnections)) {
            this.nodeConnections[inNodeID] = [];
        }

        this.nodeConnections[inNodeID].push(connectionObj);
        const nodeConnectionsUpdateEvent = new CustomEvent('node-connections-update', { detail: this.nodeConnections });
        document.documentElement.dispatchEvent(nodeConnectionsUpdateEvent);
    }

    removeNodeConnection(paramContainer, outNode) {
        const inNodeID = paramContainer.node.ID;

        this.nodeConnections[inNodeID] = this.nodeConnections[inNodeID]
            .filter(t => t.paramContainerID !== paramContainer.ID && t.outNodeID !== outNode.ID);

        if (this.nodeConnections[inNodeID].length === 0) {
            delete this.nodeConnections[inNodeID];
        }

        const nodeConnectionsUpdateEvent = new CustomEvent('node-connections-update', { detail: this.nodeConnections });
        document.documentElement.dispatchEvent(nodeConnectionsUpdateEvent);
    }



    // PARAMS OUTNODE -> PARAM

    getNewParamConnectionObj(outNode, param) {
        return {
            outNodeID: outNode.ID,
            paramID: param.ID,
        };
    };

    addParamConnection(param, outNode) {
        const connectionObj = this.getNewParamConnectionObj(outNode, param);
        
        const inNodeID = param.paramContainer.node.ID;
        if (!(inNodeID in this.paramConnections)) {
            this.paramConnections[inNodeID] = [];
        }

        this.paramConnections[inNodeID].push(connectionObj);
        const detail = {
            inNodeID,
            connection: connectionObj,
        };
        console.log('add param connection', this.paramConnections);
        const paramConnectionsUpdateEvent = new CustomEvent('param-connections-add', { detail });
        document.documentElement.dispatchEvent(paramConnectionsUpdateEvent);
    }

    removeParamConnection(param, outNode) {
        const inNodeID = param.paramContainer.node.ID;

        console.log('remove param connection', this.paramConnections);

        if (!(inNodeID in this.paramConnections)) {
            return;
        }

        this.paramConnections[inNodeID] = this.paramConnections[inNodeID]
            .filter(t => t.paramID !== param.ID);

        if (this.paramConnections[inNodeID].length === 0) {
            delete this.paramConnections[inNodeID];
        }

        const detail = {
            inNodeID,
            connection: {
                outNodeID: outNode.ID,
                paramID: param.ID,
            },
        };

        console.log(this.paramConnections);

        const paramConnectionsUpdateEvent = new CustomEvent('param-connections-remove', { detail });
        document.documentElement.dispatchEvent(paramConnectionsUpdateEvent);
    }
}