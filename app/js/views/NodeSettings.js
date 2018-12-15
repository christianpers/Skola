import RangeSlider from './Nodes/NodeComponents/RangeSlider';

export default class NodeSettings{
	constructor(parentEl) {

		this.el = document.createElement('div');
		this.el.className = 'node-settings';

		this.paramContainer = document.createElement('div');
		this.paramContainer.className = 'param-container';

		this.el.appendChild(this.paramContainer);

		parentEl.appendChild(this.el);

		this.currentParams = {};
		this.currentNode = null;

		this.onParameterChangeBound = this.onParameterChange.bind(this);

		window.addEventListener('mousedown', () => {
			this.hide();
		});

	}

	onParameterChange() {
		for (const key in this.currentParams) {
			const val = this.currentParams[key].getReadyValue();
			this.currentNode.setParamVal(val, key);
		}

		this.currentNode.onParameterUpdate();
	}

	show(node) {

		this.reset();

		this.el.classList.add('visible');
		this.currentNode = node;
		
		const params = node.params;
		for (const key in params) {
			const settings = params[key].objSettings;

			const obj = new params[key].obj(
				this.paramContainer,
				settings.title,
				settings.val,
				settings.range,
				this.onParameterChangeBound,
				settings.param,
				settings.decimals
			);

			this.currentParams[key] = obj;
		}
	}

	hide() {
		this.el.classList.remove('visible');

		this.reset();
	}

	reset() {
		for (const key in this.currentParams) {
			this.currentParams[key].remove();
		}

		this.currentNode = null;
		this.currentParams = {};
	}
}