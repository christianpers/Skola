export default class VisualHelperSettings{
    constructor(parentEl, toggleVisibilityCallback, visualHelperEnabled) {
        this.parentEl = parentEl;
        this.toggleVisibilityCallback = toggleVisibilityCallback;

        this.el = document.createElement('div');
        this.el.classList.add('visual-helper-settings');

        this.parentEl.appendChild(this.el);

        const title = 'Visual Helper Settings';

        this.visibilityEnabled = !!visualHelperEnabled;

        const toggleVisibilityContainer = document.createElement('div');
        toggleVisibilityContainer.classList.add('toggle-visibility-container');

        const toggleVisibilityTitle = document.createElement('h4');
        toggleVisibilityTitle.innerHTML = 'Toggle visibility';

        this.toggleVisibilityEl = document.createElement('div');
        this.toggleVisibilityEl.classList.add('toggle-visibility');
        if (this.visibilityEnabled) {
            this.toggleVisibilityEl.classList.add('enabled');
        }
        
        toggleVisibilityContainer.appendChild(toggleVisibilityTitle);
        toggleVisibilityContainer.appendChild(this.toggleVisibilityEl);

        this.el.appendChild(toggleVisibilityContainer);

        this.onToggleVisibilityBound = this.onToggleVisibility.bind(this);
        this.toggleVisibilityEl.addEventListener('click', this.onToggleVisibilityBound);
    }

    onToggleVisibility() {
        this.visibilityEnabled = !this.visibilityEnabled;
        this.toggleVisibilityCallback(this.visibilityEnabled);

        if (this.visibilityEnabled) {
            this.toggleVisibilityEl.classList.add('enabled');
        } else {
            this.toggleVisibilityEl.classList.remove('enabled');
        }
    }

    enableVisibility() {
        this.visibilityEnabled = true;
        this.toggleVisibilityEl.classList.add('enabled');
    }

    disableVisibility() {
        this.visibilityEnabled = false;
        this.toggleVisibilityEl.classList.remove('enabled');
    }
}