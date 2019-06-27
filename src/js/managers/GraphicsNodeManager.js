import Render from '../graphicNodes/Render';

export default class GraphicsNodeManager{
	constructor(
		parentEl,
		onDisconnectCallback,
		onInputConnectionCallback,
		addCallback,
		onNodeActive,
		removeCallback,
		onNodeDragStart,
		onNodeDragMove,
		onNodeDragRelease,
	) {

		this.parentEl = parentEl;
		this.onDisconnectCallback = onDisconnectCallback;
		this.onInputConnectionCallback = onInputConnectionCallback;
		this.addCallback = addCallback;
		this.onNodeActive = onNodeActive;
		this.removeCallback = removeCallback;
		this.onNodeDragStart = onNodeDragStart;
		this.onNodeDragMove = onNodeDragMove;
		this.onNodeDragRelease = onNodeDragRelease;

		this.mainRenderer = new Render();
	}

	createNode(data, pos) {
		const node = new data.obj(this.mainRenderer);
		node.init(
			pos,
			this.parentEl,
			this.onDisconnectCallback,
			this.onInputConnectionCallback,
			data.type,
			undefined,
			undefined,
			this.removeCallback,
			data.isModifier,
			this.onNodeDragStart,
			this.onNodeDragMove,
			this.onNodeDragRelease,
		);
		
		node.onResize({w: 540, h: 538});
		
		this.addCallback(node);
	}
}