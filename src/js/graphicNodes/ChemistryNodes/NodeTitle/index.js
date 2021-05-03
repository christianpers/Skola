import './index.scss';
import { PERIODIC_SCHEME } from '../helpers';
import { ON_ATOM_CHARGE_CHANGE } from '../events';

export default class ChemistryNodeTitle {
    constructor(parentEl, node) {
        this.parentEl = parentEl;
        this.node = node;

        const container = document.createElement('div');
        container.className = 'chemistry-node-title';
        
        const innerContainer = document.createElement('div');
        innerContainer.className = 'node-inner-title';

        const label = document.createElement('p');
        label.innerHTML = 'Kemisk beteckning:';
        this.el = document.createElement('h4');
        this.el.innerHTML = '-';

        innerContainer.appendChild(label);
		innerContainer.appendChild(this.el);

        container.appendChild(innerContainer);

        parentEl.appendChild(container);

        this._onAtomChargeChange = this._onAtomChargeChange.bind(this);

        this.node.el.addEventListener(ON_ATOM_CHARGE_CHANGE, this._onAtomChargeChange);
    }

    _onAtomChargeChange({ detail: { protons = 0 } }) {
        this.el.innerHTML = PERIODIC_SCHEME[protons] || '-';
    }

    blurInput() {}
}