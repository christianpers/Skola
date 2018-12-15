import NodeManager from './managers/NodeManager';
import NodeLibrary from './managers/NodeLibrary/NodeLibrary';
import KeyboardManager from './managers/KeyboardManager';
import NodeSettings from './views/NodeSettings';

import OscillatorNode from './musicNodes/OscillatorNode';
import GainNode from './musicNodes/GainNode';
import SpeakerNode from './musicNodes/SpeakerNode';
import AnalyserNode from './musicNodes/AnalyserNode';
import LowpassFilterNode from './musicNodes/LowpassFilterNode';
import EnvelopeNode from './musicNodes/EnvelopeNode';
import FrequencyEnvelopeNode from './musicNodes/FrequencyEnvelopeNode';
import LFONode from './musicNodes/LFONode';
import SignalMultiplier from './musicHelpers/mathNodes/SignalMultiplier';

export default class Main{

	constructor(){

		this.historyState = {id: window.location.pathname};

		window.addEventListener('popstate', this.onPopStateChange.bind(this));

		this.nodeTypes = {
			audio: {
				audio: [
					{
						type: 'Oscillator',
						obj: OscillatorNode
					},
					{
						type: 'Gain',
						obj: GainNode
					}
				],
				data: [
					{
						type: 'LFO',
						obj: LFONode
					},
					{
						type: 'Envelope',
						obj: EnvelopeNode
					}
				]
			},
			graphics: {}
		}

		this.onNodeAddedFromLibraryBound = this.onNodeAddedFromLibrary.bind(this);

		this.nodeSettings = new NodeSettings(document.body);
		
		const nodeLibrary = new NodeLibrary(document.body, this.nodeTypes, this.onNodeAddedFromLibraryBound);

		const initData = {
			nodes: [
				// {
				// 	node: new OscillatorNode(),
				// 	type: 'Oscillator',
				// 	id: 1,
				// 	pos: [20, 50],
				// },
				// {
				// 	node: new GainNode(),
				// 	type: 'Amp',
				// 	id: 2,
				// 	pos: [600, 50],
				// },
				{
					node: new LowpassFilterNode(),
					type: 'LowpassFilterNode',
					id: 3,
					pos: [300, 50],
				},
				{
					node: new SpeakerNode(),
					type: 'SpeakerNode',
					id: 4,
					pos: [900, 200],
				},
				// {
				// 	node: new EnvelopeNode(),
				// 	type: 'EnvelopeNode',
				// 	id: 5,
				// 	pos: [460, 200],
				// },
				// {
				// 	node: new FrequencyEnvelopeNode(),
				// 	type: 'FrequencyEnvelopeNode',
				// 	id: 6,
				// 	pos: [160, 200],
				// },
				{
					node: new OscillatorNode(),
					type: 'Oscillator',
					id: 7,
					pos: [20, 400],
				},
				{
					node: new GainNode(),
					type: 'Amp',
					id: 8,
					pos: [600, 400],
				},
				// {
				// 	node: new LowpassFilterNode(),
				// 	type: 'LowpassFilterNode',
				// 	id: 9,
				// 	pos: [300, 400],
				// },
				{
					node: new EnvelopeNode(),
					type: 'EnvelopeNode',
					id: 10,
					pos: [460, 550],
				},
				// {
				// 	node: new FrequencyEnvelopeNode(),
				// 	type: 'FrequencyEnvelopeNode',
				// 	id: 11,
				// 	pos: [160, 550],
				// },
				{
					node: new LFONode(),
					type: 'LFONode',
					id: 12,
					pos: [800, 550],
				},
			],
			connections: [
				{
					in: 3,
					out: 7,
				},
				{
					in: 3,
					out: 12,
				},
				{
					in: 8,
					out: 10,
				},
				{
					in: 8,
					out: 3
				},
				{
					in: 4,
					out: 8,
				},
				// {
				// 	in: 3,
				// 	out: 6,
				// },

				// {
				// 	in: 9,
				// 	out: 7,
				// },
				// {
				// 	in: 8,
				// 	out: 9,
				// },
				// {
				// 	in: 4,
				// 	out: 8,
				// },
				// {
				// 	in: 8,
				// 	out: 10,
				// },
				// {
				// 	in: 9,
				// 	out: 11,
				// },
			]
		};

		this.keyboardManager = new KeyboardManager();

		this.onNodeActiveBound = this.onNodeActive.bind(this);

		this.nodeManager = new NodeManager(initData, this.keyboardManager, this.onNodeActiveBound);
		
	}

	onNodeActive(node) {
		this.nodeSettings.show(node);
	}

	onNodeAddedFromLibrary(data) {
		this.nodeManager.onNodeAddedFromLibrary(data);
	}

	onPopStateChange(e) {

		console.log('hash change: ', e);

	}

	pushState(id, url) {
		window.history.pushState({
			id,
		}, '', url);
	}

	update() {
		// if (this._vImages)
		// 	this._vImages.update();

		// this.nodeRenderer.update();
		this.nodeManager.update();
	}

	render() {

		this.nodeManager.render();
	}

	onResize(w,h){

	}

}