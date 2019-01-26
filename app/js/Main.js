import NodeManager from './managers/NodeManager';
import NodeLibrary from './managers/NodeLibrary/NodeLibrary';
import KeyboardManager from './managers/KeyboardManager';
import NodeSettings from './views/NodeSettings';
import WorkspaceManager from './managers/WorkspaceManager';

import OscillatorNode from './musicNodes/OscillatorNode';
import GainNode from './musicNodes/GainNode';
import SpeakerNode from './musicNodes/SpeakerNode';
import AnalyserNode from './musicNodes/AnalyserNode';
import LowpassFilterNode from './musicNodes/LowpassFilterNode';
import EnvelopeNode from './musicNodes/EnvelopeNode';
import FrequencyEnvelopeNode from './musicNodes/FrequencyEnvelopeNode';
import LFONode from './musicNodes/LFONode';
import SignalMultiplier from './musicHelpers/mathNodes/SignalMultiplier';
import CompressorNode from './musicNodes/CompressorNode';
import SequencerNode from './musicNodes/SequencerNode';

import LavaNoiseNode from './graphicNodes/ProceduralTextures/LavaNoise';
import CircleNode from './graphicNodes/Shapes/CircleNode';
import CubeNode from './graphicNodes/Shapes/CubeNode';
import ColorNode from './graphicNodes/ColorNode';
import PositionNode from './graphicNodes/PositionNode';
import RotationNode from './graphicNodes/RotationNode';
import ParamDriverNode from './graphicNodes/ParamDriverNode';

import Tone from 'tone';

export default class Main{

	constructor(){

		Tone.Transport.bpm.value = 80;
		Tone.Transport.start();

		this.historyState = {id: window.location.pathname};

		window.addEventListener('popstate', this.onPopStateChange.bind(this));

		window.addEventListener('resize', () => {

			this.onResize();
		});

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
					},
					{
						type: 'Filter',
						obj: LowpassFilterNode,
					},
					{
						type: 'Speaker',
						obj: SpeakerNode,
					},
					{
						type: 'Compressor',
						obj: CompressorNode,
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
				],
				triggers: [
					{
						type: 'SequencerNode',
						obj: SequencerNode,
					}
				],
			},
			graphics: {
				'3D - Shapes': [
					{
						type: 'Cube',
						obj: CubeNode,
					}
				],
				'Procedural Texture (Material)': [
					{
						type: 'Circle',
						obj: CircleNode,
					},
					{
						type: 'LavaNoise',
						obj: LavaNoiseNode,
					},
				],
				'Modifiers' : [
					{
						type: 'ParamDriver',
						obj: ParamDriverNode,
					},
				]
			}
		}

		this.onNodeAddedFromLibraryBound = this.onNodeAddedFromLibrary.bind(this);

		this.nodeSettings = new NodeSettings(document.body);

		this.workspaceManager = new WorkspaceManager(document.body);

		this.onResize();
		
		const nodeLibrary = new NodeLibrary(document.body, this.nodeTypes, this.onNodeAddedFromLibraryBound);

		const initData = {
			nodes: [
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
				{
					node: new EnvelopeNode(),
					type: 'EnvelopeNode',
					id: 10,
					pos: [460, 550],
				},
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
			]
		};

		this.keyboardManager = new KeyboardManager();

		this.onNodeActiveBound = this.onNodeActive.bind(this);

		this.nodeManager = new NodeManager(null, this.keyboardManager, this.onNodeActiveBound, this.workspaceManager.el);
	}

	onNodeActive(node) {
		this.nodeSettings.show(node);
	}

	onNodeAddedFromLibrary(type, data) {
		this.nodeManager.onNodeAddedFromLibrary(type, data);
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

	onResize() {
		const w = window.innerWidth;
		const h = window.innerHeight;
		this.workspaceManager.onResize(w, h);
	}

}