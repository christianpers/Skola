import './index.scss';

export default class NodeTab {
    constructor(parentEl, node, onTabClickCallback, tabIndex, onTabDragStart, onTabDragEnd) {
        this.parentEl = parentEl;
        this.el = document.createElement('div');
        this.el.classList.add('tab-item');

        this.tabIndex = tabIndex;
        this.onTabDragStart = onTabDragStart;
        this.onTabDragEnd = onTabDragEnd;
        
        this.tabTitle = document.createElement('h5');
        this.setTitle(node.title);
        this.tabTitle.classList.add('tab-title');

        this.touchLayer = document.createElement('div');
        this.touchLayer.classList.add('touch-layer');
        this.touchLayer.setAttribute('data-node', node.ID);

        this.node = node;

        this.onMouseDownBound = this.onMouseDown.bind(this);
        this.onMouseUpBound = this.onMouseUp.bind(this);

        this.mouseDownTimestamp = Date.now();
        this.tabGroupMover = null;
        this.activateTabGroupMoverTimer = null;

        this.currentX = 0;

        this.draggingActive = false;
        
        this.el.appendChild(this.tabTitle);

        this.el.appendChild(this.touchLayer);

        parentEl.appendChild(this.el);

        this.onTabClickBound = this.onTabClick.bind(this);
        this.onTabClickCallback = onTabClickCallback;

        this.touchLayer.addEventListener('click', this.onTabClickBound);
        // this.touchLayer.addEventListener('mousedown', this.onMouseDownBound);
    }

    getWidth() {
        return this.el.getBoundingClientRect().width;
    }

    activateDragging() {
        this.draggingActive = true;
        this.el.style.transform = `translateX(${this.currentX}px) scale(0.8)`;
    }

    disableDragging() {
        this.draggingActive = false;
        this.el.style.transform = `translateX(${this.currentX}px) scale(1)`;
    }

    onMouseDown(e) {
        e.preventDefault();
        e.stopPropagation();
        window.addEventListener('mouseup', this.onMouseUpBound);
        this.mouseDownTimestamp = Date.now();
        this.activateTabGroupMoverTimer = setTimeout(() => {
            this.onTabDragStart(this, e);
            this.activateDragging();
        }, 500);
    }

    onMouseUp(e) {
        window.removeEventListener('mouseup', this.onMouseUpBound);
        clearTimeout(this.activateTabGroupMoverTimer);
        
        if (this.draggingActive) {
            this.disableDragging();
            this.onTabDragEnd();
        } else {
            this.disableDragging();
            this.onTabClickBound(e);
        }
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

        // this.node.setSelected();
        // window.NS.singletons.SelectionManager.setSelected(this.node);
        const nodeSelectedEvent = new CustomEvent('node-selected', { detail: this.node });
        document.documentElement.dispatchEvent(nodeSelectedEvent);

        // window.NS.singletons.CanvasNode.foregroundRender.showActive(this.node.ID);
    }

    setIdle() {
        this.el.classList.remove('selected');

        // window.NS.singletons.SelectionManager.deSe
        // this.node.setNotSelected();

        // window.NS.singletons.CanvasNode.foregroundRender.hideActive(this.node.ID);
    }

    remove() {
        this.parentEl.removeChild(this.el);
    }

    renderDOM(x, updateCurrentX) {
        if (this.draggingActive) {
            this.el.style.transform = `translateX(${x}px) scale(0.8)`;
        } else {
            this.el.style.transform = `translateX(${x}px)`;
        }
        
        if (updateCurrentX) {
            this.currentX = x;
        }
        
    }
}