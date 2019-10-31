
import './ConnectionWindow.scss';

export default class ConnectionWindow{
    constructor(parentEl, enableParamCallback, disableParamCallback, onShowCallback) {
        this.parentEl = parentEl;

        this.currentNode = null;

        this.enableParamCallback = enableParamCallback;
        this.disableParamCallback = disableParamCallback;
        this.onShowCallback = onShowCallback;

        this.el = document.createElement('div');
        this.el.className = 'connection-window window';

        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'content-container';

        const label = document.createElement('h5');
        label.className = 'title';
        label.innerHTML = 'CONNECTION SETTINGS';

        this.closeBtn = document.createElement('h5');
        this.closeBtn.innerHTML = 'Hide';
        this.closeBtn.className = 'close-btn';

        this.onHideClickBound = this.onHideClick.bind(this);
        this.closeBtn.addEventListener('click', this.onHideClickBound);

        this.el.appendChild(label);

        this.el.appendChild(this.closeBtn);

        this.el.appendChild(this.contentContainer);

        this.hasParamsToShow = false;

        this.parentEl.appendChild(this.el);

        this.el.addEventListener('click', () => {
            this.onClick();
        });
    }

    onClick() {
        if (this.el.classList.contains('has-params')) {
            this.show();
        }
    }

    onHideClick(e) {
        e.preventDefault();
        e.stopPropagation();
        this.hide();
    }

    setupForNode(node) {
        this.removeContent();
        this.currentNode = node;
        const paramContainer = node.nodeType.assignedParamContainer;

        const inputParams = paramContainer ? Object.keys(paramContainer.inputParams) : [];
        
        if (inputParams.length > 0) {
            this.hasParamsToShow = true;
            this.el.classList.add('has-params');
            const outNode = paramContainer.connectedNodes[0];
            if (outNode && outNode.updateAllowedInputParams) {
                outNode.updateAllowedInputParams(paramContainer.inputParams);
            }
        } else {
            this.hasParamsToShow = false;
            this.el.classList.remove('has-params');
            this.hide();
        }
        inputParams.map(t => {
            const paramObj = paramContainer.inputParams[t];
            const paramItemContainer = document.createElement('div');
            paramItemContainer.className = 'param-item-container';
            
            const paramLabelContainer = document.createElement('div');
            paramLabelContainer.className = 'label-container';

            const paramItemLabel = document.createElement('p');
            paramItemLabel.innerHTML = 'param';

            const paramVal = document.createElement('h4');
            paramVal.className = 'param-item';
            paramVal.innerHTML = paramObj.param.title;

            paramLabelContainer.appendChild(paramItemLabel);
            paramLabelContainer.appendChild(paramVal);

            paramItemContainer.appendChild(paramLabelContainer);
            
            this.contentContainer.appendChild(paramItemContainer);

            const connectedNodesContainer = document.createElement('div');
            connectedNodesContainer.className = 'connected-nodes-container';

            paramItemContainer.appendChild(connectedNodesContainer);

            const connectedNodesLabel = document.createElement('p');
            connectedNodesLabel.innerHTML = 'connected nodes';

            connectedNodesContainer.appendChild(connectedNodesLabel);

            const connectedNodes = paramContainer.connectedNodes;
            connectedNodes.map(tC => {
                const connectedNodeEl = document.createElement('h4');
                connectedNodeEl.className = 'connected-node-item';
                connectedNodeEl.innerHTML = tC.title;

                connectedNodesContainer.appendChild(connectedNodeEl);
            });

            const connectBtn = document.createElement('div');
            connectBtn.className = 'connect-btn';

            if (!paramObj.connectionAllowed) {
                connectBtn.classList.add('not-allowed');
            }

            const connectLabel = document.createElement('h5');
            connectLabel.innerHTML = paramObj.isConnected ? 'Disconnect' : 'Connect';

            connectBtn.appendChild(connectLabel);

            if (paramObj.connectionAllowed) {
                connectBtn.addEventListener('click', () => {
                    /* TODO TAKE FROM CONNECTED NODES INSTEAD */
                    const outNode = paramContainer.connectedNodes[0];
                    const inNode = paramContainer.node;
                    if (connectLabel.innerHTML === 'Disconnect') {
                        this.disableParam(paramObj, outNode, inNode);
                        // if (this.disableParamCallback(paramObj, outNode, inNode)) {
                        //     connectLabel.innerHTML = 'Connect';
                        // }
                    } else {
                        this.enableParam(paramObj, outNode, inNode);
                        // if (this.enableParamCallback(paramObj, outNode, inNode)) {
                        //     connectLabel.innerHTML = 'Disconnect';
                        // }
                    }
                });
            }
            paramItemContainer.appendChild(connectBtn);
        });
    }

    enableParam(paramObj, outNode, inNode) {
        const currentNode = this.currentNode;

        this.enableParamCallback(paramObj, outNode, inNode);

        this.setupForNode(currentNode);
    }

    disableParam(paramObj, outNode, inNode) {
        const currentNode = this.currentNode;

        this.disableParamCallback(paramObj, outNode, inNode);

        this.setupForNode(currentNode);
    }

    show() {
        if (this.hasParamsToShow) {
            this.onShowCallback();
            this.el.classList.add('visible');
        }
    }

    removeContent() {
        const parent = this.contentContainer;
        while (parent.firstChild) {
            parent.firstChild.remove();
        }

        this.el.classList.remove('has-params');

        this.currentNode = null;
    }

    hide() {
        this.el.classList.remove('visible');
    }

    blur() {
        this.hide();
        this.removeContent();
    }
}