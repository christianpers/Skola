import { PERIODIC_SCHEME } from '../helpers';

import './index.scss';

export default class AtomHTMLLabel{
    constructor() {
        this._el = document.createElement('div');
        this._el.classList.add('atom-html-label');

        const html = `
            <p class="atom-type"></p>
            <p class="atom-charge"></p>
            <div class="detail-container protons">
                <p class="detail-number"></p>
            </div>
            <div class="detail-container electrons">
                <p class="detail-number"></p>
            </div>
        `;

        this._el.insertAdjacentHTML( 'beforeend', html );

        this._atomTypeEl = this._el.querySelector('.atom-type');
        this._atomChargeText = this._el.querySelector('.atom-charge');

        this._amountProtonsTextEl = this._el.querySelector('.protons .detail-number');
        this._amountElectronsTextEl = this._el.querySelector('.electrons .detail-number');

        this.amountProtons = 0;
        this.amountElectrons = 0;
    }

    get domEl() {
        return this._el;
    }

    set charge(value) {
        this._atomChargeText.innerHTML = value;
        this._charge = value;
    }

    set position({ x, y }) {
        this._el.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    }

    set amountProtons(value) {
        this._amountProtons = value;
        this.charge = this._amountProtons - this._amountElectrons;
        this._amountProtonsTextEl.innerHTML = value;
        this._atomTypeEl.innerHTML = PERIODIC_SCHEME[value] || '-';
    }

    set amountElectrons(value) {
        this._amountElectrons = value;
        this.charge = this._amountProtons - this._amountElectrons;
        this._amountElectronsTextEl.innerHTML = value;
    }
}