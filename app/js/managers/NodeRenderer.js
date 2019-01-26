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
			const param = this.nodeManager._nodeConnections[i].param;

			const isParam = !!param;

			let inEl;
			if (isParam) {
				if (param.objSettings) {
					inEl = nodeIn.inputParams[param.objSettings.param].el;	
				} else {
					inEl = nodeIn.inputParams[param.title].el;
				}
			} else {
				inEl = nodeIn.input.el;
			}
			// const inEl = isParam ? nodeIn.inputParams[param.objSettings.param].el : nodeIn.input.el;
			const outDotPos = nodeOut.getDotPos(nodeOut.output.el);
			const inDotPos = nodeIn.getDotPos(inEl);

			// console.log('isparam', isParam, '   ', this.)

			const offsetXOut = nodeOut.output.el.offsetLeft;
			const offsetYOut = nodeOut.output.el.offsetTop;
			
			const startX = nodeOut.moveCoords.offset.x + offsetXOut + outDotPos.width - 3;
			const startY = nodeOut.moveCoords.offset.y + offsetYOut + 7;

			

			const offsetXIn = inEl.offsetLeft;
			const offsetYIn = inEl.offsetTop;
			
			const endX = nodeIn.moveCoords.offset.x + offsetXIn + 4;
			const endY = nodeIn.moveCoords.offset.y + offsetYIn + 7;


			// const startX = nodeOut.moveCoords.offset.x + outDotPos.left;
			// const startY = nodeOut.moveCoords.offset.y + outDotPos.top;
			// const endX = nodeIn.moveCoords.offset.x + inDotPos.left;
			// const endY = nodeIn.moveCoords.offset.y + inDotPos.top;

			const line = this.nodeManager._nodeConnections[i].lineEl;
			line.setAttribute('x1', startX);
			line.setAttribute('y1', startY);
			line.setAttribute('x2', endX);
			line.setAttribute('y2', endY);
			const color = this.nodeManager._nodeConnections[i].param ? 'yellow' : 'red';
			line.setAttribute('stroke', color);
		}

	}
}