import './index.scss';

export default class Fullscreen {
    constructor(parentEl, onFullscreenClick) {
        this.parentEl = parentEl;

        this.onFullscreenClick = onFullscreenClick;

        this.el = document.createElement('div');
        this.el.className = 'fullscreen hidden';

        const icon = new Image();
        icon.src = `./assets/fullscreen.svg`;

        this.el.appendChild(icon);

        const touchLayer = document.createElement('div');
        touchLayer.className = 'touch-layer';

        this.el.appendChild(touchLayer);

        this.parentEl.appendChild(this.el);

        this.el.addEventListener('click', this.onFullscreenClick);
    }

    show() {
        this.el.classList.remove('hidden');
    }

    hide() {
        this.el.classList.add('hidden');
    }
}