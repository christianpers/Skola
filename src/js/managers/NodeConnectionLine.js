export default class NodeConnectionLine{
	constructor(parentEl, resetConnecting) {

		this.ID = 999999999;
		this.resetConnecting = resetConnecting;

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

	onConnectionActive(nodeOut, clickPos, outputType) {

		const nodeH = 100;

		const dotPos = nodeOut.getOutDotPos(nodeOut.output ? nodeOut.output.el : null, outputType);
		const offsetPos = nodeOut.getOutputPos(outputType);
		
		const x = nodeOut.moveCoords.offset.x + offsetPos.x + dotPos.width;
		const y = nodeOut.moveCoords.offset.y + offsetPos.y + 7;

		this.startPos.x = clickPos.x;
		this.startPos.y = clickPos.y;

		const line = this.line;

		let color = nodeOut.isParam ? 'yellow' : 'red';
		if (nodeOut.outputs && nodeOut.outputs[outputType]) {
			const output = nodeOut.outputs[outputType];
			if (output.isParamOutput) {
				color = 'yellow';
			}
		}

		line.setAttribute('x1', x);
		line.setAttribute('y1', y);
		line.setAttribute('x2', x);
		line.setAttribute('y2', y);
		line.setAttribute("stroke", color);
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

		const startX = parseFloat(line.getAttribute('x1'));
		const startY = parseFloat(line.getAttribute('y1'));

		const deltaX = e.x - this.startPos.x;
		const deltaY = e.y - this.startPos.y;
		
		const x = startX + deltaX;
		const y = startY + deltaY;

		this.endPos.x = x;
		this.endPos.y = y;

		line.setAttribute('x2', x);
		line.setAttribute('y2', y);
	}

	onMouseClick(e) {

		window.removeEventListener('mousemove', this.onMouseMoveBound);
		window.removeEventListener('click', this.onMouseClickBound);

		this.resetConnecting();

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

	resetLine() {
		window.removeEventListener('mousemove', this.onMouseMoveBound);
		window.removeEventListener('click', this.onMouseClickBound);

		// this.resetConnecting();

		const line = this.line;

		const x = 0;
		const y = 0;

		line.setAttribute("stroke", "white");
		line.setAttribute('x1', x);
		line.setAttribute('y1', y);
		line.setAttribute('x2', x);
		line.setAttribute('y2', y);
		line.setAttribute("stroke-opacity", 0);
		console.log('reset connection');
	}

}