import MusicNode from './MusicNode';
import Tone from 'tone';

export default class Waveform extends MusicNode {
	constructor() {
		super();

		this.el.classList.add('no-height');
		this.el.classList.add('waveform-node');
		this.needsUpdate = true;
		this.needsManualDispose = true;
		this.isDisposed = false;

		this.arrSize = 256;

		this.isConnected = false;

		this.audioConnections = [];

		this.audioNode = Tone.context.createAnalyser();
		this.audioNode.fftSize = this.arrSize;

		this.canvas = document.createElement('canvas');
		this.canvas.className = 'waveform-canvas';
		this.canvas.width = '200';
		this.canvas.height = '100';
		this.ctx = this.canvas.getContext('2d');

		this.value = new Uint8Array(this.arrSize);

		this.topPartEl.appendChild(this.canvas);

		this.params = {};
	}

	dispose() {
		this.audioNode.disconnect();
		this.isDisposed = true;
	}

	enableInput(outNode) {
		super.enableInput(outNode);

		this.isConnected = true;
	}

	disableInput(outNode) {
		super.disableInput(outNode);

		this.isConnected = false;
	}

	getAudioNode() {

		if (this.isDisposed) {
			this.audioNode = Tone.context.createAnalyser();
			this.audioNode.fftSize = this.arrSize;
			this.isDisposed = false;
		}

		return this.audioNode;
	}

	update() {

		if (!this.isConnected) {
			return;
		}

		// this.value = this.audioNode.getValue();
		this.audioNode.getByteTimeDomainData(this.value);
	}

	render() {
		const w = this.canvas.width;
		const h = this.canvas.height;
		this.ctx.clearRect(0,0,w, h);

		this.ctx.fillStyle = 'black';
		this.ctx.strokeStyle = 'red';

		this.ctx.beginPath();
		for (let i = 0; i < this.arrSize; i++) {
			const x = (i / this.arrSize) * w;
			// const y = (((1 + this.value[i]) / 2) * h);
			const y = (this.value[i] / 256) * h;
			
			this.ctx.lineTo(x, y);
			// this.ctx.arc(x, y, 2, 0, 2 * Math.PI);
			// this.ctx.closePath();
			// this.ctx.fill();
		}

		this.ctx.stroke();
	}
}