import NodeRemove from '../../views/Nodes/NodeComponents/NodeRemove/index';

import './NodeSettingsWindow.scss';

export default class NodeSettingsWindow{
    constructor(parentEl, onShowCallback, onRemoveCallback) {
        this.parentEl = parentEl;
        this.onShowCallback = onShowCallback;
        this.onRemoveCallback = onRemoveCallback;

        this.el = document.createElement('div');
        this.el.className = 'node-settings-window window';

        this.bgLayer = document.createElement('div');
        this.bgLayer.className = 'bg-layer';
        this.bgLayer.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.hide();
        });

        this.el.appendChild(this.bgLayer);

        const label = document.createElement('h5');
        label.innerHTML = 'NODE SETTINGS';
        label.className = 'title';

        this.el.appendChild(label);

        this.isOpen = false;

        // this.nodeRemove = new NodeRemove(this.el, this.onRemoveCallback);

        this.closeBtn = document.createElement('h5');
        this.closeBtn.innerHTML = 'Hide';
        this.closeBtn.className = 'close-btn';

        this.onHideClickBound = this.onHideClick.bind(this);
        this.closeBtn.addEventListener('click', this.onHideClickBound);

        this.el.appendChild(this.closeBtn);

        this.parentEl.appendChild(this.el);

        this.currentSettingsEl = null;

        this.onClickBound = this.onClick.bind(this);

        this.el.addEventListener('click', this.onClickBound);
    }

    onClick() {
        // if (this.el.classList.contains('has-settings')) {
        //     this.show();
        // }
        this.show();
    }

    onHideClick(e) {

        e.preventDefault();
        e.stopPropagation();
        this.hide();
    }

    removeCurrent() {
        if (!this.currentSettingsEl || (this.currentSettingsEl && this.currentSettingsEl.parentNode !== this.el)) {
            return;
        }
        this.el.removeChild(this.currentSettingsEl);

        this.el.classList.remove('has-settings');
    }

    setupForNode(node) {
        this.removeCurrent();
        if (!node.getSettings) {
            return;
        }
        const settings = node.getSettings();
        
        this.currentSettingsEl = settings;
        this.el.appendChild(settings);

        if (node.afterSettingsAddedToDom) {
            node.afterSettingsAddedToDom();
        }

        this.el.classList.add('has-settings');
    }

    checkForUpdates(node) {
        if (node.refreshSettings) {
            console.log('sss');
            this.removeCurrent();
            this.setupForNode(node);
        }
    }

    show() {
        this.onShowCallback();

        this.el.classList.add('visible');

        // this.nodeRemove.show();
    }

    hide() {
        this.el.classList.remove('visible');

        // this.nodeRemove.hide();
    }

    blur() {
        this.hide();
        this.removeCurrent();
    }
}