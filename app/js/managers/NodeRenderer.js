export default class NodeRenderer{
	constructor(parentEl, nodeManager) {

		this.parentEl = parentEl;

		this.el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.el.classList.add('line-renderer');
		// this.el.setAttribute('width', window.innerWidth);
		// this.el.setAttribute('height', window.innerHeight);
		
		parentEl.appendChild(this.el);

		this.nodeManager = nodeManager;

		this.onMouseEnterRemoveCircleBound = this.onMouseEnterRemoveCircle.bind(this);
		this.onMouseLeaveRemoveCircleBound = this.onMouseLeaveRemoveCircle.bind(this);
		this.onRemoveClickBound = this.onRemoveClick.bind(this);

		this.currentMouseOverObj = undefined;

		// this.lines = [];
	}

	addLine(ID) {

		const g = document.createElementNS('http://www.w3.org/2000/svg','g');
		const line = document.createElementNS('http://www.w3.org/2000/svg','line');
		const removeCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
		const removeText = document.createElementNS('http://www.w3.org/2000/svg','text');
		g.appendChild(line);
		g.appendChild(removeCircle);
		g.appendChild(removeText);
		g.setAttribute('id', ID);
		line.setAttribute('x1','0');
		line.setAttribute('y1','0');
		line.setAttribute('x2','0');
		line.setAttribute('y2','0');
		line.setAttribute('stroke-width', '2');
		line.setAttribute("stroke", "white");
		line.setAttribute('stroke-linecap', 'round');

		removeCircle.setAttribute('cx', '0');
		removeCircle.setAttribute('cy', '0');
		removeCircle.setAttribute('fill', 'black');
		removeCircle.setAttribute('stroke', 'red');
		removeCircle.setAttribute('stroke-width', '2');
		removeCircle.setAttribute('r', '10');
		removeCircle.addEventListener('mouseenter', this.onMouseEnterRemoveCircleBound);
		removeCircle.addEventListener('mouseleave', this.onMouseLeaveRemoveCircleBound);
		removeCircle.addEventListener('click', this.onRemoveClickBound);

		removeText.setAttribute('fill', 'white');

		this.el.appendChild(g);

		return {g, line, removeCircle, removeText};

	}

	removeLine(obj) {
		const circle = obj.removeCircle;
		circle.removeEventListener('mouseenter', this.onMouseEnterRemoveCircleBound);
		circle.removeEventListener('mouseleave', this.onMouseLeaveRemoveCircleBound);
		circle.removeEventListener('click', this.onRemoveClickBound);
		this.el.removeChild(obj.g);
	}

	onRemoveClick(e) {
		const gNode = e.target.parentNode;
		const lineID = gNode.getAttribute('id');

		const connectionData = this.nodeManager._nodeConnections.find(t => t.lineEl.g.getAttribute('id') === lineID);
		if (connectionData) {
			this.nodeManager.removeConnection(connectionData);
		}
	}

	onMouseEnterRemoveCircle(e) {
		const gNode = e.target.parentNode;
		const text = gNode.querySelector('text');
		text.textContent = 'Ta bort koppling';
		this.currentMouseOverObj = text;
	}

	onMouseLeaveRemoveCircle(e) {
		if (this.currentMouseOverObj && this.currentMouseOverObj.textContent) {
			this.currentMouseOverObj.textContent = '';
		}

		this.currentMouseOverObj = undefined;
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
			const inputType = this.nodeManager._nodeConnections[i].inputType;
			const outputType = this.nodeManager._nodeConnections[i].outputType;

			const isParam = !!param;

			let inObj;
			if (isParam) {
				inObj = nodeIn.inputParams[param.title];
			} else {
				inObj = nodeIn.getInputEl(inputType);
			}
			const outObj = nodeOut.getOutputEl(outputType);

			const outDotPos = nodeOut.getOutDotPos(nodeOut.output ? nodeOut.output.el : null, outputType);
			
			const offsetXOut = outObj.getOffsetLeft();
			const offsetYOut = outObj.getOffsetTop();
			
			const startX = nodeOut.moveCoords.offset.x + offsetXOut + outDotPos.width - 3;
			const startY = nodeOut.moveCoords.offset.y + offsetYOut + 7;

			const offsetXIn = inObj.getOffsetLeft();
			const offsetYIn = inObj.getOffsetTop();
			
			const endX = nodeIn.moveCoords.offset.x + offsetXIn + 4;
			const endY = nodeIn.moveCoords.offset.y + offsetYIn + 7;

			const line = this.nodeManager._nodeConnections[i].lineEl.line;
			line.setAttribute('x1', startX);
			line.setAttribute('y1', startY);
			line.setAttribute('x2', endX);
			line.setAttribute('y2', endY);
			const color = this.nodeManager._nodeConnections[i].param ? 'yellow' : 'red';
			line.setAttribute('stroke', color);

			const circle = this.nodeManager._nodeConnections[i].lineEl.removeCircle;
			const centerX = (startX + endX) / 2;
			const centerY = (startY + endY) / 2;
			circle.setAttribute('cx', centerX);
			circle.setAttribute('cy', centerY);
			circle.setAttribute('stroke', color);

			const text = this.nodeManager._nodeConnections[i].lineEl.removeText;
			text.setAttribute('x', centerX - 35);
			text.setAttribute('y', centerY - 20);

		}

	}
}