import './index.scss';

export default class NodeRemove{
	constructor(parentEl, onClickCallback) {

		this.onClickCallback = onClickCallback;

		this.parentEl = parentEl;

		this.el = document.createElement('div');
		this.el.className = 'node-remove';

		const labelEl = document.createElement('h5');
		labelEl.className = 'label';
		labelEl.innerHTML = 'Remove';

		this.el.appendChild(labelEl);

		this.parentEl.appendChild(this.el);

		this.onClickBound = this.onClick.bind(this);

		this.el.addEventListener('click', this.onClickBound);
	}

	onClick(e) {

		e.stopPropagation();
		e.preventDefault();

		this.onClickCallback();
    }
    
    show() {
        this.el.classList.add('visible');
    }

    hide() {
        this.el.classList.remove('visible');
    }
}