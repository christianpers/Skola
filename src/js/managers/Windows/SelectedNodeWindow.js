import './SelectedNodeWindow.scss';

export default class SelectedNodeWindow{
    constructor(parentEl) {
        this.parentEl = parentEl;

        this.el = document.createElement('div');
        this.el.className = 'selected-node-window';

        this.parentEl.appendChild(this.el);
    }

    setNode(ID) {
        const getConnectedToNodeTitle = (node) => {
            if (node.nodeType.isConnected && node.nodeType.assignedParamContainer) {
                const connectedToNodeID = node.nodeType.assignedParamContainer.node.ID;
                const connectedToNode = window.NS.singletons.ConnectionsManager.nodes[connectedToNodeID];
                if (connectedToNode) {
                    return connectedToNode.title;
                }
            }
            return 'No title on parent';
        }

        const getInfoContainerTemplate = (specificClass, label, value) => {
            return `
                <div class="${specificClass} info-container">
                    <h5>${label}</h5>
                    <h4>${value}</h4>
                </div>
            `;
        }

        const getModifierHTML = (node) => {
            const connectedToNodeTitle = getConnectedToNodeTitle(node);

            return getInfoContainerTemplate('connected-to-node', 'Kopplad till:', connectedToNodeTitle);
        }

        const getInfoContainers = (node) => {
            let ret;
            if (!node) {
                return '';
            }
            const nodeInfoContainer = getInfoContainerTemplate('node-info', 'Node:', node.title);
            ret = `${nodeInfoContainer}`
            if (node.isModifier) {
                ret = `${nodeInfoContainer}${getModifierHTML(node)}`;
            }

            return ret;

        }
        const node = window.NS.singletons.ConnectionsManager.nodes[ID];
        const infoContainers = getInfoContainers(node);
        
        const finalHtml = `
            <div class="content">
                ${infoContainers}
            </div>
        `;

        const content = this.el.querySelector('.content');
        if (content) {
            this.el.removeChild(content);
        }
        

        this.el.insertAdjacentHTML('afterbegin', finalHtml);
    }

    blur() {
        this.el.innerHTML = '';
    }
}