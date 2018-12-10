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

		// const proxy = (context, method, message, editor) => {
		// 	// const editor = this.editor;
		// 	return function() {
		// 		method.apply(context, [message].concat(Array.prototype.slice.apply(arguments)))
		// 		console.log('test', arguments[0]);

		// 		if (arguments.length > 0) {

		// 			const errorStr = arguments[0];
		// 			console.log(errorStr);

		// 			if (!errorStr.includes('[object WebGLShader]:ERROR:')) {
		// 				return;
		// 			}

		// 			const errorStartStr = 'ERROR: 0:';

		// 			const errorPos = errorStr.indexOf(errorStartStr);
		// 			const lineNumber = errorStr.substr(errorPos + errorStartStr.length, 2).replace(':', '');
		// 			editor.markError(lineNumber - 1);
		// 		}
		// 	}
	 //    }

		// let's do the actual proxying over originals
		// console.log = proxy(console, console.log, 'Log:')
		// console.error = proxy(console, console.error, 'Error:', this.main.editor)
		// console.warn = proxy(console, console.warn, 'Warning:')

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
		// this.main.onResize(w,h);
	}

};

if(document.body) new Starter();
else {
	window.addEventListener("load", new Starter());
}






