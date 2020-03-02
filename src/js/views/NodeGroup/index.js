import NodeSelection from './NodeSelection';

import './index.scss';

export default class NodeGroup {
    constructor(parentEl, ID, pos) {
        this.nonagons = {};
        this.parentEl = parentEl;
        this.ID = ID;

        this.el = document.createElement('div');
        this.el.classList.add('group-container');

        this.onNodeTabSelectedBound = this.onNodeTabSelected.bind(this);
        this.nodeSelectionTabs = new NodeSelection(this.el, this.onNodeTabSelectedBound);

        this.moveCoords = {
			start: {
				x: 0,
				y: 0
			},
			offset: {
				x: pos.x - 100,
				y: pos.y - 100,
			}
		};

        this.el.style[window.NS.transform] = `translate3d(${pos.x - 100}px, ${pos.y - 100}px, 0)`;

        this.onMouseDownBound = this.onMouseDown.bind(this);
        this.onMouseMoveBound = this.onMouseMove.bind(this);
        this.onMouseUpBound = this.onMouseUp.bind(this);

        this.el.addEventListener('mousedown', this.onMouseDownBound);
        
        parentEl.appendChild(this.el);
    }

    hasNonagons() {
        return Object.keys(this.nonagons).length > 0;
    }

    onNodeTabSelected(id) {
        const node = this.nonagons[id];

        const keys = Object.keys(this.nonagons);
        keys.forEach((t) => this.nonagons[t].groupHide());

        node.groupShow();
    }

    getPos() {
		const pos = new THREE.Vector2();
		const rect = this.el.getBoundingClientRect();
		pos.set(rect.x + rect.width / 2, rect.y + rect.height / 2);
		
		return pos;
	}

    show() {
        this.el.classList.add('visible');
    }

    hide() {
        this.el.classList.remove('visible');
    }

    delete() {
        this.parentEl.removeChild(this.el);
    }

    addNonagon(nonagon) {
        this.nonagons[nonagon.ID] = nonagon;
        nonagon.addToGroup(this.el, this.ID);

        this.nodeSelectionTabs.addNode(nonagon);

        const keys = Object.keys(this.nonagons);
        if (keys.length === 1) {
            nonagon.groupShow();
        } else {
            keys.forEach(t => {
                this.nonagons[t].groupHide();
            });
            nonagon.groupShow();
            
        }

        this.nodeSelectionTabs.setTabSelected(nonagon.ID);
    }

    removeNonagon(e, nonagon) {
        nonagon.groupShow();
        this.nodeSelectionTabs.removeNode(nonagon);
        nonagon.removeFromGroup(e, this);
        delete this.nonagons[nonagon.ID];

        if (this.hasNonagons()) {
            console.log('has nonagons', this.nonagons);
            const keys = Object.keys(this.nonagons);
            const activeNonagon = this.nonagons[keys[0]];
            activeNonagon.groupShow();

            this.nodeSelectionTabs.setTabSelected(activeNonagon.ID);
        }
    }

    onMouseDown(e) {
        e.preventDefault;
        e.stopPropagation();

        this.moveCoords.start.x = e.x - this.moveCoords.offset.x;
		this.moveCoords.start.y = e.y - this.moveCoords.offset.y;

        window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);


    }

    onMouseMove(e) {
        const deltaX = e.x - this.moveCoords.start.x;
		const deltaY = e.y - this.moveCoords.start.y;

		this.moveCoords.offset.x = deltaX;
		this.moveCoords.offset.y = deltaY;

		this.el.style[window.NS.transform] = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
    }

    onMouseUp() {
        window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);
    }
}