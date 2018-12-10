import GraphicNode from '../graphicNodes/GraphicNode';
import * as SHADERS from '../../shaders/baseGradient';
import CanvasNode from '../graphicNodes/CanvasNode';

export default class GraphicsNodeManager{
	constructor(parentEl, onConnectingCallback, onInputConnectionCallback, addCallback) {

		const baseNode = new GraphicNode(
										parentEl,
										onConnectingCallback,
										onInputConnectionCallback,
										'Gradient',
										SHADERS.BASE_GRADIENT,
										'main',
										);
		addCallback(baseNode);

		this.canvasNode = new CanvasNode(
										parentEl,
										onConnectingCallback,
										onInputConnectionCallback,
										'Canvas'
										);

		addCallback(this.canvasNode);

	}

	update() {
		// this.canvasNode.update();

	}
}