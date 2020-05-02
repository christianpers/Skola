class TabGroupMover {
    constructor(renderDOM, updateOrder) {
        this.renderDOM = renderDOM;
        this.updateOrder = updateOrder;
        this.activeTab = null;
        this.allTabs = {};

        this.moveCoords = {
            startX: 0,
        }

        this.renderOrder = [];
        this.filteredRenderOrder = [];

        this.latestDragOrder = [];

        this.tabSizes = {};

        this.onDragMoveBound = this.onDragMove.bind(this);
    }

    initMove(activeTab, allTabs, e, renderOrder, tabWidths) {
        this.moveCoords.startX = e.clientX;
        this.renderOrder = renderOrder;
        this.tabSizes = tabWidths;
        
        this.activeTab = activeTab;
        this.allTabs = allTabs;

        console.log('init render order', this.renderOrder);

        this.filteredRenderOrder = this.renderOrder.filter(t => t !== this.activeTab.node.ID);

        window.addEventListener('mousemove', this.onDragMoveBound);
    }

    setRenderOrder(renderOrder) {
        this.renderOrder = renderOrder;   
    }

    getNewOrder(indexToReplace) {
        const firstPart = this.filteredRenderOrder.slice(0, indexToReplace);
        const secondPart = this.filteredRenderOrder.slice(indexToReplace, this.filteredRenderOrder.length);

        const newArr = [...firstPart, this.activeTab.node.ID, ...secondPart];

        this.latestDragOrder = newArr;
        this.updateOrder(newArr);
    }

    onDragMove(e) {
        const offset = e.clientX - this.moveCoords.startX;

        const activeMidX = this.activeTab.currentX + offset + this.tabSizes[this.activeTab.node.ID] / 2;

        let x = 0;
        for (let i = 0; i < this.renderOrder.length; i++) {
            const w = this.tabSizes[this.renderOrder[i]];
            
            const diff = Math.abs(activeMidX - x);
            if (diff < 5) {
                this.getNewOrder(i);
            }

            x += w;
        }

        this.activeTab.renderDOM(this.activeTab.currentX + offset);
    }

    onDragEnd() {
        window.removeEventListener('mousemove', this.onDragMoveBound);

        return this.latestDragOrder;
    }
}

export default TabGroupMover;