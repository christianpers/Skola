export default class CameraControlSetting{
	constructor(parentEl, foregroundController) {
		this.el = document.createElement('div');
		this.el.className = 'camera-control-setting';
		this.foregroundController = foregroundController;

		this.label = document.createElement('h4');
		this.label.innerHTML = 'Kamera kontroll (inaktiv)';

		this.el.appendChild(this.label);

		this.toggleEl = document.createElement('div');
		this.toggleEl.className = 'toggle-el';

		this.isEnabled = false;

		this.el.appendChild(this.toggleEl);

		this.onClickBound = this.onClick.bind(this);

		this.toggleEl.addEventListener('click', this.onClickBound);

		parentEl.appendChild(this.el);
	}

	onClick(e) {
		e.stopPropagation();
		e.preventDefault();

		this.isEnabled = !this.isEnabled;

		if (this.isEnabled) {
			this.toggleEl.classList.add('enabled');
			this.label.innerHTML = 'Kamera kontroll (aktiv)';
		} else {
			this.toggleEl.classList.remove('enabled');
			this.label.innerHTML = 'Kamera kontroll (inaktiv)';
		}

		this.foregroundController.toggleCameraControl(this.isEnabled);

	}
}