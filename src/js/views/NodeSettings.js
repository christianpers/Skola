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
			this.currentNode.setParamVal(val, this.currentParams[key].parameter);
		}

		this.currentNode.onParameterUpdate();
	}

	show(node) {

		this.reset();

		
		this.currentNode = node;
		
		const params = node.params;
		for (const key in params) {

			if (!params[key].obj) {
				continue;
			}
			
			const settings = params[key].objSettings;

			const val = node.paramVals[settings.param];


			const obj = new params[key].obj(
				this.paramContainer,
				settings.title,
				val,
				settings.range,
				this.onParameterChangeBound,
				settings.param,
				settings.decimals,
				params[key].isConnected && settings.param === 'gain'
			);

			this.currentParams[key] = obj;
		}

		if (Object.keys(params).length > 0) {
			this.el.classList.add('visible');
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