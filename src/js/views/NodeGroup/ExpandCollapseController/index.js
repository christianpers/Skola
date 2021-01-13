import './index.scss';

export default class ExpandCollapseController{
    constructor(parentEl) {
        this.el = document.createElement('div');
        this.el.classList.add('node-group-expand-collapse');

        this._parentEl = parentEl;

        this._statusEl = document.createElement('h5');
        this._statusEl.innerHTML = 'Minimera';
        this.el.appendChild(this._statusEl);

        parentEl.appendChild(this.el);

        this._onClick = this._onClick.bind(this);

        this.el.addEventListener('click', this._onClick);

        this._isExpanded = true;

    }

    _onClick(e) {
        const expanded = !this._isExpanded;

        this.isExpanded = expanded;
    }

    get isExpanded() {
        return this._isExpanded;
    }

    set isExpanded(value) {
        this._isExpanded = value;

        this._parentEl.setAttribute('collapsed', !this._isExpanded);
        const status = this._isExpanded ? 'Minimera' : 'Expandera';
        this._statusEl.innerHTML = status;
    }
}