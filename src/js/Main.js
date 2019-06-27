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

import LavaNoiseNode from './graphicNodes/ProceduralTextures/LavaNoise';
import VoronoiNode from './graphicNodes/ProceduralTextures/Voronoi';
import CircleNode from './graphicNodes/Shapes/CircleNode';
import CubeNode from './graphicNodes/Shapes/CubeNode';
import SphereNode from './graphicNodes/Shapes/SphereNode';
import ParamDriverNode from './graphicNodes/ParamDriverNode';
import OrbitDriverNode from './graphicNodes/OrbitDriverNode';
import SceneNode from './graphicNodes/SceneNode';
import ColorNode from './graphicNodes/ColorNode';
import DirectionalLightNode from './graphicNodes/Lights/DirectionalLightNode';
import PointLightNode from './graphicNodes/Lights/PointLightNode';
import TextureSelectorNode from './graphicNodes/Textures/TextureSelectorNode';
import ParticlesNode from './graphicNodes/Shapes/ParticlesNode';

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
				'Canvas': [
					{
						type: 'Canvas',
						obj: SceneNode,
						isModifier: false,
					}
				],
				'3D - Shapes': [
					{
						type: 'Cube',
						obj: CubeNode,
						isModifier: false,
					},
					{
						type: 'Sphere',
						obj: SphereNode,
						isModifier: false,
					},
					{
						type: 'Particles',
						obj: ParticlesNode,
						isModifier: false,
					},
				],
				'Procedural Texture (Material)': [
					{
						type: 'Circle',
						obj: CircleNode,
						isModifier: false,
					},
					{
						type: 'Voronoi',
						obj: VoronoiNode,
						isModifier: false,
					},
					{
						type: 'LavaNoise',
						obj: LavaNoiseNode,
						isModifier: false,
					},
					
				],
				'Modifiers' : [
					{
						type: 'Color',
						obj: ColorNode,
						isModifier: true,
					},
					{
						type: 'ParamDriver',
						obj: ParamDriverNode,
						isModifier: true,
					},
					{
						type: 'OrbitDriver',
						obj: OrbitDriverNode,
						isModifier: true,
					},
				],
				'Ljus': [
					{
						type: 'Directional Light',
						obj: DirectionalLightNode,
						isModifier: false,
					},
					{
						type: 'Point Light',
						obj: PointLightNode,
						isModifier: false,
					},
				],
				'Textures': [
					{
						type: 'Välj Textur',
						obj: TextureSelectorNode,
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

		// window.NS = {};
		window.NS.singletons = {};
		window.NS.singletons.ConnectionsManager = new ConnectionsManager();

		this.keyboardManager = new KeyboardManager();

		this.onNodeActiveBound = this.onNodeActive.bind(this);

		this.nodeManager = new NodeManager(null, this.keyboardManager, this.onNodeActiveBound, this.workspaceManager.el);
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
		this.nodeManager.nodeSettingsWindow.hide();
	}

	onNodeActive(node) {
		this.nodeSettings.show(node);
	}

	onNodeAddedFromLibrary(type, data, e) {
		this.nodeManager.onNodeAddedFromLibrary(type, data, e);
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