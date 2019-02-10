import MusicNode from './MusicNode';
import Tone from 'tone';
import AudioInputHelpers from '../musicHelpers/AudioInputHelpers';

export default class SpeakerNode extends MusicNode{
	constructor() {
		super();

		this.inputHelpersType = AudioInputHelpers.multiple;

		this.audioNode = Tone.context.destination;
		this.isSpeaker = true;
		
	}

	getAudioNode() {

		const compressor = Tone.context.createDynamicsCompressor();
		compressor.threshold.value = -50;
		compressor.knee.value = 40;
		compressor.ratio.value = 12;
		compressor.attack.value = 0;
		compressor.release.value = 0.25;
		compressor.connect(Tone.context.destination);

		return compressor;
	}
}