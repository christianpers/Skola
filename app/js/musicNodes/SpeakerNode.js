import MusicNode from './MusicNode';
import Tone from 'tone';

export default class SpeakerNode extends MusicNode{
	constructor() {
		super();

		this.audioNode = Tone.context.destination;
		this.isSpeaker = true;

		
	}

	getAudioNode() {

		return Tone.context.destination;
	}
}