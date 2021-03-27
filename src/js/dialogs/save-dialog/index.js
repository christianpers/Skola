import './index.scss';

export default class SaveDialog{
    constructor(parentEl, canShowSaveDialog) {
        this.parentEl = parentEl;
        this._canShowSaveDialog = canShowSaveDialog;

        this.el = document.createElement('div');
        this.el.classList.add('save-dialog');
        this.el.classList.add('hidden');

        const html = `
            <div class="inner-content">
                <h4>Du har osparade ändringar</h4>
                <button type="button" class="save">
                    <h5>Spara nu</h5>
                </button>
                <button type="button" class="close">
                    <h5>Stäng</h5>
                </button>
            </div>
        `;

        this.el.innerHTML = html;

        this.parentEl.appendChild(this.el);

        this.onSaveBtn = this.el.querySelector('.save');
        this.onCloseBtn = this.el.querySelector('.close');

        this.onYesFn = null;
        this.onNoFn = null;
    }

    shouldShow() {
        return this._canShowSaveDialog();
    }

    show(onYes, onNo) {
        this.el.classList.remove('hidden');
        this.onYesFn = onYes;
        this.onNoFn = onNo;
        this.onSaveBtn.addEventListener('click', this.onYesFn);
        this.onCloseBtn.addEventListener('click', this.onNoFn);
    }

    hide() {
        this.el.classList.add('hidden');
        this.onSaveBtn.removeEventListener('click', this.onYesFn);
        this.onCloseBtn.removeEventListener('click', this.onNoFn);
    }
}