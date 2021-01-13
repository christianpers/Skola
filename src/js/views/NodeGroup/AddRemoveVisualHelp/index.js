import './index.scss';

export const TYPES = Object.freeze({
    plus: 'add',
    minus: 'remove'
});

export default class AddRemoveVisualHelp{
    constructor(parentEl) {
        this.el = document.createElement('div');
        this.el.classList.add('add-remove-visual-help');

        const addImg = document.createElement('img');
        addImg.classList.add('add-icon');
		addImg.src = `./assets/plus.svg`;

        const minusImg = document.createElement('img');
        minusImg.classList.add('remove-icon');
		minusImg.src = `./assets/minus.svg`;

        this.el.appendChild(addImg);
        this.el.appendChild(minusImg);

        parentEl.appendChild(this.el);
    }

    setType(type) {
        this.el.setAttribute('type', type);
    }
}
