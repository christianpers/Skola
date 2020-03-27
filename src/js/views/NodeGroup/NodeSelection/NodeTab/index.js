import './index.scss';

export default class NodeTab {
    constructor(parentEl, node, onTabClickCallback) {
        this.parentEl = parentEl;
        this.el = document.createElement('div');
        this.el.classList.add('tab-item');
        
        this.tabTitle = document.createElement('h5');
        this.setTitle(node.title);
        this.tabTitle.classList.add('tab-title');

        const touchLayer = document.createElement('div');
        touchLayer.classList.add('touch-layer');
        touchLayer.setAttribute('data-node', node.ID);

        this.node = node;

        

        this.el.appendChild(this.tabTitle);

        this.el.appendChild(touchLayer);

        parentEl.appendChild(this.el);

        this.onTabClickBound = this.onTabClick.bind(this);
        this.onTabClickCallback = onTabClickCallback;

        touchLayer.addEventListener('click', this.onTabClickBound);
    }

    setTitle(title) {
        this.tabTitle.innerHTML = title;
    }

    onTabClick(e) {
        const id = e.target.getAttribute('data-node');
        this.onTabClickCallback(id);
    }

    setActive() {
        this.el.classList.add('selected');

        window.NS.singletons.CanvasNode.foregroundRender.showActive(this.node.ID);
    }

    setIdle() {
        this.el.classList.remove('selected');

        window.NS.singletons.CanvasNode.foregroundRender.hideActive(this.node.ID);
    }

    remove() {
        this.parentEl.removeChild(this.el);
    }
}