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

		return Tone.context.destination;
	}
}