export default class ToggleOrbitHelper{
    constructor(parentEl) {
		this.el = document.createElement('div');
		this.el.className = 'toggle-orbit-helper settings-item';

		this.label = document.createElement('h4');
		this.label.innerHTML = 'Dölj alla orbit helpers';

		this.el.appendChild(this.label);

		// this.toggleEl = document.createElement('div');
		// this.toggleEl.className = 'toggle-el';

		this.isEnabled = false;

		// this.el.appendChild(this.toggleEl);

		this.onClickBound = this.onClick.bind(this);

		this.el.addEventListener('click', this.onClickBound);

		parentEl.appendChild(this.el);
	}

	onClick(e) {
		e.stopPropagation();
		e.preventDefault();

		this.isEnabled = !this.isEnabled;

        const nodes = this.getNodes();

		if (this.isEnabled) {
			this.el.classList.add('enabled');
			this.label.innerHTML = 'Visa alla orbit helpers';
            nodes.forEach(node => {
                // node.visualHelperSettings.disableVisibility(true, false);
				node.onToggleVisualHelperVisibility(false, false);
            });
		} else {
			this.el.classList.remove('enabled');
			this.label.innerHTML = 'Dölj alla orbit helpers';

            nodes.forEach(node => {
                // node.visualHelperSettings.enableVisibility(true, false);
				node.onToggleVisualHelperVisibility(true, false);
            });
		}
	}

    getNodes() {
        const keys = Object.keys(window.NS.singletons.ConnectionsManager.nodes);
        return keys
            .filter(t => window.NS.singletons.ConnectionsManager.nodes[t].hasHelperMeshToHide)
            .map(t => window.NS.singletons.ConnectionsManager.nodes[t]);
    }
}