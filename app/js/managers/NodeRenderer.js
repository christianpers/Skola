export default class NodeRenderer{
	constructor(parentEl, nodeManager) {

		this.parentEl = parentEl;

		this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.el.classList.add('line-renderer');
		// this.el.setAttribute('width', window.innerWidth);
		// this.el.setAttribute('height', window.innerHeight);
		
		parentEl.appendChild(this.el);

		this.nodeManager = nodeManager;

		// this.lines = [];
	}

	addLine(ID) {

		const line = document.createElementNS('http://www.w3.org/2000/svg','line');
		line.setAttribute('id', ID);
		line.setAttribute('x1','0');
		line.setAttribute('y1','0');
		line.setAttribute('x2','0');
		line.setAttribute('y2','0');
		line.setAttribute('stroke-width', '2');
		line.setAttribute("stroke", "white");
		line.setAttribute('stroke-linecap', 'round');

		this.el.appendChild(line);

		return line;

	}

	removeLine(line) {
		this.el.removeChild(line);
	}

	update() {

		// if (this.lines.length == this.nodeManager._nodeConnections.length) {
		// 	return;
		// }

		// const connectionsLength = this.nodeManager._nodeConnections.length;
		
		// for (let i = 0; i < connectionsLength; i++) {
		// 	const nodeConnection = this.nodeManager._nodeConnections[i];
		// 	if (!nodeConnection.lineEl)	
		// }

	}

	render() {

		const nodeW = 200;
		const nodeH = 100;
		const length = this.nodeManager._nodeConnections.length;
		for (let i = 0; i < length; i++) {
			const nodeOut = this.nodeManager._nodeConnections[i].out;
			const nodeIn = this.nodeManager._nodeConnections[i].in;

			const isParam = !!this.nodeManager._nodeConnections[i].param;

			// console.log('isparam', isParam, '   ', this.)

			const startX = nodeOut.moveCoords.offset.x + nodeW * .2;
			const startY = nodeOut.moveCoords.offset.y + (nodeH - nodeH * .2);
			const endX = nodeIn.moveCoords.offset.x;
			const endY = isParam ? nodeIn.moveCoords.offset.y + nodeH * .1 : nodeIn.moveCoords.offset.y + (nodeH - nodeH * .2);

			const line = this.nodeManager._nodeConnections[i].lineEl;
			line.setAttribute('x1', startX);
			line.setAttribute('y1', startY);
			line.setAttribute('x2', endX);
			line.setAttribute('y2', endY);
			const color = this.nodeManager._nodeConnections[i].param ? 'yellow' : 'white';
			line.setAttribute('stroke', color);
		}

	}
}