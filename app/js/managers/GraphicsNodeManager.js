import GraphicNode from '../graphicNodes/GraphicNode';
import CanvasNode from '../graphicNodes/CanvasNode';

import SceneNode from '../graphicNodes/SceneNode';

export default class GraphicsNodeManager{
	constructor(parentEl, onConnectingCallback, onInputConnectionCallback, addCallback, onNodeActive, removeCallback) {

		this.parentEl = parentEl;
		this.onConnectingCallback = onConnectingCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.addCallback = addCallback;
		this.onNodeActive = onNodeActive;
		this.removeCallback = removeCallback;

		

	}

	createNode(data, pos) {
		const node = new data.obj();
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

	update() {
		this.sceneNode.update();
	}

	render() {
		this.sceneNode.render();
	}
}