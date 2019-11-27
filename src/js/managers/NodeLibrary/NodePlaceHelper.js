export default class NodePlaceHelper{
	constructor(workspaceManager, pos, isModifier, shape) {

		this.workspaceManager = workspaceManager;
		// this.parentEl = workspaceManager.el;
		// this.el = document.createElement('div');
		// this.el.style.width = isModifier ? '44px' : '260px';
		// this.el.style.height = isModifier ? '44px' : '260px';
		// this.el.style.position = 'absolute';
		// this.el.style.top = isModifier ? '-22px' : '-130px';
		// this.el.style.left = isModifier ? '-22px' : '-130px';
		// this.el.style.background = 'rgba(50, 50, 50, .9)';
		// this.el.style.borderRadius = '4px';
		this.isModifier = isModifier;

		// const shape = isModifier ? this.getTriangleShape() : this.getNonagonShape();

		// this.el.appendChild(shape);

		// this.parentEl.appendChild(this.el);

		this.moveCoords = {
			start: {
				x: 0,
				y: 0
			},
			offset: {
				x: pos.x,
				y: pos.y,
			}
		};

		this.deltaX = 0;
		this.deltaY = 0;

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);

	}

	getPos() {

		const shapeOffset = this.isModifier ? -20 : -130;

		const workspaceOffsetX = Math.abs(this.workspaceManager.moveCoords.offset.x);
		const workspaceOffsetY = Math.abs(this.workspaceManager.moveCoords.offset.y);

		return {
			x: this.moveCoords.offset.x + workspaceOffsetX + shapeOffset,
			y: this.moveCoords.offset.y + workspaceOffsetY + shapeOffset,
		};

	}

	onMouseDown(e) {

		e.stopPropagation();
		e.preventDefault();

		this.deltaX = 0;
		this.deltaY = 0;

		this.moveCoords.start.x = e.x - this.moveCoords.offset.x;
		this.moveCoords.start.y = e.y - this.moveCoords.offset.y;
	}

	onMouseMove(e) {

		const x = e.x;
		const y = e.y;
		const deltaX = x - this.moveCoords.start.x;
		const deltaY = y - this.moveCoords.start.y;

		this.moveCoords.offset.x = deltaX;
		this.moveCoords.offset.y = deltaY;

		const workspaceOffsetX = Math.abs(this.workspaceManager.moveCoords.offset.x);
		const workspaceOffsetY = Math.abs(this.workspaceManager.moveCoords.offset.y);

		// this.el.style[window.NS.transform] = `translate3d(${deltaX + workspaceOffsetX}px, ${deltaY + workspaceOffsetY}px, 0)`;

		this.deltaX = deltaX;
		this.deltaY = deltaY;
	}

	onMouseUp(e) {

		// this.parentEl.removeChild(this.el);
	}
}