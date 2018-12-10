export default class NodeLibrary{
	constructor(parentEl) {

		this.parentEl = parentEl;

		this.el = document.createElement('div');
		this.el.className = 'node-library';

		this.parentEl.appendChild(this.el);

	}
}