import NodeManager from './managers/NodeManager';
import NodeLibrary from './managers/NodeLibrary/NodeLibrary';
import KeyboardManager from './managers/KeyboardManager';
import WorkspaceManager from './managers/WorkspaceManager';
import GlobalAudioSettings from './managers/GlobalAudioSettings';
import WorkspaceScaleManager from './managers/WorkspaceManager/WorkspaceScaleManager';

import LessonManager from './managers/LessonManager';

import StatusWindow from './backend/ui/status-window';
import DeleteView from './views/DeleteView';
import DialogManager from './dialogs/dialog-manager';

import EditorView from './views/EditorView';

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

		window.NS.settings = {
			speedModifier: 1,
		};

		window.NS.singletons.lessons = {};

		this.workspaceManager = new WorkspaceManager(document.body, this.onWorkspaceClickBound);
		window.NS.workspaceEl = this.workspaceManager.el;

		this.editorView = new EditorView(this.workspaceManager.containerEl);

		this.onScaleChangeBound = this.onScaleChange.bind(this);
		// this.scaleManager = new WorkspaceScaleManager(document.body, this.onScaleChangeBound);

		// this.globalAudioSettings = new GlobalAudioSettings(this.workspaceManager.containerEl);

		this.onResize();

		this._canShowSaveDialog = this._canShowSaveDialog.bind(this);

		

		window.NS.singletons.StatusWindow = new StatusWindow(document.body);
		window.NS.singletons.ConnectionsManager = new ConnectionsManager();
		window.NS.singletons.DialogManager = new DialogManager(document.body, this._canShowSaveDialog);

		this.keyboardManager = new KeyboardManager();

		window.NS.singletons.DeleteView = new DeleteView(this.workspaceManager.containerEl);
	}

	init(selectedDrawing) {
		this.nodeLibrary = new NodeLibrary(
			this.workspaceManager.containerEl,
			this.onNodeAddedFromLibraryBound,
			this.workspaceManager,
		);

		if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.space.id) {
			window.NS.singletons.LessonManager = new LessonManager();
			window.NS.singletons.LessonManager.init(selectedDrawing.drawing);

			this.nodeManager = new NodeManager(null, this.keyboardManager, this.workspaceManager.el, this.nodeLibrary);
			this.nodeManager.init(selectedDrawing);
		} else {
			this.nodeManager = new NodeManager(null, this.keyboardManager, this.workspaceManager.el, this.nodeLibrary);
			this.nodeManager.init(selectedDrawing);

			window.NS.singletons.LessonManager = new LessonManager();
			window.NS.singletons.LessonManager.init(selectedDrawing.drawing);
		}

		window.NS.singletons.NodeManager = this.nodeManager;
	}

	onLogout() {
		// this.nodeLibrary.hide();
		// this.workspaceManager.disable();
		// this.keyboardManager.disable();
		window.location.reload();


		// const nodes = window.NS.singletons.ConnectionsManager.nodes;
		// const keys = Object.keys(nodes);
		// for (let i = 0; i < keys.length; i++) {
		// 	this.nodeManager.onNodeRemove(nodes[keys[i]]);
		// }
	}

	onLogin() {
		this.nodeLibrary.show();
		this.workspaceManager.enable();
		this.keyboardManager.enable();
	}

	_canShowSaveDialog() {
		return !this.nodeManager.windowManager.nodeSettingsOpen();
	}

	onScaleChange(val) {

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
		const createdNode = this.nodeManager.initNode(type, data, e);
		return createdNode;
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