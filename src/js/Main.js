import NodeManager from './managers/NodeManager';
import NodeLibrary from './managers/NodeLibrary/NodeLibrary';
import KeyboardManager from './managers/KeyboardManager';
import WorkspaceManager from './managers/WorkspaceManager';
import GlobalAudioSettings from './managers/GlobalAudioSettings';
import WorkspaceScaleManager from './managers/WorkspaceManager/WorkspaceScaleManager';

import StatusWindow from './backend/ui/status-window';

import ConnectionsManager from './managers/ConnectionsManager';

import Tone from 'tone';

export default class Main{

	constructor(){

		Tone.Transport.bpm.value = 140;
		Tone.Transport.start();

		this.historyState = {id: window.location.pathname};

		window.addEventListener('popstate', this.onPopStateChange.bind(this));

		window.addEventListener('resize', () => {

			this.onResize();
		});

		this.onNodeAddedFromLibraryBound = this.onNodeAddedFromLibrary.bind(this);

		this.onWorkspaceClickBound = this.onWorkspaceClick.bind(this);

		this.workspaceManager = new WorkspaceManager(document.body, this.onWorkspaceClickBound);

		this.onScaleChangeBound = this.onScaleChange.bind(this);
		// this.scaleManager = new WorkspaceScaleManager(document.body, this.onScaleChangeBound);

		// this.globalAudioSettings = new GlobalAudioSettings(this.workspaceManager.containerEl);

		this.onResize();
		
		this.nodeLibrary = new NodeLibrary(
			document.body,
			this.onNodeAddedFromLibraryBound,
			this.workspaceManager,
		);

		this.nodeManager = new NodeManager(null, this.keyboardManager, this.workspaceManager.el, this.nodeLibrary);

		window.NS.singletons.StatusWindow = new StatusWindow(document.body)
		window.NS.singletons.ConnectionsManager = new ConnectionsManager();

		this.keyboardManager = new KeyboardManager();
	}

	init(selectedDrawing) {
		this.nodeManager.init(selectedDrawing);
	}

	onLogout() {
		this.nodeLibrary.hide();
		this.workspaceManager.disable();
		this.keyboardManager.disable();

		const nodes = this.nodeManager._nodes;
		for (let i = 0; i < nodes.length; i++) {
			this.nodeManager.onNodeRemove(nodes[i]);
		}
	}

	onLogin() {
		this.nodeLibrary.show();
		this.workspaceManager.enable();
		this.keyboardManager.enable();
	}

	onScaleChange(val) {
		console.log(val);

		// this.workspaceManager.setScale(val);
	}

	onWorkspaceClick() {
		this.nodeManager.windowManager.blur();
		this.nodeManager.onNodeSelectedEvent();
	}

	// onNodeActive(node) {
	// 	this.nodeSettings.show(node);
	// }

	onNodeAddedFromLibrary(type, data, e) {
		this.nodeManager.initNode(type, data, e);
	}

	onPopStateChange(e) {
		console.log('hash change: ', e);
	}

	pushState(id, url) {
		window.history.pushState({
			id,
		}, '', url);
	}

	update() {
		this.nodeManager.update();
	}

	render() {
		this.nodeManager.render();
	}

	onResize(w, h) {
		this.workspaceManager.onResize(w, h);
		// this.scaleManager.onResize(h);
	}

}