import GlslCanvas from 'glslCanvas';
import Node from '../views/Nodes/Node';
import * as SHADERS from '../../shaders/SHADERS';

export default class CanvasNode extends Node{

	constructor() {
		super();

		this.hasOutput = false;
		this.isGraphicsNode = true;

		const canvasEl = document.createElement('canvas');
		canvasEl.width = 200;
		canvasEl.height = 200;
		canvasEl.className = 'glslCanvas';

		this.el = document.createElement('div');
		this.el.className = 'node canvas';

		this.topPartEl = document.createElement('div');
		this.topPartEl.className = 'top-part';

		this.el.appendChild(this.topPartEl);

		this.bottomPartEl = document.createElement('div');
		this.bottomPartEl.className = 'bottom-part';

		this.el.appendChild(this.bottomPartEl);

		this.topPartEl.appendChild(canvasEl);

		this.canvas = new GlslCanvas(canvasEl);

		// this.connectedShaderMainNodes = [];
		// this.connectedShaderFunctionNodes = [];
	}

	getDotPos(el) {
		
		return el.getBoundingClientRect();
	}

	setup() {

	}

	enableInput(outputNode) {
		super.enableInput();

		if (outputNode.type === 'Analyser') {
			
		} else {
			// this.canvas.load(outputNode.shader);
			// outputNode.shaderType === 'main' ? this.connectedShaderMainNodes.push(outputNode) : this.connectedShaderFunctionNodes.push(outputNode);
			// this.connectedShaderNodes.push(outputNode);

			// this.reload([]);
		}

		
		// debugger;
		// outputAudioNode.connect(this.audioNode);
	}

	disableInput(nodeToDisconnect) {
		super.disableInput();

		if (nodeToDisconnect.type === 'Analyser') {
			
		} else {
			// const tempShaderMainNodes = this.connectedShaderMainNodes.filter(t => t.ID !== nodeToDisconnect.ID);
			// this.connectedShaderMainNodes = tempShaderMainNodes;

			// const tempShaderFunctionNodes = this.connectedShaderFunctionNodes.filter(t => t.ID !== nodeToDisconnect.ID);
			// this.connectedShaderFunctionNodes = tempShaderFunctionNodes;

			// this.reload([]);
		}
	}

	reload(connections) {

		let nodeShaders = '';
		for (let i = 0; i < connections.length; i++) {
			nodeShaders += connections[i].out.shader;
		}

		let shaderStr = SHADERS.BASE_SHADER;
		shaderStr += SHADERS.BASE_MAIN_HEADER;
		shaderStr += nodeShaders;
		shaderStr += SHADERS.BASE_MAIN_FOOTER;

		// console.log(nodeShaders);

		// for (let i = 0; i < this.connectedShaderFunctionNodes.length; i++) {
		// 	shaderStr += this.connectedShaderFunctionNodes[i].shader;
		// }

		// shaderStr += SHADERS.BASE_MAIN_HEADER;

		// for (let i = 0; i < this.connectedShaderMainNodes.length; i++) {
		// 	shaderStr += this.connectedShaderMainNodes[i].shader;
		// }

		// if (this.connectedShaderMainNodes.length === 0) {
		// 	shaderStr += SHADERS.EMPTY_WHITE;
		// }

		// shaderStr += SHADERS.BASE_MAIN_FOOTER;

		this.canvas.load(shaderStr);
	}
}