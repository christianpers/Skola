'use strict';

import Main from "./Main";
import DrawingsWindow from './backend/ui/drawings-window';
import Refs from './backend/refs';
import {
	getUserData
} from './backend/get';

const TYPES = Object.freeze({
	space: {
		title: 'Rymden',
		id: 'space',
		settings: {
			showActiveMeshHelper: true,
		},
		readyForUse: true,
	},
	chemistry: {
		title: 'Kemi',
		id: 'chemistry',
		settings: {
			showActiveMeshHelper: false,
		},
		readyForUse: false,
	},
	math: {
		title: 'Matte',
		id: 'math',
		settings: {
			showActiveMeshHelper: false,
		},
		readyForUse: true
	}
});

function transformProp() {
	var testEl = document.createElement('div');
	if(testEl.style.transform == null) {
	var vendors = ['Webkit', 'Moz', 'ms'];
	for(var vendor in vendors) {
		if(testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
		return vendors[vendor] + 'Transform';
		}
	}
	}
	return 'transform';
};

export default class Starter {
	constructor(username) {
		window.NS = {};
		window.NS.transform = transformProp();
		window.NS.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		window.NS.singletons = {};

		window.NS.singletons.TYPES = TYPES;

		this.onDrawingSelectedBound = this.onDrawingSelected.bind(this);

		const refs = new Refs();
		window.NS.singletons.refs = refs;

		const pathnameSplit = window.location.pathname.split('/');
    	const pathSegments = pathnameSplit.length > 1 ? pathnameSplit.slice(1) : '';

		getUserData(username)
			.then(data => {
				window.NS.userData = data;
				window.NS.showDebug = Boolean(window.NS.userData) && Boolean(window.NS.userData.dev);

				this.main = new Main();
				this.drawingsWindow = new DrawingsWindow(document.body, username, this.onDrawingSelectedBound, pathSegments[0]);
			});
	}

	onDrawingSelected(drawing) {
		this.drawingsWindow.hide();

		window.NS.singletons.PROJECT_TYPE = drawing.drawing.doc.type;
		window.NS.IS_CHEMISTRY = window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.chemistry.id;
		window.NS.IS_SPACE = window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.space.id

		this.initDrawing(drawing);
	}

	initDrawing(drawing) {
		this.main.init(drawing);

		this.onResize();
		window.addEventListener('resize', () => {
			this.onResize();
		});

		this.reqFrameBound = this.reqFrame.bind(this);
		this.reqFrame();
	}

	onLogout() {
		this.drawingsWindow.hide();
		this.main.onLogout();
	}

	onLogin() {
		this.main.onLogin();
	}

	reqFrame() {
		window.requestAnimationFrame(this.reqFrameBound);
		
		this.main.update();
		this.main.render();
	}

	onResize() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		this.main.onResize(w,h);
	}

};
