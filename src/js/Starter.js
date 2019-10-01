'use strict';

import Main from "./Main";
import DrawingsWindow from './backend/ui/drawings-window';
import Refs from './backend/refs';

export default class Starter {
	constructor(username) {

		console.log('val', username);
		
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
		
		window.NS = {};
		window.NS.transform = transformProp();
		window.NS.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
		window.NS.singletons = {};

		this.onDrawingSelectedBound = this.onDrawingSelected.bind(this);

		const refs = new Refs();
		window.NS.singletons.refs = refs;
		
		this.main = new Main();
		this.drawingsWindow = new DrawingsWindow(document.body, username, this.onDrawingSelectedBound);

		this.onResize();
		window.addEventListener('resize', () => {
			this.onResize();
		});

		this.reqFrameBound = this.reqFrame.bind(this);
		this.reqFrame();
	}

	init() {
		console.log('test');
	}

	onDrawingSelected(drawing) {
		console.log('drawing selected', drawing);
		this.drawingsWindow.hide();

		this.main.init(drawing);
	}

	onLogout() {
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
