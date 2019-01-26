export default class NodeHeader{
	constructor(parentEl, parentTitle, addMarginTop) {

		this.el = document.createElement('div');
		this.el.className = 'node-param-header node-component';
		if (addMarginTop) {
			this.el.style.marginTop = '10px';
		}

		const labelEl = document.createElement('h2');
		labelEl.innerHTML = parentTitle;
		
		this.el.appendChild(labelEl);

		parentEl.appendChild(this.el);

	}
}