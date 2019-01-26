import GraphicNode from '../graphicNodes/GraphicNode';
import CanvasNode from '../graphicNodes/CanvasNode';

import SceneNode from '../graphicNodes/SceneNode';
import Render from '../graphicNodes/Render';

export default class GraphicsNodeManager{
	constructor(parentEl, onConnectingCallback, onInputConnectionCallback, addCallback, onNodeActive, onGraphicsParamChange) {

		this.parentEl = parentEl;
		this.onConnectingCallback = onConnectingCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.addCallback = addCallback;
		this.onNodeActive = onNodeActive;
		this.onGraphicsParamChange = onGraphicsParamChange;

		this.mainRender = new Render();

		this.sceneNode = new SceneNode(this.mainRender);
		this.sceneNode.init(
			parentEl,
			onConnectingCallback,
			onInputConnectionCallback,
			'Canvas',
		);

		this.addCallback(this.sceneNode);
	}

	createNode(data) {
		const node = new data.obj(this.sceneNode.framebuffer, this.mainRender);
		node.init(
			this.parentEl,
			this.onConnectingCallback,
			this.onInputConnectionCallback,
			data.type,
			undefined,
			undefined,
			this.onGraphicsParamChange,

		);
		
		node.onResize(this.sceneNode.getRenderWindowDimensions());
		
		this.addCallback(node);
	}

	onConnectionUpdate(connections) {
		this.sceneNode.onConnectionUpdate(connections);
	}

	onNodeParamChange() {

	}

	update() {
		this.sceneNode.update();
	}

	render() {
		this.sceneNode.render();
	}
}