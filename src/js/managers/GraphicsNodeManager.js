import Render from '../graphicNodes/Render';
import SceneNode from '../graphicNodes/SceneNode/SceneNode';
import SpaceSceneNode from '../graphicNodes/SceneNode/SpaceSceneNode';
import { getNode } from '../helpers/node-mapping';

export default class GraphicsNodeManager{
	constructor(
		parentEl,
		onDisconnectCallback,
		onInputConnectionCallback,
		addCallback,
		removeCallback,
		onNodeDragStart,
		onNodeDragMove,
		onNodeDragRelease,
	) {

		this.parentEl = parentEl;
		this.onDisconnectCallback = onDisconnectCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.addCallback = addCallback;
		this.removeCallback = removeCallback;
		this.onNodeDragStart = onNodeDragStart;
		this.onNodeDragMove = onNodeDragMove;
		this.onNodeDragRelease = onNodeDragRelease;

		this.mainRenderer = new Render();
	}

	createNode(data, pos, backendData) {
		const nodeObj = getNode(data.type);
		const obj = nodeObj.obj;
		const isModifier = nodeObj.isModifier;
		const node = new obj(this.mainRenderer, backendData);
		node.init(
			pos,
			this.parentEl,
			this.onDisconnectCallback,
			this.onInputConnectionCallback,
			data.type,
			backendData,
			this.removeCallback,
			isModifier,
			this.onNodeDragStart,
			this.onNodeDragMove,
			this.onNodeDragRelease,
			this.addCallback,
		);
		
		node.onResize({w: 540, h: 538});

		return node;
	}

	createCanvasNode() {
		let canvasNode;
		if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.space.id) {
			canvasNode = new SpaceSceneNode(this.mainRenderer);
		} else {
			canvasNode = new SceneNode(this.mainRenderer);
		}
		
		const parentEl = document.querySelector('.workspace-container');
		canvasNode.init(parentEl);

		return canvasNode;
	}
}