import NodeManager from './managers/NodeManager';
import NodeLibrary from './managers/NodeLibrary/NodeLibrary';
import KeyboardManager from './managers/KeyboardManager';
import NodeSettings from './views/NodeSettings';
import WorkspaceManager from './managers/WorkspaceManager';
import GlobalAudioSettings from './managers/GlobalAudioSettings';
import WorkspaceScaleManager from './managers/WorkspaceManager/WorkspaceScaleManager';

import ConnectionsManager from './managers/ConnectionsManager';

import OscillatorNode from './musicNodes/OscillatorNode';
import GainNode from './musicNodes/GainNode';
import SpeakerNode from './musicNodes/SpeakerNode';
import AnalyserNode from './musicNodes/AnalyserNode';
import LowpassFilterNode from './musicNodes/LowpassFilterNode';
import EnvelopeNode from './musicNodes/EnvelopeNode';
import FrequencyEnvelopeNode from './musicNodes/FrequencyEnvelopeNode';
import LFONode from './musicNodes/LFONode';
import SignalMultiplier from './musicHelpers/mathNodes/SignalMultiplier';
import SequencerNode from './musicNodes/SequencerNode';
import WaveformNode from './musicNodes/WaveformNode';
import FFTNode from './musicNodes/FFTNode';
import KickSynth from './musicNodes/KickSynth';
import FMSynth from './musicNodes/FMSynth';

import Tone from 'tone';

export default class Main{

	constructor(){

		Tone.Transport.bpm.value = 140;
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
				],
				synthar: [
					{
						type: 'Kick',
						obj: KickSynth,
					},
					{
						type: 'FM Synth',
						obj: FMSynth,
					},
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
				'Ljud analys': [
					{
						type: 'Ljudvåg',
						obj: WaveformNode,
					},
					// {
					// 	type: 'Frekvens',
					// 	obj: FFTNode,
					// }
				]
			},
			graphics: {
				'3D - Shapes': [
					{
						type: 'Cube',
						isModifier: false,
					},
					{
						type: 'Sphere',
						isModifier: false,
					},
					{
						type: 'Particles',
						isModifier: false,
					},
				],
				'Procedural Texture (Material)': [
					{
						type: 'Circle',
						isModifier: false,
					},
					{
						type: 'Voronoi',
						isModifier: false,
					},
					{
						type: 'LavaNoise',
						isModifier: false,
					},
					
				],
				'Modifiers' : [
					{
						type: 'Color',
						isModifier: true,
					},
					{
						type: 'ParamDriver',
						isModifier: true,
					},
					{
						type: 'OrbitDriver',
						isModifier: true,
					},
				],
				'Ljus': [
					{
						type: 'Directional Light',
						isModifier: false,
					},
					{
						type: 'Point Light',
						isModifier: false,
					},
				],
				'Textures': [
					{
						type: 'Texture Selector',
						isModifier: true,
					},
				]
			}
		}

		this.onNodeAddedFromLibraryBound = this.onNodeAddedFromLibrary.bind(this);

		// this.nodeSettings = new NodeSettings(document.body);

		this.onWorkspaceClickBound = this.onWorkspaceClick.bind(this);

		this.workspaceManager = new WorkspaceManager(document.body, this.onWorkspaceClickBound);

		this.onScaleChangeBound = this.onScaleChange.bind(this);
		// this.scaleManager = new WorkspaceScaleManager(document.body, this.onScaleChangeBound);

		// this.globalAudioSettings = new GlobalAudioSettings(this.workspaceManager.containerEl);

		this.onResize();
		
		this.nodeLibrary = new NodeLibrary(
			document.body,
			this.nodeTypes,
			this.onNodeAddedFromLibraryBound,
			this.workspaceManager,
		);

		this.nodeManager = new NodeManager(null, this.keyboardManager, this.onNodeActiveBound, this.workspaceManager.el, this.nodeLibrary);


		// window.NS = {};
		window.NS.singletons.ConnectionsManager = new ConnectionsManager();

		this.keyboardManager = new KeyboardManager();

		this.onNodeActiveBound = this.onNodeActive.bind(this);

	}

	init(selectedDrawing) {
		this.nodeManager.init(selectedDrawing);
	}

	onLogout() {
		this.nodeLibrary.hide();
		this.workspaceManager.disable();
		this.keyboardManager.disable();

		const nodes = this.nodeManager._nodes;
		for (let i = 0; i < nodes.length; i++) {
			this.nodeManager.onNodeRemove(nodes[i]);
		}
	}

	onLogin() {
		this.nodeLibrary.show();
		this.workspaceManager.enable();
		this.keyboardManager.enable();
	}

	onScaleChange(val) {
		console.log(val);

		// this.workspaceManager.setScale(val);
	}

	onWorkspaceClick() {
		this.nodeManager.windowManager.blur();
		this.nodeManager.onNodeSelectedEvent();
	}

	onNodeActive(node) {
		this.nodeSettings.show(node);
	}

	onNodeAddedFromLibrary(type, data, e) {
		this.nodeManager.initNode(type, data, e);
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
		this.nodeManager.update();
	}

	render() {
		this.nodeManager.render();
	}

	onResize(w, h) {
		this.workspaceManager.onResize(w, h);
		// this.scaleManager.onResize(h);
	}

}