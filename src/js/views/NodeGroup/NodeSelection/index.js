import NodeTab from './NodeTab';
import './index.scss';

export default class NodeSelection{
    constructor(parentEl, onNodeSelected) {
        this.el = document.createElement('div');
        this.el.classList.add('node-selection');
        this.nodes = {};

        this.onNodeSelected = onNodeSelected;

        this.parentEl = parentEl;
        this.parentEl.appendChild(this.el);

        this.tabs = {};

        this.onTabClickBound = this.onTabClick.bind(this);
    }

    addTab(node) {
        const tab = new NodeTab(this.el, node, this.onTabClickBound);

        this.tabs[node.ID] = tab;
    }

    removeTab(node) {
        console.log('remove tab: ', node);
        const tab = this.tabs[node.ID];
        tab.remove();

        delete this.tabs[node.ID];
    }

    setTabTitle(nodeID, title) {
        this.tabs[nodeID].setTitle(title);
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
}