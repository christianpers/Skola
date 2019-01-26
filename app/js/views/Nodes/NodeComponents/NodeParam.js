export default class NodeParam{
	constructor(parentEl, param, onClickCallback, parentTitle) {

		this.el = document.createElement('div');
		this.el.className = 'node-param node-component';

		this.param = param;

		const dotEl = document.createElement('div');
		dotEl.className = 'dot';

		this.el.appendChild(dotEl);

		const labelEl = document.createElement('p');
		
		labelEl.className = 'label';
		if (param.objSettings) {
			labelEl.innerHTML = param.objSettings.param;
		} else {
			labelEl.innerHTML = param.param;
		}
		
		this.el.appendChild(labelEl);

		parentEl.appendChild(this.el);

		this.el.addEventListener('click', () => {
			onClickCallback(param);
		});
	}

	enable() {
		this.el.classList.add('active');
	}

	disable() {
		this.el.classList.remove('active');

	}
}