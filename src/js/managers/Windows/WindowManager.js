import ConnectionWindow from './ConnectionWindow';
import NodeSettingsWindow from './NodeSettingsWindow';

export default class WindowManager{
    constructor(parentEl) {
        this.parentEl = parentEl;

        this.el = document.createElement('div');
        this.el.className = 'window-manager';

        this.parentEl.appendChild(this.el);

        this.activeNode = null;

        this.connectionWindow = new ConnectionWindow(this.el);
        this.nodeSettingsWindow = new NodeSettingsWindow(this.el);
    }

    showSettings(node) {
        this.nodeSettingsWindow.removeCurrent();
        if (this.activeNode) {
            this.activeNode.hideSettings();
        }
        this.activeNode = node;
        this.nodeSettingsWindow.show(node);
    }

    hideSettings() {
        this.nodeSettingsWindow.hide();
        if (this.activeNode) {
            this.activeNode.hideSettings();
        }
        this.activeNode = null;
    }
}