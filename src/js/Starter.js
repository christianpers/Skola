'use strict';

import Main from "./Main";

export default class Starter {
	constructor() {
		
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
		
		this.main = new Main();

		this.onResize();
		window.addEventListener('resize', () => {
			this.onResize();
		});

		this.reqFrame();

	}

	init() {
		console.log('test');
	}

	onLogout() {

		console.log('starter logout');
		this.main.onLogout();
	}

	onLogin() {
		this.main.onLogin();
	}

	reqFrame() {

		this.main.update();
		this.main.render()

		requestAnimationFrame(() => {
			this.reqFrame();
		});
	}

	onResize() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		this.main.onResize(w,h);
	}

};
