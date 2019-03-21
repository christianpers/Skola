export default class NodeOutput{
	constructor(parentEl, onClickCallback, isParam, hasInput, isSpeaker, isGraphicsNode) {

		this.isActive = false;
		this.onClickCallback = onClickCallback;

		this.parentEl = parentEl;

		this.isParamOutput = isParam;

		this.el = document.createElement('div');
		const classes = 
		this.el.className = `node-output node-component ${hasInput ? '' : 'right-align'} ${isParam ? 'param' : ''}`;
	
		const dotEl = document.createElement('div');
		dotEl.className = 'dot';

		this.el.appendChild(dotEl);

		const labelEl = document.createElement('p');
		labelEl.className = 'label';
		labelEl.innerHTML = isParam ? 'Data ut' : isGraphicsNode ? 'Grafik ut' : 'Ljud ut';

		this.el.appendChild(labelEl);

		this.parentEl.appendChild(this.el);

		this.onClickBound = this.onClick.bind(this);

		if (isSpeaker) {
			this.el.style.display = 'none';
			return;
		}

		this.el.addEventListener('click', this.onClickBound);

		this.offsetLeft = undefined;
		this.offsetTop = undefined;
	}

	getOffsetLeft() {
		if (!this.offsetLeft) {
			this.offsetLeft = this.el.offsetLeft;
		}

		return this.offsetLeft;
	}

	getOffsetTop() {
		if (!this.offsetTop) {
			this.offsetTop = this.el.offsetTop;
		}

		return this.offsetTop;
	}

	onClick(e) {

		e.stopPropagation();
		e.preventDefault();
		
		this.el.classList.add('selected');

		this.onClickCallback({x: e.x, y: e.y});
	}

	enable() {
		this.isActive = true;

		this.el.classList.add('active');
		this.el.classList.remove('selected');
	}

	disable() {
		this.isActive = false;

		this.el.classList.remove('active');
	}
}