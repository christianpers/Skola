export default class NodeResizer{
	constructor(parentEl, onResizeCallback, nodeResizerDown) {

		this.onResizeCallback = onResizeCallback;
		this.onNodeResizerDown = nodeResizerDown;

		this.el = document.createElement('div');
		this.el.className = 'node-resizer';

		this.innerEl = document.createElement('div');
		this.innerEl.className = 'node-resizer-inner';

		this.el.appendChild(this.innerEl);

		parentEl.appendChild(this.el);

		this.currentDims = {
			w: 0,
			h: 0,
		};

		this.currentNodeDims = {
			w: 0,
			h: 0,
		};

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);

		this.moveCoords = {
			start: {
				x: 0,
				y: 0
			},
			offset: {
				x: 0,
				y: 0,
			}
		};

		this.innerEl.addEventListener('mousedown', this.onMouseDownBound);
	}

	onMouseDown(e) {
		e.stopPropagation();
		e.preventDefault();

		this.onNodeResizerDown();

		this.moveCoords.start.x = e.x - this.moveCoords.offset.x;
		this.moveCoords.start.y = e.y - this.moveCoords.offset.y;

		window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);

	}

	onMouseMove(e) {
		e.stopPropagation();
		e.preventDefault();

		const deltaX = e.x - this.moveCoords.start.x;
		const deltaY = e.y - this.moveCoords.start.y;

		this.onResizeCallback({x: deltaX, y: deltaY});



	}

	onMouseUp(e) {

		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);

	}

	remove() {
		this.innerEl.removeEventListener('mousedown', this.onMouseDownBound);

	}
}