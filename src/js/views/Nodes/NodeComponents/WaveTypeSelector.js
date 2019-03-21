export default class WaveTypeSelector{
	constructor(parentEl, onChange, defaultWave, param, label) {

		this.waves = [
			'sine',
			'sawtooth',
			'square',
			'triangle',
		];

		this.parentEl = parentEl;
		this.onChange = onChange;
		this.param = param;

		this.partialCount = 0;

		const labelEl = document.createElement('h4');
		labelEl.className = 'wave-type-label';
		labelEl.innerHTML = label;

		const waveTypeSelectorContainer = document.createElement('div');
		waveTypeSelectorContainer.className = 'wave-type-selector-container';

		waveTypeSelectorContainer.appendChild(labelEl);

		const waveTypesContainer = document.createElement('div');
		waveTypesContainer.className = 'wave-types-container';

		waveTypeSelectorContainer.appendChild(waveTypesContainer);

		this.onWaveClickBound = this.onWaveClick.bind(this);

		this.waveTypeEls = [];

		for (let i = 0; i < this.waves.length; i++) {

			const waveTypeEl = document.createElement('h4');
			waveTypeEl.className = 'wave-type';
			waveTypeEl.innerHTML = this.waves[i];
			waveTypeEl.setAttribute('data-wave', this.waves[i]);
			waveTypeEl.addEventListener('click', this.onWaveClickBound);

			this.waveTypeEls.push(waveTypeEl);

			waveTypesContainer.appendChild(waveTypeEl);
		}

		parentEl.appendChild(waveTypeSelectorContainer);

	}

	onWaveClick(e) {
		
		for (let i = 0; i < this.waveTypeEls.length; i++) {
			this.waveTypeEls[i].classList.remove('active');
		}

		const wave = e.target.getAttribute('data-wave');
		e.target.classList.add('active');

		this.onChange(wave, this.param);
	}

	remove() {

		for (let i = 0; i < this.waveTypeEls.length; i++) {
			this.waveTypeEls[i].removeEventListener('click', this.onWaveClickBound);
		}
		this.parentEl.removeChild(this.el);
	}
}