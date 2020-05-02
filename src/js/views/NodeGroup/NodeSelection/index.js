import NodeTab from './NodeTab';
import TabGroupMover from '../../../helpers/tab-group-mover';
import './index.scss';

export default class NodeSelection{
    constructor(parentEl, onNodeSelected, onUpdatedRenderOrder) {
        this.el = document.createElement('div');
        this.el.classList.add('node-selection');
        this.nodes = {};

        this.onUpdatedRenderOrder = onUpdatedRenderOrder;

        this.renderOrder = [];

        this.onNodeSelected = onNodeSelected;

        this.parentEl = parentEl;
        this.parentEl.appendChild(this.el);

        this.tabs = {};

        this.tabWidths = {};

        this.renderDOMBound = this.renderDOM.bind(this);
        this.updateOrderBound = this.updateOrder.bind(this);

        this.tabGroupMover = new TabGroupMover(this.renderDOMBound, this.updateOrderBound);

        this.onTabClickBound = this.onTabClick.bind(this);
        this.onTabDragStartBound = this.onTabDragStart.bind(this);
        this.onTabDragEndBound = this.onTabDragEnd.bind(this);
    }

    onTabDragStart(activeTab, e) {
        this.onTabClick(activeTab.node.ID);
        this.tabGroupMover.initMove(activeTab, this.tabs, e, this.renderOrder, this.tabWidths);
    }

    onTabDragEnd() {
        const renderOrder = this.tabGroupMover.onDragEnd();
        this.renderOrder = renderOrder;
        this.onUpdatedRenderOrder(renderOrder);
        this.renderDOM();
    }

    addTab(node) {
        const tab = new NodeTab(
            this.el,
            node,
            this.onTabClickBound,
            Object.keys(this.tabs).length,
            this.onTabDragStartBound,
            this.onTabDragEndBound,
        );

        this.tabs[node.ID] = tab;

        this.renderOrder.push(node.ID);

        this.tabWidths[node.ID] = tab.getWidth();

        this.renderDOM();
    }

    removeTab(node) {
        const tab = this.tabs[node.ID];
        tab.remove();

        delete this.tabs[node.ID];
        delete this.tabWidths[node.ID];

        this.renderOrder = this.renderOrder.filter(t => t !== node.ID);

        this.renderDOM();
    }

    setTabTitle(nodeID, title) {
        this.tabs[nodeID].setTitle(title);

        this.tabWidths[nodeID] = this.tabs[nodeID].getWidth();

        this.renderDOM();
    }

    addNode(node) {
        this.addTab(node);
    }

    removeNode(node) {
        this.removeTab(node);
    }

    setTabIdle(tab) {
        tab.setIdle();
    }

    setTabActive(tab) {
        tab.setActive();
    }

    setTabSelected(id) {
        const keys = Object.keys(this.tabs);
        keys.forEach(t => {
            this.setTabIdle(this.tabs[t]);
        });

        this.setTabActive(this.tabs[id]);
    }

    onTabClick(id) {
        this.setTabSelected(id);
        this.onNodeSelected(id);
    }

    updateOrder(order) {
        // this.renderOrder = order;
        this.renderDOM(order);

        // this.tabGroupMover.setRenderOrder(this.renderOrder);

        
    }

    renderDOM(tempOrder) {
        let x = 0;
        const renderOrder = tempOrder || this.renderOrder
        const length = renderOrder.length;
        for (let i = 0; i < length; i++) {
            const ID = renderOrder[i];
            const tabWidth = this.tabWidths[ID];
            
            if (!this.tabs[ID].draggingActive) {
                this.tabs[ID].renderDOM(x, true);
            }

            x += tabWidth;
        }
    }
}