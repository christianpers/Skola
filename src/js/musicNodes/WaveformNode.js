import MusicNode from './MusicNode';
import Tone from 'tone';

import NodeOutput from '../views/Nodes/NodeComponents/NodeOutput';

export default class Waveform extends MusicNode {
	constructor() {
		super();

		this.el.classList.add('no-height');
		this.el.classList.add('waveform-node');
		this.needsUpdate = true;
		this.isAnalyser = true;
		this.isDisposed = false;
		this.hasMultipleOutputs = true;
		this.initAsNotCollapsed = true;

		this.arrSize = 256;

		this.audioValue = 0;

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

	init(pos, parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onParameterChange, onNodeRemove) {
		super.init(pos, parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onParameterChange, onNodeRemove);

		this.onOutputClickAudioBound = this.onOutputClickAudio.bind(this);
		this.onOutputClickDataBound = this.onOutputClickData.bind(this);

		const outputContainer = document.createElement('div');
		outputContainer.className = 'multiple-outputs';

		this.bottomPartEl.appendChild(outputContainer);

		this.outputAudio = new NodeOutput(outputContainer, this.onOutputClickAudioBound, false, false, false, false);
		this.outputData = new NodeOutput(outputContainer, this.onOutputClickDataBound, true, false, false, false);

		this.outputDataConnection = null;

		this.outputs = {
			'analyser-audio': this.outputAudio,
			'analyser-data': this.outputData,
		};

		this.enabledOutputs = [];
		this.inDotPos = {
			'analyser-audio': null,
			'analyser-data': null,
		};
	}

	onOutputClickAudio(pos) {

		this.onConnectingCallback(this, pos, 'analyser-audio');
	}

	onOutputClickData(pos) {

		this.onConnectingCallback(this, pos, 'analyser-data');
	}

	getOutputPos(type) {
		const obj = {
			x: this.outputs[type].el.offsetLeft,
			y: this.outputs[type].el.offsetTop,
		};

		return obj;
	}

	getOutDotPos(el, outputType) {
		if (!this.inDotPos[outputType]) {
			this.inDotPos[outputType] = this.outputs[outputType].el.getBoundingClientRect();
		}

		return this.inDotPos[outputType];
	}

	getOutputEl(outputType) {
		return this.outputs[outputType];
	}

	dispose() {
		if (!this.isDisposed) {
			this.audioNode.disconnect();
			this.isDisposed = true;
		}
		
	}

	enableInput(outNode) {
		super.enableInput(outNode);

		this.isConnected = true;
	}

	disableInput(outNode) {
		super.disableInput(outNode);

		this.isConnected = false;
	}

	enableOutput(param, connectionData) {
		const type = connectionData.outputType;

		this.outputs[type].enable();

		this.enabledOutputs.push(type);

		if (type === 'analyser-data') {
			this.outputDataConnection = connectionData;
		}

	}

	disableOutput(inNode, param, outputType) {
		this.outputs[outputType].disable();

		this.enabledOutputs = this.enabledOutputs.filter(t => t !== outputType);

		if (outputType === 'analyser-data') {
			this.audioValue = 0;
			this.outputDataConnection = null;
		}

	}

	getAudioNode() {

		if (this.isDisposed) {
			this.audioNode = Tone.context.createAnalyser();
			this.audioNode.fftSize = this.arrSize;
			this.isDisposed = false;
		}

		return this.audioNode;
	}

	getValue() {
		// console.log(this.isConnected ? this.audioValue : 0);
		return this.isConnected ? this.audioValue : 0;
	}

	update() {

		if (!this.isConnected) {
			return;
		}

		this.audioNode.getByteTimeDomainData(this.value);
	}

	render() {
		const w = this.canvas.width;
		const h = this.canvas.height;
		this.ctx.clearRect(0,0,w, h);

		this.ctx.fillStyle = 'black';
		this.ctx.strokeStyle = 'red';

		let aggregatedVal = 0;

		this.ctx.beginPath();
		for (let i = 0; i < this.arrSize; i++) {
			const x = (i / this.arrSize) * w;
			// const y = (((1 + this.value[i]) / 2) * h);
			const y = (1 - (this.value[i] / 256)) * h;

			aggregatedVal += (1 - (this.value[i] / 256));
			
			this.ctx.lineTo(x, y);
		}

		this.audioValue = ((aggregatedVal / this.arrSize) - .5) * 100.0;

		this.ctx.stroke();

		if (!this.outputDataConnection) {
			return;
		}

		if (this.outputDataConnection.param) {
			const param = this.outputDataConnection.param;
			this.outputDataConnection.in.updateParam(param, this);
		}

	}
}