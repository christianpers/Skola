// import OscillatorNode from '../musicNodes/OscillatorNode';
// import GainNode from '../musicNodes/GainNode';
import SpeakerNode from '../musicNodes/SpeakerNode';
// import AnalyserNode from './musicNodes/AnalyserNode';
// import LowpassFilterNode from './musicNodes/LowpassFilterNode';
// import EnvelopeNode from './musicNodes/EnvelopeNode';
// import FrequencyEnvelopeNode from './musicNodes/FrequencyEnvelopeNode';
// import LFONode from './musicNodes/LFONode';
// import SignalMultiplier from './musicHelpers/mathNodes/SignalMultiplier';
import SequencerNode from '../musicNodes/SequencerNode';
import WaveformNode from '../musicNodes/WaveformNode';
// import FFTNode from './musicNodes/FFTNode';
import KickSynth from '../musicNodes/KickSynth';
import FMSynth from '../musicNodes/FMSynth';

// import LavaNoiseNode from './graphicNodes/ProceduralTextures/LavaNoise';
// import VoronoiNode from './graphicNodes/ProceduralTextures/Voronoi';
// import CircleNode from './graphicNodes/Shapes/CircleNode';
import CubeNode from '../graphicNodes/Shapes/CubeNode';
import SphereNode from '../graphicNodes/Shapes/SphereNode';
import ParamDriverNode from '../graphicNodes/ParamDriverNode';
import OrbitDriverNode from '../graphicNodes/OrbitDriverNode';
import RotationDriverNode from '../graphicNodes/RotationDriverNode';
// import SceneNode from './graphicNodes/SceneNode';
import ColorNode from '../graphicNodes/ColorNode';
import DirectionalLightNode from '../graphicNodes/Lights/DirectionalLightNode';
import PointLightNode from '../graphicNodes/Lights/PointLightNode';
import TextureSelectorNode from '../graphicNodes/TextureSelectorNode';
import ParticlesNode from '../graphicNodes/Shapes/ParticlesNode';
import ShapeNode from '../graphicNodes/ShapeNode';
import PlanetNode from '../graphicNodes/SpaceNodes/PlanetNode';
import SizeModifier from '../graphicNodes/SpaceNodes/SizeModifier';
import PlanetTextureSelector from '../graphicNodes/SpaceNodes/PlanetTextureSelector';
import SpaceOrbitNode from '../graphicNodes/SpaceNodes/SpaceOrbitNode';
import SunNode from '../graphicNodes/SpaceNodes/SunNode';

const nodeMapping = {
  'Kick': {
    obj: KickSynth,
  },
  'FMSynth': {
    obj: FMSynth,
  },
  'SequencerNode': {
    obj: SequencerNode,
  },
  'WaveformNode': {
    obj: WaveformNode,
  },
  'SpeakerNode': {
    obj: SpeakerNode,
  },
  'Sphere': {
    obj: SphereNode,
    isModifier: false,
  },
  'Cube': {
    obj: CubeNode,
    isModifier: false,
  },
  'ParamDriver': {
    obj: ParamDriverNode,
    isModifier: true,
  },
  'Orbit Modifier': {
    obj: OrbitDriverNode,
    isModifier: true,
  },
  'Rotation Modifier': {
    obj: RotationDriverNode,
    isModifier: true,
  },
  'Color': {
    obj: ColorNode,
    isModifier: true,
  },
  'Form': {
    obj: ShapeNode,
    isModifier: true,
  },
  'Directional Light': {
    obj: DirectionalLightNode,
    isModifier: false,
  },
  'Point Light': {
    obj: PointLightNode,
    isModifier: false,
  },
  'Texture Selector': {
    obj: TextureSelectorNode,
    isModifier: true,
  },
  'Particles': {
    obj: ParticlesNode,
    isModifier: false,
  },
  'Planet': {
    obj: PlanetNode,
    isModifier: false,
  },
  'Sun': {
    obj: SunNode,
    isModifier: false,
  },
  'Size Modifier': {
    obj: SizeModifier,
    isModifier: true,
  },
  'Texture Selector': {
    obj: PlanetTextureSelector,
    isModifier: true,
  },
  'Space Orbit': {
    obj: SpaceOrbitNode,
    isModifier: true,
  }
};

export const getNode = (nodeStr) => {
  return nodeMapping[nodeStr];
};