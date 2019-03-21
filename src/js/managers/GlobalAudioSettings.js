import Tone from 'tone';
import NodeStepper from '../views/Nodes/NodeComponents/NodeStepper'

export default class GlobalAudioSettings{
	constructor(parentEl) {

		this.el = document.createElement('div');
		this.el.className = 'global-audio-settings';

		this.onBPMChangeBound = this.onBPMChange.bind(this);
		
		this.bpmNodeStepper = new NodeStepper(this.el, {min: 40, max: 200, label: 'BPM'}, Tone.Transport.bpm.value, this.onBPMChangeBound);

		parentEl.appendChild(this.el);
	}

	onBPMChange(val) {

		Tone.Transport.bpm.value = val;

	}
}
