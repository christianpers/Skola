import ConnectionWindow from './ConnectionWindow';
import NodeSettingsWindow from './NodeSettingsWindow';

export default class WindowManager{
    constructor(parentEl, enableParamCallback, disableParamCallback) {
        this.parentEl = parentEl;

        this.activeNode = null;

        this.onConnectionWindowShowBound = this.onConnectionWindowShow.bind(this);
        this.onNodeSettingsWindowShowBound = this.onNodeSettingsWindowShow.bind(this);
        this.onNodeRemoveClickBound = this.onNodeRemoveClick.bind(this);

        this.connectionWindow = new ConnectionWindow(parentEl, enableParamCallback, disableParamCallback, this.onConnectionWindowShowBound);
        this.nodeSettingsWindow = new NodeSettingsWindow(parentEl, this.onNodeSettingsWindowShowBound, this.onNodeRemoveClickBound);
    }

    onNodeRemoveClick() {
        if (!this.activeNode) {
            return;
        }

        this.activeNode.onRemoveClick();
    }

    setupForNode(node) {
        this.activeNode = node;
        // if (node.nodeType.assignedParamContainer) {
        //     this.connectionWindow.setupForNode(node);
        // }
        this.connectionWindow.setupForNode(node);
        this.nodeSettingsWindow.setupForNode(node);
    }

    onNodeConnect(activeNode) {
        this.connectionWindow.setupForNode(activeNode);
    }

    onConnectionWindowShow() {
        this.nodeSettingsWindow.hide();
    }

    onNodeSettingsWindowShow() {
        this.connectionWindow.hide();
    }

    onNodeDisconnect() {
        this.connectionWindow.blur();
    }

    blur() {
        this.nodeSettingsWindow.blur();
        this.connectionWindow.blur();
    }
}