export default class WorkspaceManager{
	constructor(parentEl) {

		this.width = 3000;
		this.height = 2000;

		this.containerEl = document.createElement('div');
		this.containerEl.className = 'workspace-container';

		parentEl.appendChild(this.containerEl);

		this.el = document.createElement('div');
		this.el.className = 'workspace';

		this.el.style.width = this.width + 'px';
		this.el.style.height = this.height + 'px';

		this.containerEl.appendChild(this.el);

		this.onMouseDownBound = this.onMouseDown.bind(this);
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);

		this.currentScale = 1;

		this.moveCoords = {
			start: {
				x: 0,
				y: 0
			},
			offset: {
				x: -(this.width / 2 - window.innerWidth / 2),
				y: -(this.height / 2 - window.innerHeight / 2),
			}
		};

		this.el.style[window.NS.transform] = `translate3d(${this.moveCoords.offset.x}px, ${this.moveCoords.offset.y}px, 0)`;

		this.el.addEventListener('mousedown', this.onMouseDownBound);
	}

	setScale(val) {
		this.currentScale = val;
		this.el.style[window.NS.transform] = `translate3d(${this.moveCoords.offset.x}px, ${this.moveCoords.offset.y}px, 0) scale(${val})`;
	}

	onMouseDown(e) {

		if (e.target.nodeName === 'INPUT' || e.target.classList.contains('prevent-drag')) {
			return;
		}

		e.preventDefault();

		this.moveCoords.start.x = e.x - this.moveCoords.offset.x;
		this.moveCoords.start.y = e.y - this.moveCoords.offset.y;

		window.addEventListener('mousemove', this.onMouseMoveBound);
		window.addEventListener('mouseup', this.onMouseUpBound);
	}

	onMouseMove(e) {

		e.preventDefault();

		const deltaX = e.x - this.moveCoords.start.x;
		const deltaY = e.y - this.moveCoords.start.y;

		this.moveCoords.offset.x = deltaX;
		this.moveCoords.offset.y = deltaY;

		this.el.style[window.NS.transform] = `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${this.currentScale})`;
	}

	onMouseUp(e) {

		window.removeEventListener('mousemove', this.onMouseMoveBound);
		window.removeEventListener('mouseup', this.onMouseUpBound);
	}

	onResize(w, h) {
		this.containerEl.style.width = `${w}px`;
		this.containerEl.style.height = `${h}px`;
	}
}