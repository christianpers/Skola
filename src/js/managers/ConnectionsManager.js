export default class ConnectionsManager{
    constructor() {
        this.nodes = {};
        this.params = {};

        this.paramConnections = {};

        this.nodeConnections = {};

        this.nodeConnectionsUpdateEvent = new CustomEvent('node-connections-update');
        this.paramConnectionsUpdateEvent = new CustomEvent('param-connections-update');
    }

    getNode(ID) {
        return this.nodes[ID];
    }

    addNode(node) {
        this.nodes[node.ID] = node;

        if (!node.isModifier) {
            const mainNodesIndex = Object.keys(this.nodes)
                .filter(t => !this.nodes[t].isModifier)
                .indexOf(node.ID);

            node.nodeIndex = mainNodesIndex;
        }
        
        const nodeAddedEvent = new CustomEvent('node-added-event');
        document.documentElement.dispatchEvent(nodeAddedEvent);
    }

    removeNode(node) {
        // remove param connections

        // get param connections if node to remove is inNode
        const connectionsInNode = this.paramConnections[node.ID] ? this.paramConnections[node.ID] : [];

        for (let i = 0; i < connectionsInNode.length; i++) {
            const connection = connectionsInNode[i];
            this.removeParamConnection(this.params[connection.paramID], this.nodes[connection.outNodeID]);
        }

        // get param connections if node to remove is outNode
        const keys = Object.keys(this.paramConnections);
        for (let i = 0; i < keys.length; i++) {
            const paramConn = this.paramConnections[keys[i]];
            for (let q = 0; q < paramConn.length; q++) {
                if (paramConn[q].outNodeID === node.ID) {
                    const param = this.params[paramConn[q].paramID];
                    const outNode = this.nodes[paramConn[q].outNodeID];
                    this.removeParamConnection(param, outNode);
                }
            }
        }
        
        // get in connections  if node to remove is inNode
        const nodeInConnections = this.nodeConnections[node.ID] ? this.nodeConnections[node.ID] : [];
        for (let i = 0; i < nodeInConnections.length; i++) {
            const nodeInConnection = nodeInConnections[i];
            const paramContainer = node.nodeType.paramContainers.find(t => t.ID === nodeInConnection.paramContainerID);
            this.removeNodeConnection(paramContainer, this.nodes[nodeInConnection.outNodeID], true);
        }


        // get out connections  if node to remove is outNode
        const nodeKeys = Object.keys(this.nodeConnections);
        for (let i = 0; i < nodeKeys.length; i++) {
            const nodeConn = this.nodeConnections[nodeKeys[i]];
            for (let q = 0; q < nodeConn.length; q++) {
                if (nodeConn[q].outNodeID === node.ID) {
                    const inNode = this.nodes[nodeKeys[i]];
                    const paramContainerIn = inNode.nodeType.paramContainers.find(t => t.ID === nodeConn[q].paramContainerID);
                    this.removeNodeConnection(paramContainerIn, this.nodes[nodeConn[q].outNodeID]);
                }
            }
        }

        delete this.nodes[node.ID];

        const nodeRemovedEvent = new CustomEvent('node-removed-event');
        document.documentElement.dispatchEvent(nodeRemovedEvent);

        console.log('paramConnections: ', this.paramConnections);
        console.log('nodeConnections: ', this.nodeConnections);
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

    removeNodeConnection(paramContainer, outNode, fromDelete) {
        if (fromDelete) {
            outNode.onNodeDisconnectFromNonagonDelete();
        }
        
        const inNodeID = paramContainer.node.ID;

        const nodeConnections = this.nodeConnections[inNodeID] ? this.nodeConnections[inNodeID] : [];
        this.nodeConnections[inNodeID] = nodeConnections
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
        try {
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
            // console.log('add param connection', this.paramConnections);
            const paramConnectionsUpdateEvent = new CustomEvent('param-connections-add', { detail });
            document.documentElement.dispatchEvent(paramConnectionsUpdateEvent);
        } catch(err) {
            console.error('add param connection error: ', err);
        } 
        
    }

    removeParamConnection(param, outNode) {
        const inNodeID = param.paramContainer.node.ID;

        // console.log('remove param connection', this.paramConnections);

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

        const paramConnectionsUpdateEvent = new CustomEvent('param-connections-remove', { detail });
        document.documentElement.dispatchEvent(paramConnectionsUpdateEvent);
    }

    /* GETTERS */

    /* GET NODES WITH TYPE EXCEPT THE ONE WITH ID PARAM */
    getNodesWithType(type, ID) {
        const keys = Object.keys(this.nodes);
        return keys
            .filter(t => this.nodes[t].type && this.nodes[t].type === type && this.nodes[t].ID !== ID)
            .map(t => this.nodes[t]);
    }

    getConnectedNodeWithType(nodeID, type) {
        const nodeConnections = this.nodeConnections[nodeID];
        if (nodeConnections) {
            const connection = nodeConnections.find(t => {
                return this.nodes[t.outNodeID].type.toLowerCase() === type;
            });

            if (connection) {
                return this.nodes[connection.outNodeID];
            }
        }

        return null;
    }
}