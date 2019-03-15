'use strict';

import './main.scss';
import Main from "./js/Main";

class Starter {
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

if(document.body) new Starter();
else {
	window.addEventListener("load", new Starter());
}






