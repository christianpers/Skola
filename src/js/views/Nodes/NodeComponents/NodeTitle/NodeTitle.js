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

		this.el = document.createElement('input');
		this.el.type = 'text';
		this.el.value = node.title;
        this.el.addEventListener('change', this.onChangeBound);
        this.el.addEventListener('click', this.onMouseDownBound);

        this.canvas = document.createElement('canvas');
        this.canvas.className = "node-title-canvas";
        this.canvas.width = 512;
        this.canvas.height = 128;
        this.ctx = this.canvas.getContext('2d');

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.font = '100pt Arial';
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.title, 256, 64);

        container.appendChild(this.canvas);

		innerContainer.appendChild(this.el);

		parentEl.appendChild(container);
    }

    mouseDown(e) {
        console.log('sdfsdf');

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
        console.log('on change: ', value);

		if (this.isValidInput(value)) {
            // this.callback(value);
            this.node.setTitle(value);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.ctx.font = '100pt Arial';
            this.ctx.fillStyle = '#000000';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(value, 256, 64);

		} else {
			this.el.value = this.node.title;
		}
	}
}