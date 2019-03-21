import MusicNode from './MusicNode';
import Tone from 'tone';
import SequencerManager from '../managers/SequencerManager';

export default class SequencerNode extends MusicNode{
	constructor() {
		super();

		SequencerNode.ROWS = 12;
		SequencerNode.COLS = 16;

		this.isSequencer = true;
		this.loop = null;
		this.hasAudioInput = false;
		this.isParam = true;

		this.data = [];
		
		const rows = SequencerNode.ROWS;
		const cols = SequencerNode.COLS;

		for (let col = 0; col < cols; col++) {

			const colArr = [];
			for (let row = 0; row < rows; row++) {
				const obj = {active: false, el: null, parentEl: null, step: (rows - 1) - row};
				colArr.push(obj);
			}
			this.data.push(colArr);
		}

		this.outConnections = [];
		this.outConnectionsLength = 0;

		this.isPlaying = false;

		this.onBtnClickBound = this.onBtnClick.bind(this);
	}

	init(pos, parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onParameterChange, onNodeRemove) {
		super.init(pos, parentEl, onConnectingCallback, onInputConnectionCallback, type, nodeConfig, onNodeActive, onParameterChange, onNodeRemove);

		this.sequencerManager = new SequencerManager(SequencerNode.COLS, SequencerNode.ROWS, this.ID);
	}

	removeFromDom() {
		this.sequencerManager.removeAllSynths();
		super.removeFromDom();
	}

	getKey(col, row) {
		return `col${col}-row${row}`;
	}

	onRemoveClick() {
		this.loop.stop();
		this.playEl.removeEventListener('click', this.onPlayClickBound);
		this.pauseEl.removeEventListener('click', this.onPauseClickBound);
		super.onRemoveClick();
	}

	createUI() {
		const rows = SequencerNode.ROWS;
		const cols = SequencerNode.COLS;

		const container = document.createElement('div');
		container.className = 'sequencer-container';

		for (let col = 0; col < cols; col++) {
			const rowArr = [];
			const colWrapperEl = document.createElement('div');
			colWrapperEl.className = 'sequencer-col';
			container.appendChild(colWrapperEl);
			for (let row = 0; row < rows; row++) {
				const el = document.createElement('div');
				el.className = 'sequencer-btn';
				el.setAttribute('data-col', col);
				el.setAttribute('data-row', row);
				colWrapperEl.appendChild(el);

				el.addEventListener('click', this.onBtnClickBound);

				this.data[col][row].el = el;
				this.data[col][row].parentEl = colWrapperEl;
			}
		}

		this.topPartEl.appendChild(container);

		const controlsContainer = document.createElement('div');
		controlsContainer.className = 'sequencer-controls';

		const innerControls = document.createElement('div');
		innerControls.className = 'inner-controls';

		this.playEl = document.createElement('h5');
		this.playEl.innerHTML = 'Spela';

		this.pauseEl = document.createElement('h5');
		this.pauseEl.innerHTML = 'Nollställ';

		this.onPlayClickBound = this.onPlayClick.bind(this);
		this.onPauseClickBound = this.onPauseClick.bind(this);

		this.playEl.addEventListener('click', this.onPlayClickBound);
		this.pauseEl.addEventListener('click', this.onPauseClickBound);

		innerControls.appendChild(this.playEl);
		innerControls.appendChild(this.pauseEl);
		controlsContainer.appendChild(innerControls);

		this.topPartEl.appendChild(controlsContainer);
	}

	onPlayClick() {
		if (this.isPlaying) {
			return;
		}
		this.isPlaying = true;
		this.loop.start();
	}

	onPauseClick() {
		this.isPlaying = false;
		this.loop.stop();

		this.reset();
	}

	reset() {
		const rows = SequencerNode.ROWS;
		const cols = SequencerNode.COLS;

		for (let col = 0; col < cols; col++) {
			const el = this.data[col][0].parentEl;
			el.classList.remove('active');
			
			for (let row = 0; row < rows; row++) {
			
				this.data[col][row].active = false;

			}
		}

		this.sequencerManager.removeAllSynths();

		this.update();
	}

	setup() {
		this.loop = new Tone.Sequence((time, col) => {

			for (let i = 0; i < SequencerNode.COLS; i++) {
				const el = this.data[i][0].parentEl;
				el.classList.remove('active');
			}
			
			const column = this.data[col];
			
			const colEl = this.data[col][0].parentEl;
			colEl.classList.add('active');
			
			for (let row = 0; row < SequencerNode.ROWS; row++){
				if (column[row].active){
					// console.log(time);
					//slightly randomized velocities
					// var vel = Math.random() * 0.5 + 0.5;
					// keys.get(noteNames[i]).start(time, 0, "32n", 0, vel);
					// console.log('play: ', ' col: ', col, ' row: ', row);
					if (this.outConnectionsLength > 0) {
						// this.onSequencerTrigger(column[row].step, time);
						this.sequencerManager.play(col, column[row].step, time);
					}
				}
			}
		}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "8n");

		// this.loop.start();
	}

	onBtnClick(e) {
		e.stopPropagation();
		e.preventDefault();

		const col = parseInt(e.target.getAttribute('data-col'));
		const row = parseInt(e.target.getAttribute('data-row'));
		
		const btnData = this.data[col][row];
		
		btnData.active = !btnData.active;

		if (btnData.active) {
			this.sequencerManager.addSynth(col, btnData.step);
		} else {
			this.sequencerManager.removeSynth(col, btnData.step);
		}
		
		this.update();
	}

	onOutputClick(clickPos) {

		if (this.outConnectionsLength === 0) {
			this.onConnectingCallback(this, clickPos);
		}

	}

	enableOutput(param, connectionData) {
		// super.enableOutput();
		this.output.enable();

		this.outConnections.push(connectionData.in);
		this.outConnectionsLength = this.outConnections.length;
	}

	disableOutput(inNode, param) {
		this.outConnections = this.outConnections.filter(t => t.ID !== inNode.ID);
		this.outConnectionsLength = this.outConnections.length;

		if (this.outConnections.length === 0) {
			// super.disableOutput();
			this.output.disable();
			this.sequencerManager.removeAllSynths();
			this.onPauseClick();
		}
	}

	update() {

		const rows = SequencerNode.ROWS;
		const cols = SequencerNode.COLS;

		for (let col = 0; col < cols; col++) {
			for (let row = 0; row < rows; row++) {
				const data = this.data[col][row];
				if (data.active) {
					data.el.classList.add('active');
				} else {
					data.el.classList.remove('active');
					
				}
			}
		}
	}
}