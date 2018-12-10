import GlslCanvas from 'glslCanvas';

export default class GLCanvas{
	constructor(parentEl) {

		const canvasEl = document.createElement('canvas');
		canvasEl.width = 500;
		canvasEl.height = 500;
		canvasEl.className = 'glslCanvas';

		this.parentEl = parentEl;

		this.parentEl.appendChild(canvasEl);

		this.canvas = new GlslCanvas(canvasEl);
	}

	pause() {
		this.canvas.paused = true;
	}

	play() {
		this.canvas.paused = false;
	}
}