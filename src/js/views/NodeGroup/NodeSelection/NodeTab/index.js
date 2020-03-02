import './index.scss';

export default class NodeTab {
    constructor(parentEl, node, onTabClickCallback) {
        this.parentEl = parentEl;
        this.el = document.createElement('div');
        this.el.classList.add('tab-item');
        
        const tabTitle = document.createElement('h5');
        tabTitle.innerHTML = node.title;
        tabTitle.classList.add('tab-title');

        const touchLayer = document.createElement('div');
        touchLayer.classList.add('touch-layer');
        touchLayer.setAttribute('data-node', node.ID);

        

        this.el.appendChild(tabTitle);

        this.el.appendChild(touchLayer);

        parentEl.appendChild(this.el);

        this.onTabClickBound = this.onTabClick.bind(this);
        this.onTabClickCallback = onTabClickCallback;

        touchLayer.addEventListener('click', this.onTabClickBound);
    }

    onTabClick(e) {
        const id = e.target.getAttribute('data-node');
        this.onTabClickCallback(id);
    }

    setActive() {
        this.el.classList.add('selected');
    }

    setIdle() {
        this.el.classList.remove('selected');
    }

    remove() {
        this.parentEl.removeChild(this.el);
    }
}