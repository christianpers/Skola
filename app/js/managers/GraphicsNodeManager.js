import Render from '../graphicNodes/Render';

export default class GraphicsNodeManager{
	constructor(parentEl, onConnectingCallback, onInputConnectionCallback, addCallback, onNodeActive, removeCallback) {

		this.parentEl = parentEl;
		this.onConnectingCallback = onConnectingCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.addCallback = addCallback;
		this.onNodeActive = onNodeActive;
		this.removeCallback = removeCallback;

		this.mainRenderer = new Render();

	}

	createNode(data, pos) {
		const node = new data.obj(this.mainRenderer);
		node.init(
			pos,
			this.parentEl,
			this.onConnectingCallback,
			this.onInputConnectionCallback,
			data.type,
			undefined,
			undefined,
			this.removeCallback,
		);
		
		node.onResize({w: 540, h: 538});
		
		this.addCallback(node);
	}
}