import SynthCopy from '../musicHelpers/SynthCopy';

export default class SequencerManager{
	constructor(cols, rows, ID) {

		this.triggerID = ID;
		this.cols = cols;
		this.rows = rows;
		this.synths = [];
		this.masterSynth = new SynthCopy(0);

		for (let col = 0; col < cols; col++) {

			const colArr = [];
			for (let row = 0; row < rows; row++) {
				colArr.push({synth: null, isActive: false});
			}
			this.synths.push(colArr);
		}
	}

	init(connections) {
		this.masterSynth.updateConnections(connections);
	}

	removeAllSynths() {
		const cols = this.cols;
		const rows = this.rows;
		for (let col = 0; col < cols; col++) {
			for (let row = 0; row < rows; row++) {
				if (!this.synths[col][row].isActive) {
					continue;
				}

				this.synths[col][row].synth.reset();
				this.synths[col][row].isActive = false;
			}
		}
	}

	addSynth(col, row) {
		const synth = new SynthCopy(row);
		synth.updateConnections(this.masterSynth.currentConnections);
		this.synths[col][row].synth = synth;
		this.synths[col][row].isActive = true;
	}

	removeSynth(col, row) {
		if (!this.synths[col][row].isActive) {
			return;
		}

		this.synths[col][row].synth.reset();
		this.synths[col][row].isActive = false;
	}

	play(col, step, time) {
		this.synths[col][step].synth.play(time, this.triggerID);
	}

	onAudioNodeConnectionUpdate(connections) {
		const cols = this.cols;
		const rows = this.rows;
		for (let col = 0; col < cols; col++) {
			for (let row = 0; row < rows; row++) {
				if (!this.synths[col][row].isActive) {
					continue;
				}

				this.synths[col][row].synth.updateConnections(connections);
			}
		}

		this.masterSynth.updateConnections(connections);
	}

	onAudioNodeParamChange(node, params) {

		const cols = this.cols;
		const rows = this.rows;
		for (let col = 0; col < cols; col++) {
			for (let row = 0; row < rows; row++) {
				if (!this.synths[col][row].isActive) {
					continue;
				}
				
				this.synths[col][row].synth.onParamChange(node, params);
			}
		}

		this.masterSynth.onParamChange(node, params);
	}

}