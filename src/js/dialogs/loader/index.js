import './index.scss';

export default class Loader{
    constructor(parentEl) {
        this.parentEl = parentEl;

        this.el = document.createElement('div');
        this.el.classList.add('loader');
        this.el.classList.add('hidden');

        this.loaderImg = new Image();
        this.loaderImg.className = 'loader-img';
        this.loaderImg.src = './assets/loader.svg';

        this.parentEl.appendChild(this.el);
    }

    show() {
        this.el.classList.remove('hidden');



        this.el.appendChild(this.loaderImg);
    }

    hide() {
        this.el.classList.add('hidden');

        this.el.removeChild(this.loaderImg);
    }
}