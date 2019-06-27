export default class NodeSettingsWindow{
    constructor(parentEl) {
        this.parentEl = parentEl;

        this.el = document.createElement('div');
        this.el.className = 'node-settings-window window';

        const label = document.createElement('h5');
        label.innerHTML = 'NODE SETTINGS';
        label.className = 'title';

        this.el.appendChild(label);

        this.closeBtn = document.createElement('h5');
        this.closeBtn.innerHTML = 'Hide';
        this.closeBtn.className = 'close-btn';

        this.onHideClickBound = this.onHideClick.bind(this);
        this.closeBtn.addEventListener('click', this.onHideClickBound);

        this.el.appendChild(this.closeBtn);

        this.parentEl.appendChild(this.el);

        this.currentSettingsEl = null;
    }

    onHideClick() {
        this.hide();
    }

    removeCurrent() {
        if (!this.currentSettingsEl || (this.currentSettingsEl && this.currentSettingsEl.parentNode !== this.el)) {
            return;
        }
        this.el.removeChild(this.currentSettingsEl);
    }

    show(node) {
        this.removeCurrent();
        const settings = node.getSettings();
        this.currentSettingsEl = settings;
        this.el.appendChild(settings);

        if (node.afterSettingsAddedToDom) {
            node.afterSettingsAddedToDom();
        }

        this.el.classList.add('visible');
    }

    hide() {
        this.el.classList.remove('visible');
    }
}