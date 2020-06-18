import './index.scss';

export default class Resizer {
    constructor(parentEl, getCanvasSize, setCanvasSize) {
        this.parentEl = parentEl;

        this.moveCoords = {
            start: {
                x: 0,
                y: 0,
            }
        };

        this.currentCanvasSize = {
            w: 0,
            h: 0,
        };

        this.getCanvasSize = getCanvasSize;
        this.setCanvasSize = setCanvasSize;

        this.onMouseDownBound = this.onMouseDown.bind(this);
        this.onMouseMoveBound = this.onMouseMove.bind(this);
        this.onMouseUpBound = this.onMouseUp.bind(this);

        this.el = document.createElement('div');
        this.el.className = 'resizer hidden';

        const icon = new Image();
        icon.src = `./assets/resize.svg`;

        this.el.appendChild(icon);

        const touchLayer = document.createElement('div');
        touchLayer.className = 'touch-layer';

        this.el.appendChild(touchLayer);

        this.parentEl.appendChild(this.el);

        this.el.addEventListener('mousedown', this.onMouseDownBound);
    }

    show() {
        this.el.classList.remove('hidden');
    }

    hide() {
        this.el.classList.add('hidden');
    }

    onMouseDown(e) {
        e.stopPropagation();
        e.preventDefault();

        this.moveCoords.start.x = e.x;
        this.moveCoords.start.y = e.y;

        const [w, h] = this.getCanvasSize();
        this.currentCanvasSize.w = w;
        this.currentCanvasSize.h = h;

        window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);
    }

    onMouseMove(e) {
        e.stopPropagation();
        e.preventDefault();
        const deltaX = this.moveCoords.start.x - e.x;
		const deltaY = e.y - this.moveCoords.start.y;

        this.setCanvasSize({
            w: this.currentCanvasSize.w + deltaX,
            h: this.currentCanvasSize.h + deltaY,
        });
    }

    onMouseUp(e) {
        e.stopPropagation();
        e.preventDefault();
        window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);

        return false;
    }
}