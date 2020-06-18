import './index.scss';

export default class VerificationDialog{
    constructor(parentEl) {
        this.parentEl = parentEl;

        this.el = document.createElement('div');
        this.el.classList.add('verification-dialog');
        this.el.classList.add('hidden');

        const html = `
            <div class="inner-content">
                <h4>ÄR DU SÄKER ?</h4>
                <button type="button" class="yes-btn">
                    <h5>Ja</h5>
                </button>
                <button type="button" class="no-btn">
                    <h5>Nej</h5>
                </button>
            </div>
        `;

        this.el.innerHTML = html;

        this.parentEl.appendChild(this.el);

        this.onYesBtn = this.el.querySelector('.yes-btn');
        this.onNoBtn = this.el.querySelector('.no-btn');

        this.onYesFn = null;
        this.onNoFn = null;
    }

    show(onYes, onNo) {
        this.el.classList.remove('hidden');
        this.onYesFn = onYes;
        this.onNoFn = onNo;
        this.onYesBtn.addEventListener('click', this.onYesFn);
        this.onNoBtn.addEventListener('click', this.onNoFn);
    }

    hide() {
        this.el.classList.add('hidden');
        this.onYesBtn.removeEventListener('click', this.onYesFn);
        this.onNoBtn.removeEventListener('click', this.onNoFn);
    }
}