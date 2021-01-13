import './index.scss';

export default class CollapsedView{
    constructor(parentEl) {
        this.el = document.createElement('div');
        this.el.classList.add('collapsed-view');

        parentEl.appendChild(this.el);
    }

    setData(data) {
        const { amountNonagons } = data;
        const html = `
            <h5>Antal noder: ${amountNonagons}</h5>
        `;

        this.el.innerHTML = html;
    }
}
