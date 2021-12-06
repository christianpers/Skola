import { autorun, observable, action } from 'mobx';
import { getNode } from '../helpers/node-mapping';

const generateVariableName = (node, index) => {
    return `${node.type.toLowerCase()}${index}`;
};

const generateConstructorCode = (varName, node) => {
    return `var ${varName} = new ${node.type};`;
};

const setVariable = action('setVariable', (state, variableName, value) => state.set(variableName, value));
const deleteVariable = action('deleteVariable', (state, variableName) => state.delete(variableName));

export default class NodeStateManager{
    constructor() {
        this._nodeManager = window.NS.singletons.NodeManager;
        this._connectionsManager = window.NS.singletons.ConnectionsManager;
        
        /* { VARIABLE: { ID: NODE_ID }} SHOULD BE ALWAYS SYNCED WITH WHATS IN EDITOR (SYNCED WITH EDITOR)*/
        this._variableMappedNodes = observable.map({}, { deep: false });

        autorun(() => {
            this._handleNodesRefsChange()
        });
    }

    _handleNodesRefsChange() {
        const nodesRefs = window.NS.singletons.refs.$nodesRefs;

        console.log('nodes refs change', nodesRefs);

        const nodes = Object.keys(nodesRefs).map(t => {
            return this._connectionsManager.getNode(t);
        });

        const groupedNodes = nodes.reduce((acc, node) => {
            const type = node ? node.type : 'NA';
			if (!acc[node.type]) {
				acc[node.type] = [];
			}

			acc[node.type].push(node.ID);

			return acc;
		}, {});

        console.log('variable mapped nodes: ', this.variableMappedNodesValues);
        // CHECK FOR ADDED NODES
        nodes
            .filter(t => !this._variableMappedNodes.has(t.variableName))
            .forEach(t => {
                const constructorGroup = groupedNodes[t.type] || [];
                const variableName = t.variableName || generateVariableName(t, constructorGroup.length);
                const constructorCode = generateConstructorCode(variableName, t);
                if (!t.variableName) {
                    t.variableName = variableName;
                }
                setVariable(this._variableMappedNodes, variableName, { id: t.ID, constructorCode });
            });

        // CHECK FOR DELETED NODES
        this.variableMappedNodesKeys
            .filter(varName => {
                const stateItem = this._variableMappedNodes.get(varName);
                return !nodes.find(node => node.ID === stateItem.id);
            })
            .forEach(varName => {
                deleteVariable(this._variableMappedNodes, varName);
            });
    }

    syncEditor(definedNodesMap) {
        const definedNodesMapArr = [];
        definedNodesMap.forEach((value, key) => {
            definedNodesMapArr.push(key);
        });

        /* FIND NEWLY ADDED NODES IN EDITOR */
        const notInState = definedNodesMapArr.reduce((acc, key) => {
            if (!this._variableMappedNodes.has(key)) {
                acc.push(key);
            }

            return acc;
        }, []);

        notInState.forEach(variable => {
            const { type } = definedNodesMap.get(variable);
            const nodeDef = getNode(type);

            console.log('type: ', type, ' nodeDef: ', nodeDef);

            const dataNode = {
                type: 'graphics',
                data: {
                    type,
                    isModifier: nodeDef.isModifier
                }
            };
            // need to do something clever here to get available positions  (AABB divided workspace ??)
            const pos = {
                x: 1898,
                y: 564
            }; 

            window.NS.singletons.NodeManager.initNode(dataNode, pos, undefined, variable);
        });



        /* FIND NODES REMOVED IN EDITOR */
        const notInEditor = this.variableMappedNodesValues.reduce((acc, [key, value]) => {
            if (!definedNodesMap.has(key)) {
                acc.push(key);
            }
            return acc;
        }, []);

        console.log('not in editor: ', notInEditor);

        notInEditor.forEach(variable => {
            const stateItem = this._variableMappedNodes.get(variable);
            const node = this._connectionsManager.getNode(stateItem.id);
            window.NS.singletons.NodeManager.remove(node);
        });

        /* 
        
            NEEDS TO BE CALLED AFTER ANY CHANGE IN EDITOR
        
         */
    }

    get variableMappedNodesValues() {
        const ret = [];
        this._variableMappedNodes.forEach((value, key) => {
            ret.push([key, value]);
        });

        return ret;
    }

    get variableMappedNodesKeys() {
        const ret = [];
        this._variableMappedNodes.forEach((value, key) => {
            ret.push(key);
        });

        return ret;
    }

    get $variableMappedNodes() {
        return this._variableMappedNodes;
    }
}