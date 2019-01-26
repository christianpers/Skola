import MusicNode from './MusicNode';
import Tone from 'tone';

export default class SequencerNode extends MusicNode{
	constructor() {
		super();

		SequencerNode.ROWS = 12;
		SequencerNode.COLS = 16;

		this.isSequencer = true;
		this.loop = null;
		this.hasAudioInput = false;

		this.data = [];
		
		const rows = SequencerNode.ROWS;
		const cols = SequencerNode.COLS;

		for (let col = 0; col < cols; col++) {

			const colArr = [];
			for (let row = 0; row < rows; row++) {
				const obj = {active: false, el: null, parentEl: null, step: row};
				colArr.push(obj);
			}
			this.data.push(colArr);
		}

		this.onBtnClickBound = this.onBtnClick.bind(this);
	}

	getKey(col, row) {
		return `col${col}-row${row}`;
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
					console.log(time);
					//slightly randomized velocities
					// var vel = Math.random() * 0.5 + 0.5;
					// keys.get(noteNames[i]).start(time, 0, "32n", 0, vel);
					// console.log('play: ', ' col: ', col, ' row: ', row);
					this.onSequencerTrigger(column[row].step, time);

				}
			}
		}, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], "16n");

		this.loop.start();
	}

	onBtnClick(e) {
		e.stopPropagation();
		e.preventDefault();

		const col = parseInt(e.target.getAttribute('data-col'));
		const row = parseInt(e.target.getAttribute('data-row'));
		
		const btnData = this.data[col][row];
		
		btnData.active = !btnData.active;

		this.update();

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