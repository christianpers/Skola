import './NodeTitle.scss';

export default class NodeTitle{
    constructor(parentEl, node) {
        this.parentEl = parentEl;
        this.node = node;

        const container = document.createElement('div');
        container.className = 'node-title prevent-drag';
        
        const innerContainer = document.createElement('div');
        innerContainer.className = 'node-inner-title';

        container.appendChild(innerContainer);

		const label = document.createElement('h4');
		label.innerHTML = 'Node Title';

        this.onChangeBound = this.onChange.bind(this);
        this.onMouseDownBound = this.mouseDown.bind(this);
        this.onFocusBound = this.onFocus.bind(this);
        this.onBlurBound = this.onBlur.bind(this);

		this.el = document.createElement('input');
		this.el.type = 'text';
		this.el.value = node.title;
        this.el.addEventListener('change', this.onChangeBound);
        this.el.addEventListener('click', this.onMouseDownBound);
        this.el.addEventListener('focus', this.onFocusBound);
        this.el.addEventListener('blur', this.onBlurBound);

		innerContainer.appendChild(this.el);

        if (window.NS.showDebug()) {
            const debugEl = document.createElement('h5');
            debugEl.innerHTML = node.ID;

            innerContainer.appendChild(debugEl);
        }
        
		parentEl.appendChild(container);
    }

    onFocus() {
        window.NS.singletons.CanvasNode.foregroundRender.toggleCameraControl(false);
    }

    onBlur() {
        window.NS.singletons.CanvasNode.foregroundRender.toggleCameraControl(true);
    }

    mouseDown(e) {
        e.stopPropagation();
    }

    blurInput() {
        this.el.blur();
    }

    isValidInput(value) {
		// if (!this.regExp.test(value)) {
		// 	return false;
		// }

		return true;
	}

	onChange(e) {
        const value = this.el.value;

		if (this.isValidInput(value)) {
            this.node.setTitle(value);
            this.blurInput();
           

		} else {
			this.el.value = this.node.title;
		}
	}
}