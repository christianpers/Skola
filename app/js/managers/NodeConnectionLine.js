export default class NodeConnectionLine{
	constructor(parentEl) {

		this.ID = 999999999;

		this.startPos = {x: 0, y: 0};
		this.endPos = {x: 0, y: 0};

		this.line = document.createElementNS('http://www.w3.org/2000/svg','line');
		this.line.setAttribute('id', this.ID);
		this.line.setAttribute('x1', this.startPos.x);
		this.line.setAttribute('y1', this.startPos.y);
		this.line.setAttribute('x2', this.endPos.x);
		this.line.setAttribute('y2', this.endPos.y);
		this.line.setAttribute('stroke-width', '2');
		this.line.setAttribute("stroke", "white");
		this.line.setAttribute('stroke-linecap', 'round');

		parentEl.appendChild(this.line);

		this.onMouseMoveBound = this.onMouseMove.bind(this);

		this.onMouseClickBound = this.onMouseClick.bind(this);

	}

	onConnectionActive(nodeOut) {

		const nodeH = 100;

		const startX = nodeOut.moveCoords.offset.x + 200 * .2;
		const startY = nodeOut.moveCoords.offset.y + (nodeH - nodeH * .2);

		const line = this.line;

		line.setAttribute('x1', startX);
		line.setAttribute('y1', startY);
		line.setAttribute('x2', startX);
		line.setAttribute('y2', startY);
		line.setAttribute("stroke", "red");
		line.setAttribute("stroke-opacity", .6);

		window.addEventListener('mousemove', this.onMouseMoveBound);
		window.addEventListener('click', this.onMouseClickBound);
	}

	onInputClick(inputAvailable, inputNode, nodeOut) {

		window.removeEventListener('mousemove', this.onMouseMoveBound);
		window.removeEventListener('click', this.onMouseClickBound);

		const line = this.line;

		const endX = inputNode.moveCoords.offset.x + 200;
		const endY = inputNode.moveCoords.offset.y + 100 / 2;

		const startX = nodeOut.moveCoords.offset.x + 200;
		const startY = nodeOut.moveCoords.offset.y + 100 / 2;

		const x = inputAvailable ? endX : startX;
		const y = inputAvailable ? endY : startY;

		line.setAttribute("stroke", "white");
		line.setAttribute("stroke-opacity", 0);
		line.setAttribute('x1', x);
		line.setAttribute('y1', y);
		line.setAttribute('x2', x);
		line.setAttribute('y2', y);
	}

	onMouseMove(e) {

		const line = this.line;

		line.setAttribute('x2', e.x);
		line.setAttribute('y2', e.y);
	}

	onMouseClick(e) {

		window.removeEventListener('mousemove', this.onMouseMoveBound);
		window.removeEventListener('click', this.onMouseClickBound);

		const line = this.line;

		const x = 0;
		const y = 0;

		line.setAttribute("stroke", "white");
		line.setAttribute('x1', x);
		line.setAttribute('y1', y);
		line.setAttribute('x2', x);
		line.setAttribute('y2', y);
		line.setAttribute("stroke-opacity", 0);
		console.log('click connection');
	}

}