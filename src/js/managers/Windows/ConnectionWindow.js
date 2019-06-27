export default class ConnectionWindow{
    constructor(parentEl, enableParamCallback, disableParamCallback) {
        this.parentEl = parentEl;

        this.enableParamCallback = enableParamCallback;
        this.disableParamCallback = disableParamCallback;

        this.el = document.createElement('div');
        this.el.className = 'connection-window window';

        this.contentContainer = document.createElement('div');
        this.contentContainer.className = 'content-container';

        const label = document.createElement('h5');
        label.innerHTML = 'CONNECTION SETTINGS';

        this.el.appendChild(label);

        this.el.appendChild(this.contentContainer);

        this.parentEl.appendChild(this.el);
    }

    show(paramContainer) {
        this.hide();
        const inputParams = Object.keys(paramContainer.inputParams);
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

            const connectLabel = document.createElement('h5');
            connectLabel.innerHTML = paramObj.param.isConnected ? 'Disconnect' : 'Connect';

            connectBtn.appendChild(connectLabel);

            connectBtn.addEventListener('click', () => {
                /* TODO TAKE FROM CONNECTED NODES INSTEAD */
                const outNode = paramContainer.connectedNodes[0];
                const inNode = paramContainer.node;
                if (connectLabel.innerHTML === 'Disconnect') {
                    if (this.disableParamCallback(paramObj, outNode, inNode)) {
                        connectLabel.innerHTML = 'Connect';
                    }
                } else {
                    if (this.enableParamCallback(paramObj, outNode, inNode)) {
                        connectLabel.innerHTML = 'Disconnect';
                    }
                }
                
                // console.log('connect btn click', paramContainer);
            });

            paramItemContainer.appendChild(connectBtn);
        });

        this.el.classList.add('visible');
    }

    hide() {
        this.el.classList.remove('visible');

        const parent = this.contentContainer;
        while (parent.firstChild) {
            parent.firstChild.remove();
        }
    }
}