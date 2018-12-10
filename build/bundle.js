/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(1);

	var _SceneMain = __webpack_require__(5);

	var _SceneMain2 = _interopRequireDefault(_SceneMain);

	var _Main = __webpack_require__(22);

	var _Main2 = _interopRequireDefault(_Main);

	var _Data = __webpack_require__(36);

	var _Data2 = _interopRequireDefault(_Data);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Starter = function () {
		function Starter() {
			var _this = this;

			_classCallCheck(this, Starter);

			var canvas = document.createElement("canvas");
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			canvas.className = "Main-Canvas";
			canvas.id = 'gl';
			var container = document.body.querySelector('.container');
			container.appendChild(canvas);

			function transformProp() {
				var testEl = document.createElement('div');
				if (testEl.style.transform == null) {
					var vendors = ['Webkit', 'Moz', 'ms'];
					for (var vendor in vendors) {
						if (testEl.style[vendors[vendor] + 'Transform'] !== undefined) {
							return vendors[vendor] + 'Transform';
						}
					}
				}
				return 'transform';
			};

			window.NS = {};
			window.NS.GL = {};
			window.NS.GL.params = {};
			window.NS.GL.params.detail = 512;
			window.NS.transform = transformProp();
			window.NS.iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

			this.backgroundNoise = new _SceneMain2.default(container);
			this.main = new _Main2.default(new _Data2.default());

			this.onResize();
			window.addEventListener('resize', function () {
				_this.onResize();
			});

			this.reqFrame();
		}

		_createClass(Starter, [{
			key: 'reqFrame',
			value: function reqFrame() {
				var _this2 = this;

				requestAnimationFrame(function () {
					_this2.reqFrame();
				});

				this.backgroundNoise.loop();
				this.main.update();
			}
		}, {
			key: 'onResize',
			value: function onResize() {
				var w = window.innerWidth;
				var h = window.innerHeight;
				this.backgroundNoise.onResize(w, h);
				this.main.onResize(w, h);
			}
		}]);

		return Starter;
	}();

	;

	if (document.body) new Starter();else {
		window.addEventListener("load", new Starter());
	}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/sass-loader/index.js?sourceMap!./main.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/sass-loader/index.js?sourceMap!./main.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "html, body {\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  position: static;\n  background: #fff; }\n\n* {\n  box-sizing: border-box; }\n\na {\n  text-decoration: none;\n  color: rgba(0, 0, 0, 0.8); }\n\nhtml {\n  -webkit-text-size-adjust: none;\n  -moz-text-size-adjust: none;\n  text-size-adjust: none; }\n\nh1, h2, h3, h4, h5, text, p {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-webkit-font-smoothing: antialiased;\n  font-family: Arial; }\n\n.mainLoader {\n  position: absolute;\n  z-index: 10;\n  width: 200px;\n  height: 200px;\n  top: 50%;\n  left: 50%;\n  margin-top: -100px;\n  margin-left: -100px; }\n\n.logo {\n  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);\n  color: transparent;\n  font-family: Arial;\n  font-weight: lighter;\n  position: fixed;\n  right: 14px;\n  top: 6px;\n  z-index: 20;\n  margin: 0;\n  font-size: 32px;\n  opacity: 1; }\n  @media only screen and (max-width: 767px) {\n    .logo {\n      top: 10px; } }\n\n.closeBtn {\n  position: fixed;\n  top: 52px;\n  right: 40px;\n  width: 50px;\n  height: 50px;\n  text-indent: -9999px;\n  padding: 0 4px;\n  z-index: 10;\n  cursor: pointer; }\n  @media only screen and (max-width: 767px) {\n    .closeBtn {\n      right: 10px;\n      width: 30px;\n      height: 30px; } }\n\n.container {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  opacity: 0; }\n\n.Main-Canvas {\n  width: 100%;\n  height: 100%;\n  top: 0px;\n  left: 0px;\n  position: absolute;\n  z-index: 0; }\n\n.featured-wrapper {\n  position: relative;\n  width: 100%;\n  display: flex;\n  justify-content: center; }\n  .featured-wrapper .featured-content {\n    width: 80%;\n    height: 2000px;\n    background: rgba(255, 255, 255, 0.4); }\n\n.nav {\n  position: fixed;\n  top: 0px;\n  left: 0px;\n  font-family: \"Arial\";\n  padding: 10px;\n  z-index: 5;\n  color: rgba(0, 0, 0, 0.8);\n  z-index: 10;\n  opacity: 1; }\n  .nav .nav-item {\n    cursor: pointer;\n    padding: 10px;\n    font-size: 10px;\n    position: relative;\n    left: 0;\n    transition: transform .5s;\n    -webkit-transition: transform .5s; }\n    .nav .nav-item:hover {\n      background: white; }\n    @media only screen and (max-width: 767px) {\n      .nav .nav-item {\n        display: block;\n        padding: 4px;\n        margin-bottom: 10px;\n        transform: translate(-200px, 0);\n        background: white; }\n        .nav .nav-item:hover {\n          background: transparent; } }\n  .nav .menuBurger {\n    display: none;\n    width: 39px;\n    height: 35px;\n    text-indent: -9999px;\n    padding: 0 4px;\n    margin-top: 0;\n    margin-bottom: 10px; }\n    @media only screen and (max-width: 767px) {\n      .nav .menuBurger {\n        display: block; } }\n\n.overlay {\n  position: absolute;\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n  left: 0;\n  top: 0;\n  opacity: 0;\n  display: none;\n  -webkit-transition: opacity .6s, transform .6s;\n  /* Android 2.1+, Chrome 1-25, iOS 3.2-6.1, Safari 3.2-6  */\n  transition: opacity .6s, transform .6s;\n  /* Chrome 26, Firefox 16+, iOS 7+, IE 10+, Opera, Safari 6.1+  */\n  color: rgba(0, 0, 0, 0.8);\n  -webkit-transform: scale(0.8);\n  /* Chrome, Opera 15+, Safari 3.1+ */\n  transform: scale(0.8);\n  /* Firefox 16+, IE 10+, Opera */\n  padding: 40px 100px; }\n  .overlay .overlayTitle {\n    text-align: center;\n    font-size: 32px; }\n\n.touchLayer {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%; }\n\n.contact {\n  padding-top: 20%;\n  text-align: center; }\n  .contact > h1 {\n    font-size: 60px;\n    color: rgba(0, 0, 0, 0.8); }\n  @media only screen and (max-width: 767px) {\n    .contact {\n      padding: 40% 0;\n      margin-top: 0; }\n      .contact > h1 {\n        font-size: 20px; } }\n\n.about {\n  margin-top: 100px; }\n  .about .overlayDescr {\n    line-height: 22px;\n    width: 50%; }\n  @media only screen and (max-width: 767px) {\n    .about {\n      padding: 0px 10px;\n      font-size: 10px;\n      line-height: 0px;\n      padding-top: 40px;\n      margin-top: 16%; }\n      .about .overlayDescr {\n        line-height: 18px;\n        font-size: 14px;\n        width: 90%; } }\n", "", {"version":3,"sources":["/./app/main.scss"],"names":[],"mappings":"AAGA;EACC,YAAW;EAEX,UAAS;EACT,WAAU;EAGV,iBAAiB;EACjB,iBAAiB,EACjB;;AAED;EACC,uBAAuB,EACvB;;AAED;EACC,sBAAsB;EACtB,0BAAW,EACX;;AAED;EACC,+BAA+B;EAC/B,4BAA4B;EAC5B,uBAAuB,EACvB;;AAED;EACC,oCAAoC;EACpC,4CAA4C;EAC5C,mBAAmB,EACnB;;AAED;EACC,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,cAAc;EACd,SAAS;EACT,UAAU;EACV,mBAAmB;EACnB,oBAAoB,EACpB;;AAED;EACC,kDAA6B;EAC1B,mBAAW;EACX,mBAAmB;EACnB,qBAAqB;EACrB,gBAAgB;EAChB,YAAY;EACZ,SAAS;EACT,YAAY;EACZ,UAAU;EACV,gBAAgB;EAChB,WAAW,EAId;EAHG;IAZJ;MAaK,UAAU,EAEd,EAAA;;AAED;EACC,gBAAgB;EAChB,UAAU;EACV,YAAY;EAEZ,YAAY;EACT,aAAa;EACb,qBAAqB;EACrB,eAAe;EACf,YAAY;EACZ,gBAAgB,EAQnB;EALA;IAbD;MAcE,YAAY;MACZ,YAAY;MACT,aAAa,EAEjB,EAAA;;AAED;EACC,gBAAgB;EAChB,OAAO;EACP,QAAQ;EACR,YAAW;EACX,aAAY;EACZ,WAAW,EAEX;;AAED;EACC,YAAW;EACX,aAAY;EACZ,SAAQ;EACR,UAAS;EACT,mBAAmB;EACnB,WAAW,EACX;;AAGD;EACC,mBAAmB;EAEnB,YAAY;EACZ,cAAc;EACd,wBAAwB,EAMxB;EAXD;IAOE,WAAW;IACX,eAAe;IACf,qCAAgB,EAChB;;AAKF;EACC,gBAAgB;EACb,SAAS;EACT,UAAU;EACV,qBAAqB;EACrB,cAAc;EACd,WAAW;EACX,0BAAW;EACX,YAAY;EACZ,WAAW,EAyCd;EAlDD;IAYE,gBAAgB;IAChB,cAAc;IACd,gBAAgB;IAChB,mBAAmB;IACnB,QAAQ;IACR,0BAA0B;IAC1B,kCAAkC,EAelC;IAjCF;MAoBG,kBAAkB,EAClB;IAED;MAvBF;QAwBG,eAAe;QACf,aAAa;QACb,oBAAoB;QACpB,gCAAoB;QACpB,kBAAkB,EAKnB;QAjCF;UA8BI,wBAAwB,EACxB,EAAA;EA/BJ;IAoCE,cAAc;IACd,YAAY;IACT,aAAa;IACb,qBAAqB;IACrB,eAAe;IACf,cAAc;IACd,oBAAoB,EAMvB;IAJA;MA5CF;QA6CG,eAAe,EAGhB,EAAA;;AAIF;EACC,mBAAmB;EACnB,WAAW;EACX,YAAY;EACZ,aAAa;EACb,QAAQ;EACR,OAAO;EACP,WAAW;EACX,cAAc;EACd,+CAA+C;EAAG,2DAA2D;EAC1G,uCAAuC;EAAG,iEAAiE;EAC3G,0BAAW;EACX,8BAAwB;EAAQ,oCAAoC;EAEpE,sBAAgB;EAAO,gCAAgC;EAEvD,oBAAoB,EAWvB;EA3BD;IAmBK,mBAAmB;IACnB,gBAAgB,EAEhB;;AAOL;EACC,mBAAmB;EACnB,OAAO;EACP,QAAQ;EACR,YAAY;EACZ,aAAa,EACb;;AAED;EACC,iBAAiB;EACjB,mBAAmB,EAcnB;EAhBD;IAIE,gBAAgB;IAChB,0BAAW,EACX;EAED;IARD;MAUE,eAAe;MACZ,cAAc,EAKlB;MAhBD;QAaG,gBAAgB,EAChB,EAAA;;AAIH;EAEC,kBAAkB,EAkBlB;EApBD;IAIK,kBAAkB;IAClB,WAAW,EACX;EAED;IARJ;MASK,kBAAkB;MAClB,gBAAgB;MAChB,iBAAiB;MACjB,kBAAkB;MAClB,gBAAgB,EAOpB;MApBD;QAeM,kBAAkB;QAClB,gBAAgB;QAChB,WAAW,EACX,EAAA","file":"main.scss","sourcesContent":["$mobile      : 'only screen and (max-width : 767px)';\n\n\nhtml, body {\n\twidth:100%;\n\n\tmargin:0;\n\tpadding:0;\n\n\t// overflow:hidden;\n\tposition: static;\n\tbackground: #fff;\n}\n\n*{\n\tbox-sizing: border-box;\n}\n\na{\n\ttext-decoration: none;\n\tcolor: rgba(0,0,0,.8);\n}\n\nhtml {\n\t-webkit-text-size-adjust: none;\n\t-moz-text-size-adjust: none;\n\ttext-size-adjust: none;\n}\n\nh1,h2,h3,h4,h5,text,p {\n\t-webkit-font-smoothing: antialiased;\n\t-moz-osx-webkit-font-smoothing: antialiased;\n\tfont-family: Arial;\n}\n\n.mainLoader{\n\tposition: absolute;\n\tz-index: 10;\n\twidth: 200px;\n\theight: 200px;\n\ttop: 50%;\n\tleft: 50%;\n\tmargin-top: -100px;\n\tmargin-left: -100px;\n}\n\n.logo{\n\t-webkit-text-stroke: 1px rgba(255,255,255,.5);\n    color: rgba(0,0,0,0);\n    font-family: Arial;\n    font-weight: lighter;\n    position: fixed;\n    right: 14px;\n    top: 6px;\n    z-index: 20;\n    margin: 0;\n    font-size: 32px;\n    opacity: 1;\n    @media #{$mobile}{\n    \ttop: 10px;\n    }\n}\n\n.closeBtn{\n\tposition: fixed;\n\ttop: 52px;\n\tright: 40px;\n\t// display: none;\n\twidth: 50px;\n    height: 50px;\n    text-indent: -9999px;\n    padding: 0 4px;\n    z-index: 10;\n    cursor: pointer;\n\n   \n\t@media #{$mobile}{\n\t\tright: 10px;\n\t\twidth: 30px;\n    \theight: 30px;\n\t}\n}\n\n.container{\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\twidth:100%;\n\theight:100%;\n\topacity: 0;\n\n}\n\n.Main-Canvas {\n\twidth:100%;\n\theight:100%;\n\ttop:0px;\n\tleft:0px;\n\tposition: absolute;\n\tz-index: 0;\n}\n\n\n.featured-wrapper{\n\tposition: relative;\n\t\n\twidth: 100%;\n\tdisplay: flex;\n\tjustify-content: center;\n\t.featured-content{\n\t\twidth: 80%;\n\t\theight: 2000px;\n\t\tbackground: rgba(255,255,255,.4);\n\t}\n}\n\n\n\n.nav{\n\tposition: fixed;\n    top: 0px;\n    left: 0px;\n    font-family: \"Arial\";\n    padding: 10px;\n    z-index: 5;\n    color: rgba(0,0,0,.8);\n    z-index: 10;\n    opacity: 1;\n\n\t.nav-item{\n\t\tcursor: pointer;\n\t\tpadding: 10px;\n\t\tfont-size: 10px;\n\t\tposition: relative;\n\t\tleft: 0;\n\t\ttransition: transform .5s;\n\t\t-webkit-transition: transform .5s;\n\t\t&:hover{\n\t\t\tbackground: white;\n\t\t}\n\n\t\t@media #{$mobile}{\n\t\t\tdisplay: block;\n\t\t\tpadding: 4px;\n\t\t\tmargin-bottom: 10px;\n\t\t\ttransform: translate(-200px, 0);\n\t\t\tbackground: white;\n\t\t\t&:hover{\n\t\t\t\tbackground: transparent;\n\t\t\t}\n\t\t}\n\t}\n\n\t.menuBurger{\n\t\tdisplay: none;\n\t\twidth: 39px;\n\t    height: 35px;\n\t    text-indent: -9999px;\n\t    padding: 0 4px;\n\t    margin-top: 0;\n\t    margin-bottom: 10px;\n\n\t\t@media #{$mobile}{\n\t\t\tdisplay: block;\n\t\t}\n\n\t}\n\n}\n\n.overlay{\n\tposition: absolute;\n\tz-index: 1;\n\twidth: 100%;\n\theight: 100%;\n\tleft: 0;\n\ttop: 0;\n\topacity: 0;\n\tdisplay: none;\n\t-webkit-transition: opacity .6s, transform .6s;  /* Android 2.1+, Chrome 1-25, iOS 3.2-6.1, Safari 3.2-6  */\n    transition: opacity .6s, transform .6s;  /* Chrome 26, Firefox 16+, iOS 7+, IE 10+, Opera, Safari 6.1+  */\n    color: rgba(0,0,0,.8);\n    -webkit-transform: scale(0.8);  /* Chrome, Opera 15+, Safari 3.1+ */\n    //   -ms-transform: scale(0.8);  /* IE 9 */\n    transform: scale(.8);  /* Firefox 16+, IE 10+, Opera */\n    // background: rgba(0,0,0,.3);\n    padding: 40px 100px;\n    // background: rgba(255,255,255,.6);\n    .overlayTitle{\n    \ttext-align: center;\n    \tfont-size: 32px;\n\n    }\n    \n\n\n\t\n}\n\n.touchLayer{\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n}\n\n.contact{\n\tpadding-top: 20%;\n\ttext-align: center;\n\t> h1{\n\t\tfont-size: 60px;\n\t\tcolor: rgba(0,0,0,.8);\n\t}\n\n\t@media #{$mobile}{\n\t\t// padding-top: 40px;\n\t\tpadding: 40% 0;\n    \tmargin-top: 0;\n\t\t> h1 {\n\t\t\tfont-size: 20px;\n\t\t}\n\t}\n}\n\n.about{\n\t// background: rgba(250, 40, 40, .7);\n\tmargin-top: 100px;\n\t.overlayDescr{\n    \tline-height: 22px;\n    \twidth: 50%;\n    }\n\n    @media #{$mobile}{\n    \tpadding: 0px 10px;\n\t    font-size: 10px;\n\t    line-height: 0px;\n\t    padding-top: 40px;\n    \tmargin-top: 16%;\n    \t.overlayDescr{\n    \t\tline-height: 18px;\n    \t\tfont-size: 14px;\n    \t\twidth: 90%;\n    \t}\n    }\n}\n\n.projects{\n\t// background: rgba(250, 40, 240, .7);\n\t// padding: 0;\n\t// margin-top: 80px;\n\t// .projectsContainer{\n\t// \twidth: 80%;\n\t// \tmargin: 20px auto;\n\t// \tposition: relative;\n\t// }\n\t// .projectDetailWrapper{\n\t// \topacity: 0;\n\t// \tdisplay: none;\n\t// \theight: 100%;\n\t//     width: 100%;\n\t//     // background: rgba(0,0,0,.1);\n\t//     z-index: 8;\n\t//     position: relative;\n\t//     transition: opacity .5s;\n\t//     -webkit-transition: opacity .5s;\n\t    \n\t//     .projectDescr{\n\t//     \twidth: 100%;\n\t// \t    text-align: center;\n\t// \t    padding: 0 10%;\n\t// \t    font-size: 12px;\n //    \t\tline-height: 20px;\n\t//     }\n\t//     .projectSlider{\n\t   \t\t\n\t// \t\tmargin: 20px auto;\n //   \t\t\tposition: relative;\n\t// \t    .sliderNav{\n\t// \t    \twidth: 20px;\n\t// \t    \theight: 20px;\n\t// \t    \tposition: absolute;\n\t// \t    \ttop: 50%;\n\t// \t    \tmargin-top: -10px;\n\t// \t    \tcursor: pointer;\n\t// \t    \ttransition: transform .2s;\n\t// \t    \t-webkit-transition: transform .2s;\n\t// \t    \ttransform: scale(1.0);\n\t// \t    \t-webkit-transform: scale(1.0);\n\t// \t    \t&:hover{\n\t// \t    \t\ttransform: scale(1.2);\n\t// \t    \t\t-webkit-transform: scale(1.2);\n\t// \t    \t}\n\t// \t    \t&.sliderNext{\n\t// \t    \t\tright: -30px;\n\t// \t    \t}\n\t// \t    \t&.sliderPrev{\n\t// \t    \t\tleft: -30px;\n\t// \t    \t}\n\t// \t    }\n\t// \t    .sliderContainer{\n\t// \t    \tposition: absolute;\n\t// \t    \toverflow: hidden;\n\t// \t    \theight: 100%;\n\t// \t    }\n\t\t    \n\t//     \t.sliderItem{\n\t//     \t\tposition: absolute;\n\t//     \t\ttop: 0;\n\t//     \t\twidth: 100%;\n\t//     \t\theight: 100%;\n\t//     \t\ttransition: transform .5s, opacity .5s;\n\t//     \t\t-webkit-transition: transform .5s, opacity .5s;\n\t//     \t\tz-index: 2;\n\t//     \t\t> img{\n\t//     \t\t\twidth: 100%;\n\t// \t\t\t\theight: auto;\n\t//     \t\t}\n\t// \t    }\n\t//     }\n\n\t// }\n\t// .projectItem{\n\t// \tbackground: rgba(0,0,0,.2);\n\t// \tposition: absolute;\n\t// \ttop: 0;\n\t// \tleft: 0;\n\t// \tcursor: pointer;\n\t// \ttransition: opacity .4s, transform .3s;\n\t// \t-webkit-transition: opacity .4s, transform .3s;\n\t// \t> .touchLayer{\n\t// \t\tz-index: 2;\n\t// \t}\n\t// \t.projectItemLoader{\n\t// \t\tz-index: 3;\n\t// \t}\n\t// \t.itemCaption{\n\t// \t\tposition: absolute;\n\t// \t\ttop: 0;\n\t// \t\tleft: 0;\n\t// \t\twidth: 100%;\n\t// \t\theight: 100%;\n\t// \t\tcolor: white;\n\t// \t\tbackground: rgba(0,0,0,.6);\n\t// \t\tz-index: 1;\n\t// \t\topacity: 0;\n\t// \t\ttransition: opacity .4s;\n\t// \t\t-webkit-transition: opacity .4s;\n\t// \t\tpadding-top: 22%;\n\n\t// \t\t> h5{\n\t// \t\t\tfont-size: 20px;\n\t// \t\t\ttext-align: center;\n\t// \t\t\ttext-transform: uppercase;\n\t// \t\t}\n\t// \t\t.projectOpenBtn{\n\t// \t\t\tfont-size: 16px;\n //    \t\t\tcolor: white;\n    \t\t\t\n\t// \t\t}\n\t// \t}\n\t// \t> img{\n\t// \t\tposition: absolute;\n\t// \t    top: 0;\n\t// \t    left: 0;\n\t// \t    width: 100%;\n\t// \t    height: 100%;\n\t// \t    transform: scale(1);\n\t// \t    -webkit-transform: scale(1);\n\t// \t    opacity: 1;\n\t// \t    z-index: 0;\n\t// \t}\n\t// }\n\t// @media #{$mobile}{\n\t// \tpadding-top: 40px;\n //    \tmargin-top: 0;\n\t// }\n\n}\n\n\n\n\n"],"sourceRoot":"webpack://"}]);

	// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _Scene2 = __webpack_require__(6);

	var _Scene3 = _interopRequireDefault(_Scene2);

	var _ViewCopy = __webpack_require__(9);

	var _ViewCopy2 = _interopRequireDefault(_ViewCopy);

	var _ViewPoints = __webpack_require__(14);

	var _ViewPoints2 = _interopRequireDefault(_ViewPoints);

	var _ViewDistanceNoise = __webpack_require__(17);

	var _ViewDistanceNoise2 = _interopRequireDefault(_ViewDistanceNoise);

	var _SceneTransforms = __webpack_require__(18);

	var _SceneTransforms2 = _interopRequireDefault(_SceneTransforms);

	var _Framebuffer = __webpack_require__(19);

	var _Framebuffer2 = _interopRequireDefault(_Framebuffer);

	var _Texture = __webpack_require__(20);

	var _Texture2 = _interopRequireDefault(_Texture);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	// import MouseInteractor from "./framework/MouseInteractor";
	// import KeyboardInteractor from "./framework/KeyboardInteractor";


	// import ImageLoader from "./framework/ImageLoader";
	// import TextureCreator from "./framework/TextureCreator";

	var grad3 = [[0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1], [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1], [1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0], // 12 cube edges
	[1, 0, -1], [-1, 0, -1], [0, -1, 1], [0, 1, 1]]; // 4 more to make 16

	var perm = [151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180];

	var simplex4 = [[0, 64, 128, 192], [0, 64, 192, 128], [0, 0, 0, 0], [0, 128, 192, 64], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [64, 128, 192, 0], [0, 128, 64, 192], [0, 0, 0, 0], [0, 192, 64, 128], [0, 192, 128, 64], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [64, 192, 128, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [64, 128, 0, 192], [0, 0, 0, 0], [64, 192, 0, 128], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [128, 192, 0, 64], [128, 192, 64, 0], [64, 0, 128, 192], [64, 0, 192, 128], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [128, 0, 192, 64], [0, 0, 0, 0], [128, 64, 192, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [128, 0, 64, 192], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [192, 0, 64, 128], [192, 0, 128, 64], [0, 0, 0, 0], [192, 64, 128, 0], [128, 64, 0, 192], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [192, 64, 0, 128], [0, 0, 0, 0], [192, 128, 0, 64], [192, 128, 64, 0]];

	var SceneMain = function (_Scene) {
		_inherits(SceneMain, _Scene);

		function SceneMain(container) {
			_classCallCheck(this, SceneMain);

			var _this = _possibleConstructorReturn(this, (SceneMain.__proto__ || Object.getPrototypeOf(SceneMain)).call(this));

			_this.container = container;

			_this.doRender = false;

			_this.orthoTransforms = new _SceneTransforms2.default(_this.canvas);

			_this.initTextures();
			_this.initViews();
			_this.createNoiseTexture();

			_this.doRender = true;
			_this.container.style.opacity = 1;

			_this.currentSpeed = .00001;

			return _this;
		}

		_createClass(SceneMain, [{
			key: "createNoiseTexture",
			value: function createNoiseTexture() {

				// PERM TEXTURE
				var pixels = new Uint8Array(256 * 256 * 4);

				var permTexture = this.gl.createTexture();
				this.gl.bindTexture(this.gl.TEXTURE_2D, permTexture);

				for (var i = 0; i < 256; i++) {
					for (var j = 0; j < 256; j++) {
						var offset = (i * 256 + j) * 4;
						var value = perm[j + perm[i] & 0xFF];
						pixels[offset] = grad3[value & 0x0F][0] * 64 + 64; // Gradient x
						pixels[offset + 1] = grad3[value & 0x0F][1] * 64 + 64; // Gradient y
						pixels[offset + 2] = grad3[value & 0x0F][2] * 64 + 64; // Gradient z
						pixels[offset + 3] = value; // Permuted index
					}
				}

				this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 256, 256, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

				this._permTexture = new _Texture2.default(permTexture, true);

				// SIMPLEX TEXTURE
				var test = new Uint8Array(64 * 1 * 4);

				var index = 0;
				for (var i = 0; i < simplex4.length; i++) {
					for (var j = 0; j < simplex4[i].length; j++) {

						test[index] = simplex4[i][j];

						index++;
					}
				}

				var simplexTexture = this.gl.createTexture();
				this.gl.bindTexture(this.gl.TEXTURE_2D, simplexTexture);

				this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 64, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, test);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
				this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

				this._simplexTexture = new _Texture2.default(simplexTexture, true);
			}
		}, {
			key: "initTextures",
			value: function initTextures() {

				var size = window.NS.GL.params.detail;
				this._fboPoints = new _Framebuffer2.default(size, size, this.gl.NEAREST, this.gl.NEAREST, this.gl.FLOAT);

				// this._logoTexture = new Texture(this.textureCreator.getImage(), false);
				// this._logoTexture = new Texture(this.loadedImages['logoTexture'], false);
			}
		}, {
			key: "initViews",
			value: function initViews() {

				// this._vCopy = new ViewCopy(this.orthoTransforms, require("../shaders/copy.frag"));
				// this._vPoints = new ViewPoints(this.orthoTransforms);

				this._vDistanceNoise = new _ViewDistanceNoise2.default(this.orthoTransforms, __webpack_require__(21));
			}
		}, {
			key: "update",
			value: function update() {

				_get(SceneMain.prototype.__proto__ || Object.getPrototypeOf(SceneMain.prototype), "update", this).call(this);
			}
		}, {
			key: "render",
			value: function render() {

				// if (window.NS.iOS){
				// 	this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
				// 	this.gl.clearColor( 1.0, 1.0, 1.0, 1 );
				// 	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

				// }else{
				if (!this.doRender) return;

				this.orthoTransforms.setCamera(this.orthoCamera);

				// this.gl.viewport(0, 0, this._fboPoints.width, this._fboPoints.height);

				// this._fboPoints.bind();
				// this.gl.clearColor( 1.0, 1.0, 1.0, 1 );
				// this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

				// this._vPoints.render(this._permTexture, this._simplexTexture);

				// this._fboPoints.unbind();

				this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);

				this.gl.clearColor(1.0, 1.0, 1.0, 1);
				this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

				// this._vCopy.render(this._fboPoints.getTexture());
				this._vDistanceNoise.render(this.gl.viewportWidth, this.gl.viewportHeight, this.currentSpeed);
				// }
			}
		}, {
			key: "onResize",
			value: function onResize(w, h) {

				this.gl.viewportWidth = w;
				this.gl.viewportHeight = h;

				this.canvas.width = w;
				this.canvas.height = h;

				this.canvas.style.height = h + 'px';
				this.canvas.style.width = w + 'px';
			}
		}]);

		return SceneMain;
	}(_Scene3.default);

	exports.default = SceneMain;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _FreeCamera = __webpack_require__(7);

	var _FreeCamera2 = _interopRequireDefault(_FreeCamera);

	var _BaseCamera = __webpack_require__(8);

	var _BaseCamera2 = _interopRequireDefault(_BaseCamera);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Scene = function () {
		function Scene() {
			_classCallCheck(this, Scene);

			this.canvas = document.getElementById('gl');
			this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');

			window.NS.GL.glContext = this.gl;

			this.gl.viewport(0, 0, this.gl.viewportWidth, this.gl.viewportHeight);
			this.gl.disable(this.gl.DEPTH_TEST);
			// this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
			// gl.enable(gl.CULL_FACE);
			// this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
			// this.gl.enable(this.gl.BLEND);
			this.gl.clearColor(0, 0, 0, 1);
			this.gl.clearDepth(1);
			// this.depthTextureExt = this.gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix
			this.floatTextureExt = this.gl.getExtension("OES_texture_float"); // Or browser-appropriate prefix
			// this.deravitives = this.gl.getExtension("GL_OES_standard_derivatives");


			this.setCamera();
		}

		_createClass(Scene, [{
			key: 'setCamera',
			value: function setCamera() {

				this.camera = new _FreeCamera2.default();

				this.orthoCamera = new _BaseCamera2.default('ortho');
			}
		}, {
			key: 'loop',
			value: function loop() {

				this.update();
				this.render();
			}
		}, {
			key: 'update',
			value: function update() {

				this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
			}
		}, {
			key: 'render',
			value: function render() {}
		}]);

		return Scene;
	}();

	exports.default = Scene;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _BaseCamera2 = __webpack_require__(8);

	var _BaseCamera3 = _interopRequireDefault(_BaseCamera2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var FreeCamera = function (_BaseCamera) {
		_inherits(FreeCamera, _BaseCamera);

		function FreeCamera() {
			_classCallCheck(this, FreeCamera);

			var _this = _possibleConstructorReturn(this, (FreeCamera.__proto__ || Object.getPrototypeOf(FreeCamera)).call(this));

			_this.linVel = vec3.fromValues(0.0, 0.0, 0.0); // Animation of positions
			_this.angVel = vec3.fromValues(0.0, 0.0, 0.0); // Animations of rotation around (side Vector, up Vector, dir Vector)

			return _this;
		}

		_createClass(FreeCamera, [{
			key: 'yaw',
			value: function yaw(angle) {

				this.rotateOnAxis(this.up, angle);
			}
		}, {
			key: 'pitch',
			value: function pitch(angle) {

				this.rotateOnAxis(this.left, angle);
			}
		}, {
			key: 'roll',
			value: function roll(angle) {

				this.rotateOnAxis(this.dir, angle);
			}
		}, {
			key: 'rotateOnAxis',
			value: function rotateOnAxis(axisVec, angle) {

				// Create a proper Quaternion based on location and angle
				var quate = quat.create();
				quat.setAxisAngle(quate, axisVec, angle);

				// Create a rotation Matrix out of this quaternion
				vec3.transformQuat(this.dir, this.dir, quate);
				vec3.transformQuat(this.left, this.left, quate);
				vec3.transformQuat(this.up, this.up, quate);
				vec3.normalize(this.up, this.up);
				vec3.normalize(this.left, this.left);
				vec3.normalize(this.dir, this.dir);

				this.up = vec3.fromValues(0.0, 1.0, 0.0); // Camera Up vector
			}
		}, {
			key: 'setAngularVel',
			value: function setAngularVel(newVec) {

				this.angVel[0] = newVec[0];
				this.angVel[1] = newVec[1];
				this.angVel[2] = newVec[2];
			}
		}, {
			key: 'getAngularVel',
			value: function getAngularVel() {

				return vec3.clone(this.angVel);
			}
		}, {
			key: 'getLinearVel',
			value: function getLinearVel() {

				return vec3.clone(this.linVel);
			}
		}, {
			key: 'setLinearVel',
			value: function setLinearVel() {

				this.linVel[0] = newVec[0];
				this.linVel[1] = newVec[1];
				this.linVel[2] = newVec[2];
			}
		}, {
			key: 'setLookAtPoint',
			value: function setLookAtPoint(newVec) {

				function isVectorEqual(vecone, vectwo) {
					if (vecone[0] == vectwo[0] && vecone[1] == vectwo[1] && vecone[2] == vectwo[2]) {
						return true;
					} else {
						return false;
					}
				}

				// if the position hasn't yet been changed and they want the
				// camera to look at [0,0,0], that will create a problem.
				if (isVectorEqual(this.pos, [0, 0, 0]) && isVectorEqual(newVec, [0, 0, 0])) {} else {
					// Figure out the direction of the point we are looking at.
					vec3.subtract(this.dir, newVec, this.pos);
					vec3.normalize(this.dir, this.dir);
					// Adjust the Up and Left vectors accordingly
					vec3.cross(this.left, vec3.fromValues(0, 1, 0), this.dir);
					vec3.normalize(this.left, this.left);
					vec3.cross(this.up, this.dir, this.left);
					vec3.normalize(this.up, this.up);
				}
			}
		}, {
			key: 'setPosition',
			value: function setPosition(newVec) {

				this.pos = vec3.fromValues(newVec[0], newVec[1], newVec[2]);
			}
		}, {
			key: 'setUpVector',
			value: function setUpVector(newVec) {

				this.up[0] = newVec[0];
				this.up[1] = newVec[1];
				this.up[2] = newVec[2];
			}

			// moveSide(s){

			//   var newPosition = [this.pos[0] - s*this.left[0],this.pos[1] - s*this.left[1],this.pos[2] - s*this.left[2]];

			//   this.setPosition(newPosition);
			// };


		}, {
			key: 'moveForward',
			value: function moveForward(s) {

				var dirTemp = this.dir.slice(0);
				dirTemp[1] = 0;

				var newPosition = [this.pos[0] - s * this.dir[0], this.pos[1] - s * this.dir[1], this.pos[2] - s * this.dir[2]];

				this.setPosition(newPosition);
			}
		}, {
			key: 'update',
			value: function update(timeStep) {

				if (vec3.squaredLength(this.linVel) == 0 && vec3.squaredLength(this.angularVel) == 0) return false;

				if (vec3.squaredLength(this.linVel) > 0.0) {
					// Add a velocity to the position
					vec3.scale(this.velVec, this.velVec, timeStep);

					vec3.add(this.pos, this.velVec, this.pos);
				}

				if (vec3.squaredLength(this.angVel) > 0.0) {
					// Apply some rotations to the orientation from the angular velocity
					this.pitch(this.angVel[0] * timeStep);
					this.yaw(this.angVel[1] * timeStep);
					this.roll(this.angVel[2] * timeStep);
				}

				return true;
			}
		}]);

		return FreeCamera;
	}(_BaseCamera3.default);

	exports.default = FreeCamera;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var BaseCamera = function () {
		function BaseCamera(type) {
			_classCallCheck(this, BaseCamera);

			this.type = type;

			if (this.type == 'ortho') {
				this.projMatrix = mat4.create();
				this.viewMatrix = mat4.create();

				return;
			}

			// Raw Position Values
			this.left = vec3.fromValues(1.0, 0.0, 0.0); // Camera Left vector
			this.up = vec3.fromValues(0.0, 1.0, 0.0); // Camera Up vector
			this.dir = vec3.fromValues(0.0, 0.0, 1.0); // The direction its looking at
			this.pos = vec3.fromValues(0.0, 0.0, 0.0); // Camera eye position
			this.projectionTransform = null;
			this.projMatrix;
			this.viewMatrix;

			this.fieldOfView = 45;
			this.nearClippingPlane = 0.1;
			this.farClippingPlane = 1000.0;
		}

		_createClass(BaseCamera, [{
			key: 'apply',
			value: function apply(aspectRatio) {

				function degToRadian(degrees) {
					return degrees * Math.PI / 180;
				};

				var matView = mat4.create();
				var lookAtPosition = vec3.create();
				vec3.add(lookAtPosition, this.pos, this.dir);
				mat4.lookAt(matView, this.pos, lookAtPosition, this.up);
				mat4.translate(matView, matView, vec3.fromValues(-this.pos[0], -this.pos[1], -this.pos[2]));
				this.viewMatrix = matView;

				// console.log(this.dir, this.up);

				// Create a projection matrix and store it inside a globally accessible place.
				this.projMatrix = mat4.create();
				mat4.perspective(this.projMatrix, degToRadian(this.fieldOfView), aspectRatio, this.nearClippingPlane, this.farClippingPlane);
			}
		}, {
			key: 'getFarClippingPlane',
			value: function getFarClippingPlane() {
				return this.farClippingPlane;
			}
		}, {
			key: 'getFieldOfView',
			value: function getFieldOfView() {
				return this.fieldOfView;
			}
		}, {
			key: 'getLeft',
			value: function getLeft() {

				return vec3.clone(this.left);
			}
		}, {
			key: 'getNearClippingPlane',
			value: function getNearClippingPlane() {

				return this.nearClippingPlane;
			}
		}, {
			key: 'getPosition',
			value: function getPosition() {

				return vec3.clone(this.pos);
			}
		}, {
			key: 'getProjectionMatrix',
			value: function getProjectionMatrix() {

				return mat4.clone(this.projMatrix);
			}
		}, {
			key: 'getViewMatrix',
			value: function getViewMatrix() {

				return mat4.clone(this.viewMatrix);
			}
		}, {
			key: 'getUp',
			value: function getUp() {

				return vec3.clone(this.up);
			}
		}, {
			key: 'setFarClippingPlane',
			value: function setFarClippingPlane() {

				if (fcp > 0) {
					this.farClippingPlane = fcp;
				}
			}
		}, {
			key: 'setFieldOfView',
			value: function setFieldOfView(fov) {

				if (fov > 0 && fov < 180) {
					this.fieldOfView = fov;
				}
			}
		}, {
			key: 'setNearClippingPlane',
			value: function setNearClippingPlane(ncp) {

				if (ncp > 0) {
					this.nearClippingPlane = ncp;
				}
			}
		}, {
			key: 'update',
			value: function update(timeStep, lineVel, angularVel) {

				if (vec3.squaredLength(linVel) == 0 && vec3.squaredLength(angularVel) == 0) return false;

				if (vec3.squaredLength(linVel) > 0.0) {
					// Add a velocity to the position
					vec3.scale(velVec, velVec, timeStep);

					vec3.add(this.pos, velVec, this.pos);
				}

				if (vec3.squaredLength(angularVel) > 0.0) {
					// Apply some rotations to the orientation from the angular velocity
					this.pitch(angularVel[0] * timeStep);
					this.yaw(angularVel[1] * timeStep);
					this.roll(angularVel[2] * timeStep);
				}

				return true;
			}
		}]);

		return BaseCamera;
	}();

	exports.default = BaseCamera;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _View2 = __webpack_require__(10);

	var _View3 = _interopRequireDefault(_View2);

	var _Mesh = __webpack_require__(12);

	var _Mesh2 = _interopRequireDefault(_Mesh);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ViewCopy = function (_View) {
		_inherits(ViewCopy, _View);

		function ViewCopy(transforms, frag) {
			_classCallCheck(this, ViewCopy);

			var _this = _possibleConstructorReturn(this, (ViewCopy.__proto__ || Object.getPrototypeOf(ViewCopy)).call(this, transforms, __webpack_require__(13), frag));

			var positions = [];
			var coords = [];
			var indices = [0, 1, 2, 0, 2, 3];

			var size = 1;
			positions.push([-size, -size, 0]);
			positions.push([size, -size, 0]);
			positions.push([size, size, 0]);
			positions.push([-size, size, 0]);

			coords.push([0, 0]);
			coords.push([1.0, 0]);
			coords.push([1.0, 1.0]);
			coords.push([0, 1.0]);

			// debugger;
			_this.mesh = new _Mesh2.default(positions.length, indices.length, _this.gl.TRIANGLES);
			_this.mesh.bufferVertex(positions);
			_this.mesh.bufferTexCoords(coords);
			_this.mesh.bufferIndices(indices);
			return _this;
		}

		_createClass(ViewCopy, [{
			key: "render",
			value: function render(texture, fadeAmount) {

				// this.transforms.push();

				this.shader.bind();

				this.shader.uniform("uTexturePos", "uniform1i", 0);
				texture.bind(this.shader, 0);

				// this.shader.uniform("uFadeAmount", "uniform1f", fadeAmount);


				this.draw(this.mesh);

				// this.transforms.pop();
			}
		}]);

		return ViewCopy;
	}(_View3.default);

	exports.default = ViewCopy;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ShaderProgram = __webpack_require__(11);

	var _ShaderProgram2 = _interopRequireDefault(_ShaderProgram);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var View = function () {
		function View(transforms, strVert, strFrag) {
			_classCallCheck(this, View);

			this.gl = window.NS.GL.glContext;

			this.transforms = transforms;

			this._enabledVertexAttrib = [];

			if (strVert == undefined) return;
			this.shader = new _ShaderProgram2.default(strVert, strFrag);
		}

		_createClass(View, [{
			key: "draw",
			value: function draw(mesh) {

				this.gl.uniformMatrix4fv(this.shader.prg.pMatrixUniform, false, this.transforms.getProjectionMatrix());
				this.gl.uniformMatrix4fv(this.shader.prg.mvMatrixUniform, false, this.transforms.getMvMatrix());

				// 	VERTEX POSITIONS
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vBufferPos);
				var vertexPositionAttribute = this.getAttribLoc(this.shader.prg, "aVertexPosition");
				this.gl.vertexAttribPointer(vertexPositionAttribute, mesh.vBufferPos.itemSize, this.gl.FLOAT, this.gl.FALSE, 0, 0);
				if (this._enabledVertexAttrib.indexOf(vertexPositionAttribute) == -1) {
					this.gl.enableVertexAttribArray(vertexPositionAttribute);
					this._enabledVertexAttrib.push(vertexPositionAttribute);
				}

				if (mesh.textureUsed) {
					//		TEXTURE COORDS
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.vBufferUV);
					var textureCoordAttribute = this.getAttribLoc(this.shader.prg, "aTextureCoord");
					this.gl.vertexAttribPointer(textureCoordAttribute, mesh.vBufferUV.itemSize, this.gl.FLOAT, this.gl.FALSE, 0, 0);
					// this.gl.enableVertexAttribArray(textureCoordAttribute);
					if (this._enabledVertexAttrib.indexOf(textureCoordAttribute) == -1) {
						this.gl.enableVertexAttribArray(textureCoordAttribute);
						this._enabledVertexAttrib.push(textureCoordAttribute);
					}
				}

				//	INDICES
				this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, mesh.iBuffer);

				//	EXTRA ATTRIBUTES
				for (var i = 0; i < mesh.extraAttributes.length; i++) {
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, mesh.extraAttributes[i].buffer);
					var attrPosition = this.getAttribLoc(this.shader.prg, mesh.extraAttributes[i].name);
					this.gl.vertexAttribPointer(attrPosition, mesh.extraAttributes[i].itemSize, this.gl.FLOAT, this.gl.FALSE, 0, 0);
					this.gl.enableVertexAttribArray(attrPosition);

					if (this._enabledVertexAttrib.indexOf(attrPosition) == -1) {
						this.gl.enableVertexAttribArray(attrPosition);
						this._enabledVertexAttrib.push(attrPosition);
					}
				}

				//	DRAWING
				// this.gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);	
				if (mesh.drawType == this.gl.POINTS) {
					this.gl.drawArrays(mesh.drawType, 0, mesh.vertexSize);
				} else {
					this.gl.drawElements(mesh.drawType, mesh.iBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
				}

				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
				this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
			}
		}, {
			key: "getAttribLoc",
			value: function getAttribLoc(shaderProgram, name) {
				if (shaderProgram.cacheAttribLoc == undefined) shaderProgram.cacheAttribLoc = {};
				if (shaderProgram.cacheAttribLoc[name] == undefined) {
					shaderProgram.cacheAttribLoc[name] = this.gl.getAttribLocation(shaderProgram, name);
				}

				return shaderProgram.cacheAttribLoc[name];
			}
		}]);

		return View;
	}();

	exports.default = View;

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ShaderProgram = function () {
		function ShaderProgram(vertexShader, fragmentShader) {
			_classCallCheck(this, ShaderProgram);

			this.gl = window.NS.GL.glContext;

			this.vertexShader = undefined;
			this.fragmentShader = undefined;

			this.vertexShader = this.createShaderProgram(vertexShader, true);
			this.fragmentShader = this.createShaderProgram(fragmentShader, false);
			this.parameters = [];

			this.prg = this.gl.createProgram();
			this.gl.attachShader(this.prg, this.vertexShader);
			this.gl.attachShader(this.prg, this.fragmentShader);
			this.gl.linkProgram(this.prg);
			this._isReady = true;
		}

		_createClass(ShaderProgram, [{
			key: "createShaderProgram",
			value: function createShaderProgram(str, isVertexShader) {
				var shader = isVertexShader ? this.gl.createShader(this.gl.VERTEX_SHADER) : this.gl.createShader(this.gl.FRAGMENT_SHADER);

				this.gl.shaderSource(shader, str);
				this.gl.compileShader(shader);

				if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
					alert(this.gl.getShaderInfoLog(shader));
					return null;
				}

				return shader;
			}
		}, {
			key: "bind",
			value: function bind() {

				this.gl.useProgram(this.prg);

				if (!this.prg) debugger;

				if (this.prg.pMatrixUniform == undefined) this.prg.pMatrixUniform = this.gl.getUniformLocation(this.prg, "uPMatrix");
				if (this.prg.mvMatrixUniform == undefined) this.prg.mvMatrixUniform = this.gl.getUniformLocation(this.prg, "uMVMatrix");

				this.uniformTextures = [];
			}
		}, {
			key: "uniform",
			value: function uniform(name, type, value) {

				if (type == "texture") type = "uniform1i";

				var hasUniform = false;
				var oUniform;
				for (var i = 0; i < this.parameters.length; i++) {
					oUniform = this.parameters[i];
					if (oUniform.name == name) {
						oUniform.value = value;
						hasUniform = true;
						break;
					}
				}

				if (!hasUniform) {
					this.prg[name] = this.gl.getUniformLocation(this.prg, name);
					this.parameters.push({ name: name, type: type, value: value, uniformLoc: this.prg[name] });
				} else {
					this.prg[name] = oUniform.uniformLoc;
				}

				if (type.indexOf("Matrix") == -1) {
					this.gl[type](this.prg[name], value);
				} else {
					this.gl[type](this.prg[name], false, value);
				}

				if (type == "uniform1i") {
					//	TEXTURE
					this.uniformTextures[value] = this.prg[name];
					// if(name == "textureForce") console.log( "Texture Force : ",  this.uniformTextures[value], value );
				}
			}
		}, {
			key: "unbind",
			value: function unbind() {}
		}, {
			key: "isReady",
			value: function isReady() {
				return this._isReady;
			}
		}]);

		return ShaderProgram;
	}();

	exports.default = ShaderProgram;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Mesh = function () {
		function Mesh(vertexSize, indexSize, drawType) {
			_classCallCheck(this, Mesh);

			this.gl = window.NS.GL.glContext;

			this.vertexSize = vertexSize;
			this.indexSize = indexSize;
			this.drawType = drawType;
			this.extraAttributes = [];

			this.textureUsed = false;

			this._floatArrayVertex = undefined;
		}

		_createClass(Mesh, [{
			key: "bufferVertex",
			value: function bufferVertex(aryVertices) {

				var vertices = [];

				for (var i = 0; i < aryVertices.length; i++) {
					for (var j = 0; j < aryVertices[i].length; j++) {
						vertices.push(aryVertices[i][j]);
					}
				}

				if (this.vBufferPos == undefined) this.vBufferPos = this.gl.createBuffer();
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferPos);

				if (this._floatArrayVertex == undefined) this._floatArrayVertex = new Float32Array(vertices);else {
					if (aryVertices.length != this._floatArrayVertex.length) this._floatArrayVertex = new Float32Array(vertices);else {
						for (var i = 0; i < aryVertices.length; i++) {
							this._floatArrayVertex[i] = aryVertices[i];
						}
					}
				}

				this.gl.bufferData(this.gl.ARRAY_BUFFER, this._floatArrayVertex, this.gl.STATIC_DRAW);
				this.vBufferPos.itemSize = 3;
			}
		}, {
			key: "bufferTexCoords",
			value: function bufferTexCoords(aryTexCoords) {

				var coords = [];

				this.textureUsed = true;

				for (var i = 0; i < aryTexCoords.length; i++) {
					for (var j = 0; j < aryTexCoords[i].length; j++) {
						coords.push(aryTexCoords[i][j]);
					}
				}

				this.vBufferUV = this.gl.createBuffer();
				this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBufferUV);
				this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(coords), this.gl.STATIC_DRAW);
				this.vBufferUV.itemSize = 2;
			}
		}, {
			key: "bufferData",
			value: function bufferData(data, name, itemSize, flat) {

				var index = -1;
				for (var i = 0; i < this.extraAttributes.length; i++) {
					if (this.extraAttributes[i].name == name) {
						this.extraAttributes[i].data = data;
						index = i;
						break;
					}
				}

				var bufferData = [];
				if (flat) {
					bufferData = data.slice(0);
				} else {

					for (var i = 0; i < data.length; i++) {

						for (var j = 0; j < data[i].length; j++) {
							bufferData.push(data[i][j]);
						}
					}
				}

				if (index == -1) {
					var buffer = this.gl.createBuffer();
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
					var floatArray = new Float32Array(bufferData);
					this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, this.gl.STATIC_DRAW);
					this.extraAttributes.push({ name: name, data: data, itemSize: itemSize, buffer: buffer, floatArray: floatArray });
				} else {
					var buffer = this.extraAttributes[index].buffer;
					this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
					var floatArray = this.extraAttributes[index].floatArray;
					for (var i = 0; i < bufferData.length; i++) {
						floatArray[i] = bufferData[i];
					}
					this.gl.bufferData(this.gl.ARRAY_BUFFER, floatArray, this.gl.STATIC_DRAW);
				}
			}
		}, {
			key: "bufferIndices",
			value: function bufferIndices(aryIndices) {

				this.iBuffer = this.gl.createBuffer();
				this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
				this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(aryIndices), this.gl.STATIC_DRAW);
				this.iBuffer.itemSize = 1;
				this.iBuffer.numItems = aryIndices.length;
			}
		}]);

		return Mesh;
	}();

	exports.default = Mesh;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = "precision highp float;\n#define GLSLIFY 1\n\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n\tvec3 vVertex = aVertexPosition;\n\tgl_Position = uPMatrix * uMVMatrix * vec4(vVertex, 1.0);\n    vTextureCoord = aTextureCoord;\n}"

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _View2 = __webpack_require__(10);

	var _View3 = _interopRequireDefault(_View2);

	var _Mesh = __webpack_require__(12);

	var _Mesh2 = _interopRequireDefault(_Mesh);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ViewPoints = function (_View) {
		_inherits(ViewPoints, _View);

		function ViewPoints(transforms) {
			_classCallCheck(this, ViewPoints);

			var _this = _possibleConstructorReturn(this, (ViewPoints.__proto__ || Object.getPrototypeOf(ViewPoints)).call(this, transforms, __webpack_require__(15), __webpack_require__(16)));

			var positions = [];
			var coords = [];
			var indices = [];
			var colors = [];
			var extraCoords = [];

			var detail = window.NS.GL.params.detail;
			// var detail = 32;
			var totDetail = detail * detail;

			var index = 0;

			var y = 1 - 2 / (detail * 2);
			var step = 2 / detail;

			for (var row = 0; row < detail; row++) {

				var x = -1 + 2 / (detail * 2);
				for (var col = 0; col < detail; col++) {

					positions.push([x, y, 0]);
					indices.push(index);
					coords.push([col / detail, 1.0 - row / detail]);

					colors.push([Math.random() * 10 / 10, .3, .1]);

					extraCoords.push([2.5 - index / totDetail, 1 + index / totDetail, .5 - index / totDetail]);

					x += step;
					index++;
				}

				y -= step;
			}

			_this._counter = .1;

			_this.mesh = new _Mesh2.default(positions.length, indices.length, _this.gl.POINTS);
			_this.mesh.bufferVertex(positions);
			// this.mesh.bufferTexCoords(coords);
			_this.mesh.bufferIndices(indices);
			// this.mesh.bufferData(colors, "aVertexColor", 3);
			// this.mesh.bufferData(extraCoords, "aVertexExtraCoord", 3);
			return _this;
		}

		_createClass(ViewPoints, [{
			key: "render",
			value: function render(permTexture, simplexTexture) {

				// this.transforms.push();

				this.transforms.calculateModelView();

				this.shader.bind();

				this.shader.uniform("simplexTexture", "uniform1i", 0);
				this.shader.uniform("permTexture", "uniform1i", 1);

				simplexTexture.bind(this.shader, 0);
				permTexture.bind(this.shader, 1);

				// this.shader.uniform("uTexture", "uniform1i", 2);
				// texturePos.bind(this.shader, 2);

				this.shader.uniform("uCounter", "uniform1f", this._counter += .005);
				this.shader.uniform("uRandom", "uniform1f", Math.random());

				this.draw(this.mesh);

				// this.transforms.pop();
			}
		}]);

		return ViewPoints;
	}(_View3.default);

	exports.default = ViewPoints;

/***/ }),
/* 15 */
/***/ (function(module, exports) {

	module.exports = "precision highp float;\n#define GLSLIFY 1\n\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nuniform sampler2D simplexTexture;\nuniform sampler2D permTexture;\n\nuniform float uCounter;\nuniform float uRandom;\n\nvarying float noise;\nvarying float vCounter;\nvarying vec3 vPos;\nvarying vec2 vTextureCoord;\nvarying vec3 vColor;\n\n#define PI 3.141592653589793\n#define ONE 0.00390625\n#define ONEHALF 0.001953125\n\n/*\n * 3D simplex noise. Comparable in speed to classic noise, better looking.\n */\nfloat snoise(vec3 P){\n\n\t// The skewing and unskewing factors are much simpler for the 3D case\n\t#define F3 0.333333333333\n\t#define G3 0.166666666667\n\n  // Skew the (x,y,z) space to determine which cell of 6 simplices we're in\n\tfloat s = (P.x + P.y + P.z) * F3; // Factor for 3D skewing\n\tvec3 Pi = floor(P + s);\n\tfloat t = (Pi.x + Pi.y + Pi.z) * G3;\n\tvec3 P0 = Pi - t; // Unskew the cell origin back to (x,y,z) space\n\tPi = Pi * ONE + ONEHALF; // Integer part, scaled and offset for texture lookup\n\n\tvec3 Pf0 = P - P0;  // The x,y distances from the cell origin\n\n  // // For the 3D case, the simplex shape is a slightly irregular tetrahedron.\n  // // To find out which of the six possible tetrahedra we're in, we need to\n  // // determine the magnitude ordering of x, y and z components of Pf0.\n  // // The method below is explained briefly in the C code. It uses a small\n  // // 1D texture as a lookup table. The table is designed to work for both\n  // // 3D and 4D noise, so only 8 (only 6, actually) of the 64 indices are\n  // // used here.\n\tfloat c1 = (Pf0.x > Pf0.y) ? 0.5078125 : 0.0078125; // 1/2 + 1/128\n\tfloat c2 = (Pf0.x > Pf0.z) ? 0.25 : 0.0;\n\tfloat c3 = (Pf0.y > Pf0.z) ? 0.125 : 0.0;\n\tfloat sindex = c1 + c2 + c3;\n \tvec3 offsets = texture2D(simplexTexture, vec2(sindex, 0)).rgb;\n\tvec3 o1 = step(0.375, offsets);\n\tvec3 o2 = step(0.125, offsets);\n\n  // Noise contribution from simplex origin\n  float perm0 = texture2D(permTexture, Pi.xy).a;\n  vec3  grad0 = texture2D(permTexture, vec2(perm0, Pi.z)).rgb * 4.0 - 1.0;\n  float t0 = 0.6 - dot(Pf0, Pf0);\n  float n0;\n  if (t0 < 0.0) n0 = 0.0;\n  else {\n    t0 *= t0;\n    n0 = t0 * t0 * dot(grad0, Pf0);\n  }\n\n  // Noise contribution from second corner\n  vec3 Pf1 = Pf0 - o1 + G3;\n  float perm1 = texture2D(permTexture, Pi.xy + o1.xy*ONE).a;\n  vec3  grad1 = texture2D(permTexture, vec2(perm1, Pi.z + o1.z*ONE)).rgb * 4.0 - 1.0;\n  float t1 = 0.6 - dot(Pf1, Pf1);\n  float n1;\n  if (t1 < 0.0) n1 = 0.0;\n  else {\n    t1 *= t1;\n    n1 = t1 * t1 * dot(grad1, Pf1);\n  }\n  \n  // Noise contribution from third corner\n  vec3 Pf2 = Pf0 - o2 + 2.0 * G3;\n  float perm2 = texture2D(permTexture, Pi.xy + o2.xy*ONE).a;\n  vec3  grad2 = texture2D(permTexture, vec2(perm2, Pi.z + o2.z*ONE)).rgb * 4.0 - 1.0;\n  float t2 = 0.6 - dot(Pf2, Pf2);\n  float n2;\n  if (t2 < 0.0) n2 = 0.0;\n  else {\n    t2 *= t2;\n    n2 = t2 * t2 * dot(grad2, Pf2);\n  }\n  \n  // Noise contribution from last corner\n  vec3 Pf3 = Pf0 - vec3(1.0-3.0*G3);\n  float perm3 = texture2D(permTexture, Pi.xy + vec2(ONE, ONE)).a;\n  vec3  grad3 = texture2D(permTexture, vec2(perm3, Pi.z + ONE)).rgb * 4.0 - 1.0;\n  float t3 = 0.6 - dot(Pf3, Pf3);\n  float n3;\n  if(t3 < 0.0) n3 = 0.0;\n  else {\n    t3 *= t3;\n    n3 = t3 * t3 * dot(grad3, Pf3);\n  }\n\n  // Sum up and scale the result to cover the range [-1,1]\n  return 32.0 * (n0 + n1 + n2 + n3);\n}\n\nfloat pulse(float time) {\n    // const float pi = 3.14;\n    float frequency = 1.0;\n    return 0.5*(1.0+sin(2.0 * PI * frequency * time));\n}\n\n\nvoid main(void) {\n\tgl_PointSize = 1.0;\n\n  vec3 newPos = aVertexPosition;\n\n  float counter = sin(uCounter);\n\n\tfloat n = snoise(vec3(newPos.xy/vec2(.9), sin(counter)));\n\n\tgl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n\n\tvCounter = uCounter;\n\tnoise = n;\n\tvPos = newPos;\n  // vColor = aVertexColor;\n  // vTextureCoord = aTextureCoord;\n}"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = "precision highp float;\n#define GLSLIFY 1\n\n\n\nvarying float noise;\nvarying float vCounter;\nvarying vec3 vPos;\n// varying vec2 vTextureCoord;\n\nvoid main(void) {\n\n\tvec3 newPos = vPos;\n\t// float noiseVal = noise;\n\tvec3 whiteColor = vec3(1.0, 1.0, 1.0);\n\tvec3 blueColor = vec3(66.0/255.0, 134.0 / 255.0, 244.0 / 255.0);\n\tvec3 blackColor = vec3(0.0, 0.0, 0.0);\n\tvec3 skinColor = vec3(247.0/255.0, 219.0/255.0, 205.0/255.0);\n\tvec3 pinkColor = vec3(247.0/255.0, 205.0/255.0, 224.0/255.0);\n\tvec3 redColor = vec3(244.0/255.0, 66.0/255.0, 78.0/255.0);\n\t// vec3 otherColor = vec3(.2, .1, .2);\n\t// vec3 color = mix(vPos, vec3(noise), vCounter);\n\t// newPos += vec3(.2);\n\t// newPos *= vec3(.1);\n\t// newPos.y += 1.0;\n\n\t// vec3 color = vec3((abs(vPos.y)/abs(vPos.x))*(noise*2.0), 1.0, 1.0);\n\n\tvec3 color = mix(pinkColor, redColor, (noise * .3));\n\tcolor = clamp(color, vec3(0.0), vec3(.9));\n\t// vec3 color = mix(baseColor, newPos * vec3(noise), .4);\n\t// color *= vec3(1.6);\n\t// color *= vec3(1.5);\n\t// color = min(color, .5);\n\t// color = vec3(1.0, 1.0, 1.0);\n\n\t// color = clamp(color, vec3(0.0), vec3(.5));\n\t// if (color.r >= .5)\n\t// \tcolor = vec3(1.0);\n\n\t// color \n\n\n\t// color += vec3(.5);\n\n\t// color *= vec3(1.1, 1.1, 1.0);\n\n\n\n\t// color = inversesqrt(color);\n\n\t// vec3 color = newPos;\n\t// vec3 color = baseColor;\n\t// color += vec3(.3);\n\t// color *= vec3(4.0, 3.3, 3.5);\n\n\t// color = mix(baseColor, color, .005);\n\t// color *= vec3(2.2, 2.2, 2.2);\n\t// color = clamp(color, vec3(.9, .9, .9), baseColor);\n\t\n\t// color = mix(color, vec3(.4, .8, .2), 1.0 - colorPick);\n\n    gl_FragColor = vec4(color, 1.0);\n    // gl_FragColor = vec4(vec3(.5, .3, .3), 1.0);\n\n}"

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _View2 = __webpack_require__(10);

	var _View3 = _interopRequireDefault(_View2);

	var _Mesh = __webpack_require__(12);

	var _Mesh2 = _interopRequireDefault(_Mesh);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ViewDistanceNoise = function (_View) {
		_inherits(ViewDistanceNoise, _View);

		function ViewDistanceNoise(transforms, frag) {
			_classCallCheck(this, ViewDistanceNoise);

			var _this = _possibleConstructorReturn(this, (ViewDistanceNoise.__proto__ || Object.getPrototypeOf(ViewDistanceNoise)).call(this, transforms, __webpack_require__(13), frag));

			var positions = [];
			var coords = [];
			var indices = [0, 1, 2, 0, 2, 3];

			var size = 1;
			positions.push([-size, -size, 0]);
			positions.push([size, -size, 0]);
			positions.push([size, size, 0]);
			positions.push([-size, size, 0]);

			coords.push([0, 0]);
			coords.push([1.0, 0]);
			coords.push([1.0, 1.0]);
			coords.push([0, 1.0]);

			// debugger;
			_this.mesh = new _Mesh2.default(positions.length, indices.length, _this.gl.TRIANGLES);
			_this.mesh.bufferVertex(positions);
			_this.mesh.bufferTexCoords(coords);
			_this.mesh.bufferIndices(indices);

			_this.time = Date.now();

			return _this;
		}

		_createClass(ViewDistanceNoise, [{
			key: "render",
			value: function render(w, h, speed) {

				// this.transforms.push();

				this.shader.bind();

				// this.shader.uniform("uTexturePos", "uniform1i", 0);
				// texture.bind(this.shader, 0);

				var currTime = Date.now();
				var time = currTime - this.time;

				this.shader.uniform("u_time", "uniform1f", time);
				this.shader.uniform("u_resolution_w", "uniform1f", w);
				this.shader.uniform("u_resolution_h", "uniform1f", h);
				this.shader.uniform("u_speed", "uniform1f", speed);

				// this.shader.uniform("uFadeAmount", "uniform1f", fadeAmount);


				this.draw(this.mesh);

				// this.transforms.pop();
			}
		}]);

		return ViewDistanceNoise;
	}(_View3.default);

	exports.default = ViewDistanceNoise;

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var SceneTransforms = function () {
		function SceneTransforms(canvas) {
			_classCallCheck(this, SceneTransforms);

			this._stack = [];
			// this._camera = c;
			this._canvas = canvas;
			this._mvMatrix = mat4.create(); // The Model-View matrix
			// this._pMatrix     = mat4.create();    // The projection matrix
			// this._nMatrix     = mat4.create();    // The normal matrix
			// this.cMatrix     = mat4.create();    // The camera matrix

			mat4.identity(this._mvMatrix);

			this.FIELD_OF_VIEW = 45 * Math.PI / 180;
		}

		_createClass(SceneTransforms, [{
			key: "setCamera",
			value: function setCamera(c) {

				this._camera = c;
			}
		}, {
			key: "calculateModelView",
			value: function calculateModelView() {

				// this._mvMatrix = this._camera.getViewTransform();
				mat4.multiply(this._mvMatrix, this._mvMatrix, this._camera.getViewMatrix());

				// var m = mat4.create();
				// mat4.invert(m, this._camera.getViewMatrix());

				// this._mvMatrix = m;

			}
		}, {
			key: "calculateNormal",
			value: function calculateNormal() {

				mat4.identity(this._nMatrix);
				mat4.copy(this._nMatrix, this._mvMatrix);
				mat4.invert(this._nMatrix, this._nMatrix);
				mat4.transpose(this._nMatrix, this._nMatrix);
			}
		}, {
			key: "calculatePerspective",
			value: function calculatePerspective() {

				mat4.identity(this._pMatrix);
				mat4.perspective(this.FIELD_OF_VIEW, this._canvas.width / this._canvas.height, 0.1, 1000, this._pMatrix);
			}
		}, {
			key: "updatePerspective",
			value: function updatePerspective(w, h) {

				mat4.perspective(this._pMatrix, SceneTransforms.FIELD_OF_VIEW, w / h, 0.1, 1000);
			}
		}, {
			key: "resetPerspective",
			value: function resetPerspective() {

				mat4.identity(this._pMatrix);
			}
		}, {
			key: "setMatrixUniforms",
			value: function setMatrixUniforms() {

				this.calculateNormal();
			}
		}, {
			key: "getMvMatrix",
			value: function getMvMatrix() {

				// var m = mat4.create();
				// mat4.copy(m, this._mvMatrix);

				// return m;
				return this._mvMatrix;
			}
		}, {
			key: "getProjectionMatrix",
			value: function getProjectionMatrix() {

				// return this._pMatrix;
				return this._camera.getProjectionMatrix();
			}
		}, {
			key: "getNormalMatrix",
			value: function getNormalMatrix() {

				return this._nMatrix;
			}
		}, {
			key: "pop",
			value: function pop() {

				if (this._stack.length == 0) return;
				this._mvMatrix = this._stack.pop();
			}
		}, {
			key: "push",
			value: function push() {

				var memento = mat4.create();
				mat4.copy(memento, this._mvMatrix);
				this._stack.push(memento);
			}
		}]);

		return SceneTransforms;
	}();

	exports.default = SceneTransforms;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Texture = __webpack_require__(20);

	var _Texture2 = _interopRequireDefault(_Texture);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Framebuffer = function () {
		function Framebuffer(width, height, magFilter, minFilter, texType, src) {
			_classCallCheck(this, Framebuffer);

			this.gl = window.NS.GL.glContext;

			this.id = '';

			this.texType = texType;
			this.width = width;
			this.height = height;
			this.magFilter = magFilter == undefined ? this.gl.LINEAR : magFilter;
			this.minFilter = minFilter == undefined ? this.gl.LINEAR : minFilter;

			this.depthTextureExt = this.gl.getExtension("WEBKIT_WEBGL_depth_texture"); // Or browser-appropriate prefix

			this.texture = this.gl.createTexture();
			this.depthTexture = this.gl.createTexture();
			this.glTexture = new _Texture2.default(this.texture, true);
			// this.glTexture.init(this.texture, true);
			this.glDepthTexture = new _Texture2.default(this.depthTexture, true);
			// this.glDepthTexture.init(this.depthTexture, true);
			this.frameBuffer = this.gl.createFramebuffer();
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
			this.frameBuffer.width = this.width;
			this.frameBuffer.height = this.height;
			var size = this.width;

			this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
			// if(this.magFilter == this.gl.NEAREST && this.minFilter == this.gl.NEAREST) 
			// 	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, this.gl.RGBA, this.gl.FLOAT, null);
			// else
			// 	this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);

			if (!src) this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, this.gl.RGBA, texType, null);else this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, texType, src);

			// this.gl.generateMipmap(this.gl.TEXTURE_2D);

			this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
			this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
			if (this.depthTextureExt != null) this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.DEPTH_COMPONENT, this.width, this.height, 0, this.gl.DEPTH_COMPONENT, this.gl.UNSIGNED_SHORT, null);

			this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this.texture, 0);
			if (this.depthTextureExt == null) {
				console.log("no depth texture");
				var renderbuffer = this.gl.createRenderbuffer();
				this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, renderbuffer);
				this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, this.frameBuffer.width, this.frameBuffer.height);
				this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, renderbuffer);
			} else {
				this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture, 0);
			}

			this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, null);
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
		}

		_createClass(Framebuffer, [{
			key: 'bind',
			value: function bind() {
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.frameBuffer);
			}
		}, {
			key: 'unbind',
			value: function unbind() {
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
			}
		}, {
			key: 'getTexture',
			value: function getTexture() {
				return this.glTexture;
			}
		}, {
			key: 'getDepthTexture',
			value: function getDepthTexture() {
				return this.glDepthTexture;
			}
		}]);

		return Framebuffer;
	}();

	exports.default = Framebuffer;

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Texture = function () {
		function Texture(source, isTexture) {
			_classCallCheck(this, Texture);

			this.gl = window.NS.GL.glContext;

			if (isTexture == undefined) isTexture = isTexture == undefined ? false : true;
			// this.gl = GL.this.gl;
			if (isTexture) {
				this.texture = source;
			} else {
				this.texture = this.gl.createTexture();
				this._isVideo = source.tagName == "VIDEO";

				this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
				this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
				this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);

				if (!this._isVideo) {
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
					this.gl.generateMipmap(this.gl.TEXTURE_2D);
				} else {
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
					this.gl.generateMipmap(this.gl.TEXTURE_2D);
				}

				this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			}
		}

		_createClass(Texture, [{
			key: "updateTexture",
			value: function updateTexture(source) {

				this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
				this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true);
				this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, source);

				// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.frameBuffer.width, this.frameBuffer.height, 0, gl.RGBA, texType, null);

				if (!this._isVideo) {
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_NEAREST);
					this.gl.generateMipmap(this.gl.TEXTURE_2D);
				} else {
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
					this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
				}

				this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			}
		}, {
			key: "bind",
			value: function bind(shader, index, toDebug) {
				if (index == undefined) index = 0;

				this.gl.activeTexture(this.gl.TEXTURE0 + index);
				// console.log( gl.TEXTURE0 + i, this._textures[i].texture );
				this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
				// gl.uniform1i(shaderProgram["samplerUniform"+i], i);
				// if(toDebug) console.log( GL.shader.uniformTextures[index], this );
				this.gl.uniform1i(shader.uniformTextures[index], index);
				this._bindIndex = index;
			}
		}, {
			key: "unbind",
			value: function unbind() {
				this.gl.bindTexture(this.gl.TEXTURE_2D, null);
			}
		}]);

		return Texture;
	}();

	exports.default = Texture;

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = "#ifdef GL_ES\nprecision mediump float;\n#define GLSLIFY 1\n#endif\n\nuniform float u_resolution_w;\nuniform float u_resolution_h;\nuniform float u_speed;\n// uniform vec2 u_mouse;\nuniform float u_time;\n\nvec2 random2(vec2 st){\n    st = vec2( dot(st,vec2(127.1,311.7)),\n              dot(st,vec2(269.5,183.3)) );\n    return -1.0 + 2.0*fract(sin(st)*43758.5453123);\n}\n\n// Value Noise by Inigo Quilez - iq/2013\n// https://www.shadertoy.com/view/lsf3WH\nfloat noise(vec2 st) {\n    vec2 i = floor(st);\n    vec2 f = fract(st);\n\n    vec2 u = f*f*(3.0-2.0*f);\n\n    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),\n                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),\n                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),\n                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);\n}\n\nvoid main() {\n    // vec2 st = gl_FragCoord.xy/u_resolution.xy;\n    // st.x *= u_resolution.x/u_resolution.y;\n\n    vec2 st;\n    st.x = gl_FragCoord.x / u_resolution_w;\n    st.y = gl_FragCoord.y / u_resolution_h;\n    st.x *= u_resolution_w/u_resolution_h;\n\n    vec3 color = vec3(0.0);\n\n    float t = 2.0;\n\n    float speed = u_time * u_speed;\n    // Uncomment to animate\n    t = abs(1.0-sin(speed*.0001))*4.;\n    // Comment and uncomment the following lines:\n    //st += noise(st+sin(4. * u_time * .1) - cos(2.0 * u_time * .2)) * cos(t); // Animate the coordinate space\n    st += noise(vec2(st.x +sin(1. * speed * .1), st.y - cos(4.0 * speed * .2)) * cos(t));\n    //color = vec3(1.) * smoothstep(.18,.25,noise(st)); // Big black drops\n    color += smoothstep(.002,.06,noise(vec2(st.x*4., st.y * 20.))); // Black splatter\n    color -= smoothstep(.35,.4,noise(st*10.)); // Holes on splatter\n    \n    vec3 finalColor = clamp(color, 0.0, 1.0);\n    \n    vec3 pinkColor = vec3(247.0/255.0, 205.0/255.0, 224.0/255.0);\n\tvec3 redColor = vec3(244.0/255.0, 66.0/255.0, 78.0/255.0);\n    vec3 greenColor = vec3(65.0/255.0, 244.0/255.0, 208.0/255.0);\n    \n    finalColor = mix(pinkColor, greenColor, finalColor);\n    \n    \n    //finalColor = (1.0 - color) - vec3(.2, .3, .4);\n\n    gl_FragColor = vec4(finalColor,1.0);\n}\n"

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	// import ViewFeatured from "./views/ViewFeatured";


	var _ViewImages = __webpack_require__(23);

	var _ViewImages2 = _interopRequireDefault(_ViewImages);

	var _ViewAbout = __webpack_require__(25);

	var _ViewAbout2 = _interopRequireDefault(_ViewAbout);

	var _ViewProjects = __webpack_require__(27);

	var _ViewProjects2 = _interopRequireDefault(_ViewProjects);

	var _ViewContact = __webpack_require__(31);

	var _ViewContact2 = _interopRequireDefault(_ViewContact);

	var _ViewMobileMenu = __webpack_require__(32);

	var _ViewMobileMenu2 = _interopRequireDefault(_ViewMobileMenu);

	var _ViewPostitGrid = __webpack_require__(34);

	var _ViewPostitGrid2 = _interopRequireDefault(_ViewPostitGrid);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var MOBILE_BREAK = 768;

	var Main = function () {
		function Main(data) {
			_classCallCheck(this, Main);

			this.DATA = data;

			this.currentShowingOverlay = null;

			this.historyState = { id: window.location.pathname };

			// window.addEventListener('hashChange', this.onHashChange.bind(this));
			window.addEventListener('popstate', this.onPopStateChange.bind(this));

			// this.pushState(this.historyState.id, window.location.pathname);

			// window.history.pushState({'state': 'test'}, 'test', 'test');

			// console.log(getVendorPrefix());

			this._mainLoaderGif = document.querySelector('.mainLoader');

			this._featuredGrid = new _ViewPostitGrid2.default(document.querySelector('.featured-content'), this.DATA.projects);

			// this._featured = new ViewFeatured(document.querySelector('.featured-content'), this.DATA.projects);

			// this._featured = new ViewProjects(document.getElementById('imageWrapper'), this.onOverlayHide, this, this.DATA.projects, true);

			// this._vImages = new ViewImages(document.getElementById('imageWrapper'), this.DATA.featured, this.featuredLoaded, this, MOBILE_BREAK);
			this._vAbout = new _ViewAbout2.default(document.querySelector('.overlay.about'), this.onOverlayHide, this);
			// this._vProjects = new ViewProjects(document.querySelector('.overlay.projects'), this.onOverlayHide, this, this.DATA.projects, true);
			this._vContact = new _ViewContact2.default(document.querySelector('.overlay.contact'), this.onOverlayHide, this);

			this._vMobileMenu = new _ViewMobileMenu2.default(document.querySelector('.nav'));

			this._overlays = [];

			// this._overlays[this._vAbout.dataId] = this._vAbout;
			// this._overlays[this._vProjects.dataId] = this._vProjects;
			// this._overlays[this._vContact.dataId] = this._vContact;

			var logo = document.querySelector('.logo');

			setTimeout(function () {
				logo.style.opacity = 1;
			}, 500);

			this._mainLoaderGif.style.display = 'none';

			var navItems = document.querySelectorAll('.nav-item');
			for (var i = 0; i < navItems.length; i++) {
				navItems[i].addEventListener('click', this.onNavClick.bind(this));
			}

			// this.featuredLoaded();

		}

		_createClass(Main, [{
			key: "onPopStateChange",
			value: function onPopStateChange(e) {

				console.log('hash change: ', e);
			}
		}, {
			key: "pushState",
			value: function pushState(id, url) {
				window.history.pushState({
					id: id
				}, '', url);
			}
		}, {
			key: "onOverlayHide",
			value: function onOverlayHide() {
				var _this = this;

				// document.body.style.overflow = 'visible';

				setTimeout(function () {
					_this._vImages.show();
				}, 500);
			}
		}, {
			key: "featuredLoaded",
			value: function featuredLoaded() {

				// this._mainLoaderGif.style.display = 'none';

				// this.onResize(window.innerWidth, window.innerHeight);

				// var navItems = document.querySelectorAll('.nav-item');
				// for (var i=0;i<navItems.length;i++){
				// 	navItems[i].addEventListener('click', this.onNavClick.bind(this));
				// }

				// window.scrollTo(0, 0);
				// this.onScroll();

				// window.addEventListener('scroll', (e) => {
				// 	this.onScroll(e);
				// });
			}
		}, {
			key: "onNavClick",
			value: function onNavClick(e) {

				console.log('sfsdf');

				// debugger;

				if (e.target.nodeName !== 'A') {

					e.preventDefault();

					var id = e.target.getAttribute('data-id');
					var url = e.target.getAttribute('data-url');
					this.pushState(id, url);

					// 	if (this._overlays[e.target.getAttribute('data-id')].showing) return;

					// 	if (!this._vImages.isHidden){
					// 		// document.body.style.overflow = 'hidden';

					// 		this._vImages.hide();
					// 	}

					// 	for (var overlay in this._overlays){
					// 		this._overlays[overlay]._hide();
					// 	}

					// 	setTimeout(() => {

					// 		this._overlays[e.target.getAttribute('data-id')]._show();
					// 	},1000);
				}
			}
		}, {
			key: "onScroll",
			value: function onScroll(e) {

				var scrollTop = getScrollTop();

				// this._vImages.onScroll(scrollTop);

				function getScrollTop() {

					var ret = document.body.scrollTop;

					if (ret == 0) {
						if (window.pageYOffset) ret = window.pageYOffset;else ret = document.body.parentElement ? document.body.parentElement.scrollTop : 0;
					}

					return ret;
				}
			}
		}, {
			key: "update",
			value: function update() {
				// if (this._vImages)
				// 	this._vImages.update();
			}
		}, {
			key: "onResize",
			value: function onResize(w, h) {
				// document.body.style.height = this._vImages.nrImages * h + 'px'; 

				// this._vImages.onResize(w, h);
				// for (var overlay in this._overlays)
				// 	this._overlays[overlay].onResize(w,h);

				this._vMobileMenu.onResize(w, h);
			}
		}]);

		return Main;
	}();

	exports.default = Main;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ViewImage = __webpack_require__(24);

	var _ViewImage2 = _interopRequireDefault(_ViewImage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ViewImages = function () {
		function ViewImages(el, images, imagesLoadedCallback, scope, mobileBreak) {
			_classCallCheck(this, ViewImages);

			this._el = el;

			this.col0El = this._el.querySelector('#featured-col-0');
			this.col1El = this._el.querySelector('#featured-col-1');

			this.mobileBreak;

			this.nrImages = images.length;
			this.images = images.slice();

			this.imagesLoadedCallback = imagesLoadedCallback;
			this.scope = scope;
			this.loadImage(this.images.shift());

			this.winH = undefined;

			this._viewImages = [];

			this.currScrollTop = -1;

			this.runUpdate = false;
			this.currentAnimation = { diff: undefined, start: undefined, end: undefined, current: undefined };

			this.isHidden = false;
		}

		_createClass(ViewImages, [{
			key: 'loadImage',
			value: function loadImage(src) {
				var _this = this;

				var wrapper = document.createElement('div');
				wrapper.classList.add('featured-item');

				var img = new Image();

				wrapper.appendChild(img);

				img.onload = function () {
					var imgIndex = _this.nrImages - 1 - _this.images.length;

					console.log(imgIndex % 2 == 1, '  ', imgIndex);

					imgIndex % 2 == 0 ? _this.col0El.appendChild(wrapper) : _this.col1El.appendChild(wrapper);

					// this._el.appendChild(wrapper);
					var viewImage = new _ViewImage2.default(img, _this.nrImages - _this._viewImages.length);
					_this._viewImages.push(viewImage);
					if (_this.images.length > 0) _this.loadImage(_this.images.shift());else {
						_this.onResize(window.innerWidth, window.innerHeight);
						_this.imagesLoadedCallback.call(_this.scope);
					}
				};
				img.src = 'assets/' + src + '.png';
			}
		}, {
			key: 'show',
			value: function show() {

				// this.isHidden = false;

				// var currScrollTop = this.currScrollTop;
				// var winH = this.winH;
				// var currentIdx = Math.floor(currScrollTop / winH);

				// window.scrollTo(0, currScrollTop);

				// var scrollTop = 0;
				// if (currentIdx == 0){
				// 	scrollTop = winH;
				// 	console.log('first');
				// }
				// else if (currentIdx == this.nrImages-1){
				// 	console.log('last');
				// 	scrollTop = currentIdx * winH;
				// }else{
				// 	scrollTop = winH * currentIdx - winH;
				// 	console.log('mid');
				// }

				// currScrollTop -= winH;
				// var diff = scrollTop - currScrollTop;
				// this.currentAnimation.diff = diff;
				// this.currentAnimation.start = currScrollTop;
				// this.currentAnimation.current = 0.0;
				// this.currentAnimation.type = 'show';
				// this.runUpdate = true;


			}
		}, {
			key: 'hide',
			value: function hide() {

				// var currScrollTop = this.currScrollTop;
				// var winH = this.winH;
				// var currentIdx = Math.floor(currScrollTop / winH);

				// var scrollTop = 0;
				// if (currentIdx == 0){
				// 	scrollTop = winH/2;
				// 	console.log('first');
				// }
				// else if (currentIdx == this.nrImages-1){
				// 	console.log('last');
				// 	scrollTop = currentIdx * winH - winH/2;
				// }else{
				// 	scrollTop = winH * currentIdx + winH/2 - winH;
				// 	console.log('mid');
				// }

				// currScrollTop -= winH;
				// var diff = scrollTop - currScrollTop;
				// this.currentAnimation.diff = diff;
				// this.currentAnimation.start = currScrollTop;
				// this.currentAnimation.current = 0.0;
				// this.currentAnimation.type = 'hide';
				// this.runUpdate = true;

			}
		}, {
			key: 'update',
			value: function update() {

				if (!this.runUpdate) return;

				// var val = this.currentAnimation.diff * this.currentAnimation.current + this.currentAnimation.start;

				// window.scrollTo(0,val);

				// if (this.currentAnimation.current >= 1){
				// 	if (this.currentAnimation.type == 'hide')
				// 		this.isHidden = true;

				// 	this.runUpdate = false;
				// }
				// else{
				// 	this.currentAnimation.current += .05;
				// }
			}
		}, {
			key: 'onScroll',
			value: function onScroll(scrollTop) {

				if (this.isHidden) return;

				// if (this._viewImages.length == 0) return;

				// var winH = this.winH;
				// scrollTop += winH;
				// var currentIdx = Math.floor(scrollTop / winH);
				// if (currentIdx == this.nrImages) return;
				// var prevIdx = currentIdx > 0 ? currentIdx - 1 : -1;
				// var nextIdx = currentIdx < this.nrImages-1 ? currentIdx + 1 : -1;

				// var normalized = Math.round(scrollTop % winH / winH * 100) / 100;
				// var prevNormalized = 1 - normalized;
				// var nextNormalized = 1 - normalized;

				// if (currentIdx > -1){
				// 	this._viewImages[currentIdx].update(normalized);
				// }		

				// if (prevIdx > -1){
				// 	this._viewImages[prevIdx].update(prevNormalized);
				// }


				// this.currScrollTop = scrollTop;
			}
		}, {
			key: 'onResize',
			value: function onResize(w, h) {

				this.winH = h;

				// for (var img of this._viewImages){
				// 	img.onResize(w,h);
				// }
			}
		}]);

		return ViewImages;
	}();

	exports.default = ViewImages;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ViewImage = function () {
		function ViewImage(el, idx) {
			_classCallCheck(this, ViewImage);

			this._el = el;
			this._idx = idx;
		}

		_createClass(ViewImage, [{
			key: "update",
			value: function update(normalized) {

				// var opacity = Math.pow(normalized, 8);
				// var scaleMult = this._isMobile ? 1.0 : 1.3;
				// var scale = Math.pow(normalized, 3) * scaleMult;


				// this._el.style[window.NS.transform] = 'scale('+scale+')';

				// this._el.style.opacity = opacity;


			}
		}, {
			key: "onResize",
			value: function onResize(w, h) {

				this._isMobile = w < 768 ? true : false;
				// this._el.style.marginLeft = - (this._el.width / 2) + 'px';
			}
		}]);

		return ViewImage;
	}();

	exports.default = ViewImage;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _ViewOverlay2 = __webpack_require__(26);

	var _ViewOverlay3 = _interopRequireDefault(_ViewOverlay2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ViewAbout = function (_ViewOverlay) {
		_inherits(ViewAbout, _ViewOverlay);

		function ViewAbout(el, onHideCallback, callbackScope) {
			_classCallCheck(this, ViewAbout);

			return _possibleConstructorReturn(this, (ViewAbout.__proto__ || Object.getPrototypeOf(ViewAbout)).call(this, el, onHideCallback, callbackScope));
		}

		return ViewAbout;
	}(_ViewOverlay3.default);

	exports.default = ViewAbout;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ViewOverlay = function () {
		function ViewOverlay(el, onHideCallback, callbackScope) {
			var hasDetail = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			_classCallCheck(this, ViewOverlay);

			this._el = el;

			this.dataId = this._el.getAttribute('data-id');

			// this._el.style.transform = 'scale(.93)';

			this.onHideCallback = onHideCallback;
			this.callbackScope = callbackScope;

			this.hasDetail = hasDetail;

			this.closeBtn = document.querySelector('.closeBtn');
			this.onCloseBtnClickBound = this.onCloseBtnClick.bind(this);
			// var touchLayer = this._el.querySelector('.touchLayer');
			// touchLayer.addEventListener('click', () => {
			// 	this._hide();
			// 	this.onHideCallback.call(this.callbackScope);
			// });

			this.showing = false;
			// this.onResize(window.innerWidth, window.innerHeight);

		}

		_createClass(ViewOverlay, [{
			key: 'toggle',
			value: function toggle() {

				if (this.showing) this._hide();else this._show();
			}
		}, {
			key: 'activateCloseBtn',
			value: function activateCloseBtn() {

				this.closeBtn.addEventListener('click', this.onCloseBtnClickBound);
			}
		}, {
			key: 'onCloseBtnClick',
			value: function onCloseBtnClick() {

				console.log('close btn');
				if (this.hasDetail) {

					if (this.detailOpen) {
						console.log('deatil open');
						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = this.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var item = _step.value;

								item._projectDetail.hide();
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}
					} else {
						this._hide();
						this.onHideCallback.call(this.callbackScope);
					}
				} else {
					this._hide();
					this.onHideCallback.call(this.callbackScope);
				}
			}
		}, {
			key: 'inactivateCloseBtn',
			value: function inactivateCloseBtn() {

				this.closeBtn.removeEventListener('click', this.onCloseBtnClickBound);
			}
		}, {
			key: '_show',
			value: function _show() {

				this.activateCloseBtn();
				this._el.style.display = 'block';

				var self = this;
				setTimeout(function () {
					self._el.style.opacity = 1;
					// self._el.style[window.NS.transform] = 'scale(1.0)';


					self.closeBtn.style.opacity = 1;
				}, 100);

				this.showing = true;

				window.scrollTo(0, 0);
			}
		}, {
			key: '_hide',
			value: function _hide() {
				var _this = this;

				this.inactivateCloseBtn();
				// this._el.style.transform = 'translate3d(0, -100%,0)';
				this._el.style.opacity = 0;
				// this._el.style[window.NS.transform] = 'scale(.93)';

				this.closeBtn.style.opacity = 0;

				setTimeout(function () {
					_this._el.style.display = 'none';
				}, 1000);
				this.showing = false;

				// this._el.style.height = '0';
			}
		}, {
			key: 'update',
			value: function update() {}
		}, {
			key: 'render',
			value: function render() {}
		}, {
			key: 'onResize',
			value: function onResize(w, h) {}
		}]);

		return ViewOverlay;
	}();

	exports.default = ViewOverlay;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ViewOverlay2 = __webpack_require__(26);

	var _ViewOverlay3 = _interopRequireDefault(_ViewOverlay2);

	var _ViewProjectItem = __webpack_require__(28);

	var _ViewProjectItem2 = _interopRequireDefault(_ViewProjectItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ViewProjects = function (_ViewOverlay) {
		_inherits(ViewProjects, _ViewOverlay);

		function ViewProjects(el, onHideCallback, callbackScope, projectsData, hasDetail) {
			_classCallCheck(this, ViewProjects);

			// this.projectsContainerCol0 = this._el.querySelector('.projectsContainer');
			var _this = _possibleConstructorReturn(this, (ViewProjects.__proto__ || Object.getPrototypeOf(ViewProjects)).call(this, el, onHideCallback, callbackScope, hasDetail));

			_this.col0El = _this._el.querySelector('.col-0');
			_this.col1El = _this._el.querySelector('.col-1');

			_this.ITEMS_PER_ROW = 3;
			_this.ITEMS_PER_ROW_MOBILE = 1;
			_this.MOBILE_BREAK = 768;
			_this.MARGIN = 10;

			_this.items = [];
			// const projectsLength = Object.keys(projectsData).length;
			var idx = 0;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = projectsData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var projectData = _step.value;

					var item = new _ViewProjectItem2.default(_this.col0El, _this.col1El, idx, projectData, _this.onDetailOpen, _this.onDetailClose, _this);
					_this.items.push(item);
					idx++;
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			_this.detailOpen = false;
			return _this;
		}

		_createClass(ViewProjects, [{
			key: 'onDetailOpen',
			value: function onDetailOpen() {

				var delay = 0;
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this.items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var item = _step2.value;

						item.hide(delay += 100);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				this.detailOpen = true;
				// this.closeBtn.style.display = 'none';
			}
		}, {
			key: 'onDetailClose',
			value: function onDetailClose() {

				var delay = (this.items.length - 1) * 100;
				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = this.items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var item = _step3.value;

						item.show(delay -= 100);
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				this.detailOpen = false;
				// this.closeBtn.style.display = 'block';
			}
		}, {
			key: 'onResize',
			value: function onResize(w, h) {

				// var isMobile = w < this.MOBILE_BREAK ? true : false;
				// var wMult = isMobile ? .9 : .8;
				// var containerW = w * wMult;
				// this.projectsContainer.style.width = containerW + 'px';

				// var itemsPerRow = isMobile ? this.ITEMS_PER_ROW_MOBILE : this.ITEMS_PER_ROW;

				// var itemW = Math.floor(containerW / itemsPerRow);

				// var currentX = 0;
				// var currentY = 0;
				// var idx = 1;

				// var itemH = itemW;


				// for (var item of this.items){
				// 	item.onResize(currentX, currentY, itemW, itemH, w);
				// 	if (idx % itemsPerRow == 0){
				// 		if (idx > 0){
				// 			currentY += itemH + this.MARGIN;
				// 		}
				// 		currentX = 0;
				// 	}else{
				// 		currentX += itemW + this.MARGIN;
				// 	}

				// 	idx++;
				// }

			}
		}]);

		return ViewProjects;
	}(_ViewOverlay3.default);

	exports.default = ViewProjects;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ViewProjectDetail = __webpack_require__(29);

	var _ViewProjectDetail2 = _interopRequireDefault(_ViewProjectDetail);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ViewProjectItem = function () {
		function ViewProjectItem(col0, col1, idx, data, openDetailCallback, closeDetailCallback, callbackScope) {
			var _this = this;

			_classCallCheck(this, ViewProjectItem);

			this.isMobile = false;

			this.openDetailCallback = openDetailCallback;
			this.closeDetailCallback = closeDetailCallback;
			this.callbackScope = callbackScope;

			var el = document.createElement('div');
			el.classList.add('project-item');

			var loader = document.createElement('img');
			loader.classList.add('projectItemLoader');
			loader.src = '../assets/triangle.svg';
			// el.appendChild(loader);
			this.loader = loader;

			var captionLayer = document.createElement('div');
			captionLayer.classList.add('itemCaption');

			var captionCopy = document.createElement('h5');
			captionCopy.innerHTML = data.title;

			captionLayer.appendChild(captionCopy);

			var openBtn = document.createElement('h5');
			openBtn.classList.add('projectOpenBtn');
			openBtn.innerHTML = 'VIEW';

			// captionLayer.appendChild(openBtn);

			var touchLayer = document.createElement('div');
			touchLayer.classList.add('touchLayer');

			// el.appendChild(touchLayer);
			// el.appendChild(captionLayer);

			// parentEl.appendChild(el);

			idx % 2 == 0 ? col0.appendChild(el) : col1.appendChild(el);
			this._el = el;

			var img = new Image();
			img.onload = function () {
				_this._el.appendChild(img);
			};
			img.src = '../assets/projects/' + data.frontAsset + '.jpg';

			this.touchLayer = touchLayer;
			this.captionLayer = captionLayer;

			this.captionVisible = false;

			var projectDetailEl = document.createElement('div');
			projectDetailEl.className = 'projectDetailWrapper';

			// parentEl.appendChild(projectDetailEl);
			idx % 2 == 0 ? col0.appendChild(el) : col1.appendChild(el);

			this._projectDetail = new _ViewProjectDetail2.default(projectDetailEl, data.detail, this.onDetailClose, this.onDetailLoaded, this);

			touchLayer.addEventListener('click', function () {
				if (!_this._projectDetail.isSliderLoaded()) return;
				_this.openDetailCallback.call(_this.callbackScope);

				_this._projectDetail.show();
			});
		}

		_createClass(ViewProjectItem, [{
			key: 'onDetailLoaded',
			value: function onDetailLoaded() {

				this.loader.style.display = 'none';
			}
		}, {
			key: 'onDetailClose',
			value: function onDetailClose() {

				this.closeDetailCallback.call(this.callbackScope);
			}
		}, {
			key: 'activateDesktop',
			value: function activateDesktop() {
				var _this2 = this;

				this.touchLayer.addEventListener('mouseover', function () {
					_this2.captionLayer.style.opacity = 1;
				});

				this.touchLayer.addEventListener('mouseout', function () {
					_this2.captionLayer.style.opacity = 0;
				});

				this.touchLayer.removeEventListener('click', function () {});
			}
		}, {
			key: 'activateMobile',
			value: function activateMobile() {
				var _this3 = this;

				this.touchLayer.removeEventListener('mouseover', function () {});
				this.touchLayer.removeEventListener('mouseout', function () {});

				this.touchLayer.addEventListener('click', function (e) {
					if (_this3.captionVisible) {
						_this3.captionVisible = false;
						_this3.captionLayer.style.opacity = 0;
					} else {
						_this3.captionVisible = true;
						_this3.captionLayer.style.opacity = 1;
					}
				});
			}
		}, {
			key: 'show',
			value: function show(delay) {
				var _this4 = this;

				this._el.style.display = 'block';

				setTimeout(function () {
					_this4._el.style.opacity = 1;
					_this4._el.style[window.NS.transform] = 'scale(1)';
				}, delay + 200);
			}
		}, {
			key: 'hide',
			value: function hide(delay) {
				var _this5 = this;

				setTimeout(function () {
					_this5._el.style.opacity = 0;
					_this5._el.style[window.NS.transform] = 'scale(.92)';
				}, delay);

				setTimeout(function () {
					_this5._el.style.display = 'none';
				}, delay + 500);
			}
		}, {
			key: 'onResize',
			value: function onResize(x, y, w, h, winW) {

				var isMobile = winW < 768 ? true : false;
				if (isMobile && !this.isMobile) this.activateMobile();else {
					this.activateDesktop();
				}

				this.isMobile = isMobile;

				// this._el.style.left = x + 'px';
				// this._el.style.top = y + 'px';
				// this._el.style.width = w + 'px';
				// this._el.style.height = h + 'px';

				this._projectDetail.onResize(winW);
			}
		}]);

		return ViewProjectItem;
	}();

	exports.default = ViewProjectItem;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ViewSlider = __webpack_require__(30);

	var _ViewSlider2 = _interopRequireDefault(_ViewSlider);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ViewProjectDetail = function () {
		function ViewProjectDetail(el, data, closeCallback, loadedCallback, callbackScope) {
			_classCallCheck(this, ViewProjectDetail);

			this._el = el;

			this.closeCallback = closeCallback;
			this.callbackScope = callbackScope;
			this.loadedCallback = loadedCallback;

			this._descrEl = document.createElement('p');
			this._descrEl.className = 'projectDescr';
			this._descrEl.innerHTML = data.descr;

			this._el.appendChild(this._descrEl);

			// var projectDetailCloseBtn = document.createElement('img');
			// projectDetailCloseBtn.className = 'projectDetailCloseBtn';
			// projectDetailCloseBtn.src = 'assets/icons/cancel.svg';

			// projectDetailCloseBtn.addEventListener('click', (e) => {

			// 	this.hide();
			// });

			// this._el.appendChild(projectDetailCloseBtn);

			var sliderWrapper = document.createElement('div');
			sliderWrapper.className = 'projectSlider';
			this._el.appendChild(sliderWrapper);
			this._slider = new _ViewSlider2.default(sliderWrapper, data, this.sliderLoaded, this);
		}

		_createClass(ViewProjectDetail, [{
			key: 'sliderLoaded',
			value: function sliderLoaded() {

				this.loadedCallback.call(this.callbackScope);
			}
		}, {
			key: 'isSliderLoaded',
			value: function isSliderLoaded() {

				return this._slider.isLoaded;
			}
		}, {
			key: 'show',
			value: function show() {
				var _this = this;

				this._el.style.display = 'block';

				setTimeout(function () {
					_this._el.style.opacity = 1;
					window.scrollTo(0, 0);
				}, 800);

				// this._slider.currentIdx = 1;
				if (this._slider.currentIdx > -1) this._slider.hide(this._slider.currentIdx);

				this._slider.show(0);
			}
		}, {
			key: 'hide',
			value: function hide() {
				var _this2 = this;

				setTimeout(function () {
					_this2._el.style.display = 'none';
				}, 500);

				this._el.style.opacity = 0;

				this.closeCallback.call(this.callbackScope);
			}
		}, {
			key: 'onResize',
			value: function onResize(w) {
				this._slider.onResize(w);
			}
		}]);

		return ViewProjectDetail;
	}();

	exports.default = ViewProjectDetail;

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ViewSlider = function () {
		function ViewSlider(el, data, loadedCallback, callbackScope) {
			var _this = this;

			_classCallCheck(this, ViewSlider);

			this._el = el;

			this.loadedCallback = loadedCallback;
			this.callbackScope = callbackScope;

			this._containerEl = document.createElement('div');
			this._containerEl.className = 'sliderContainer';

			this._el.appendChild(this._containerEl);

			// this._innerEl = document.createElement('div');
			// this._innerEl.className = 'sliderInner';
			// this._containerEl.appendChild(this._innerEl);

			var arrowNext = document.createElement('img');
			arrowNext.className = 'sliderNext sliderNav';
			arrowNext.src = 'assets/icons/next.svg';
			arrowNext.addEventListener('click', function () {

				var hideIdx = _this.currentIdx;
				var nextIdx = _this.currentIdx;
				if (nextIdx >= _this._items.length - 1) {
					nextIdx = 0;
				} else nextIdx++;

				setTimeout(function () {
					_this.show(nextIdx);
				}, 600);

				setTimeout(function () {
					_this.hide(hideIdx, nextIdx);
				}, 0);
			});

			var arrowPrev = document.createElement('img');
			arrowPrev.className = 'sliderPrev sliderNav';
			arrowPrev.src = 'assets/icons/back.svg';
			arrowPrev.addEventListener('click', function () {
				var hideIdx = _this.currentIdx;
				var nextIdx = _this.currentIdx;
				if (nextIdx == 0) {
					nextIdx = _this._items.length - 1;
				} else nextIdx--;

				setTimeout(function () {
					_this.show(nextIdx);
				}, 600);

				setTimeout(function () {
					_this.hide(hideIdx, nextIdx);
				}, 0);
			});

			this._el.appendChild(arrowNext);
			this._el.appendChild(arrowPrev);

			this._assets = data.assets.slice();

			this.isLoaded = false;

			this._items = [];
			this.loadedCounter = 0;
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this._assets[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var asset = _step.value;

					var item = document.createElement('div');
					item.className = 'sliderItem';

					var img = new Image();
					img.onload = function () {
						_this.loadedCounter++;
						if (_this.loadedCounter == _this._assets.length - 1) {
							_this.loadedCallback.call(_this.callbackScope);
							_this.isLoaded = true;
							_this.onResize(window.innerWidth);
						}
					};
					img.src = 'assets/projects/' + data.assetsFolder + '/' + asset;
					item.appendChild(img);

					this._containerEl.appendChild(item);

					this._items.push({ item: item, 'img': img });
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			this.currentIdx = -1;

			// this.onResize(window.innerWidth);		
		}

		_createClass(ViewSlider, [{
			key: 'show',
			value: function show(idx) {

				// var translateX = this.currentWidth;
				// var leftX = -this.currentWidth;
				// if (idx > this.currentIdx){
				// 	translateX = -this.currentWidth;
				// 	leftX = this.currentWidth;
				// }
				// console.log('show: ',idx,' leftX: ',leftX, ' transX: ',translateX);
				// this._items[idx].item.style.left = leftX + 'px';
				// this._items[idx].item.style.transform = 'translate('+translateX+'px, 0px)';

				// this._el.style.height = this._items[idx].img.height * this._items[idx].ratio + 'px';

				this._items[idx].item.style[window.NS.transform] = 'scale(1)';
				this._items[idx].item.style.opacity = 1;
				this.currentIdx = idx;
			}
		}, {
			key: 'hide',
			value: function hide(idx, nextIdx) {

				// console.log('hide: ',idx, 'curridx: ',this.currentIdx);
				// var translateX = 0;
				// // var leftX = 0;
				// if (nextIdx > idx){
				// 	// leftX = 0;
				// 	translateX = -this.currentWidth * 2;
				// }
				// // this._items[idx].item.style.left = 0 + 'px';
				// this._items[idx].item.style.transform = 'translate('+translateX+'px, 0px)';

				this._items[idx].item.style[window.NS.transform] = 'scale(0.4)';
				this._items[idx].item.style.opacity = 0;
			}
		}, {
			key: 'onResize',
			value: function onResize(w) {

				if (!this.isLoaded) return;

				var maxH = window.innerHeight - 20;
				var isMobile = w < 768 ? true : false;
				var wMult = isMobile ? .8 : .5;
				var outerW = w * wMult;

				this._el.style.width = outerW + 'px';

				this._containerEl.style.width = outerW + 'px';

				var sliderHeight = 0;

				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this._items[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var item = _step2.value;

						var ratio = outerW / item.img.width;
						item.ratio = ratio;
						var imgHeight = item.img.height * ratio;
						item.height = imgHeight;
						item.width = outerW;

						if (imgHeight > maxH) {
							ratio = maxH / item.img.height;
							item.ratio = ratio;
							item.height = maxH;
							item.width = item.img.width * ratio;
						}
						if (sliderHeight < item.height) sliderHeight = item.height;
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				var _iteratorNormalCompletion3 = true;
				var _didIteratorError3 = false;
				var _iteratorError3 = undefined;

				try {
					for (var _iterator3 = this._items[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
						var item = _step3.value;

						item.item.style.width = item.width + 'px';
						if (item.width < outerW) item.item.style.left = outerW / 2 - item.width / 2 + 'px';
						item.item.style[window.NS.transform] = 'scale(0.4)';
						item.item.style.opacity = 0;

						item.item.style.top = sliderHeight / 2 - item.height / 2 + 'px';
						// item.item.style.marginTop = (sliderHeight/2) - (item.img.height)/2 + 'px';
						// item.item.style.left = -outerW + 'px';

						// var ratio = outerW / item.img.width;
						// var imgHeight = item.img.height * ratio;
						// if (sliderHeight < imgHeight)
						// 	sliderHeight = imgHeight;
					}
				} catch (err) {
					_didIteratorError3 = true;
					_iteratorError3 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion3 && _iterator3.return) {
							_iterator3.return();
						}
					} finally {
						if (_didIteratorError3) {
							throw _iteratorError3;
						}
					}
				}

				this._el.style.height = sliderHeight + 'px';

				this.currentWidth = outerW;
			}
		}]);

		return ViewSlider;
	}();

	exports.default = ViewSlider;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _ViewOverlay2 = __webpack_require__(26);

	var _ViewOverlay3 = _interopRequireDefault(_ViewOverlay2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ViewContact = function (_ViewOverlay) {
		_inherits(ViewContact, _ViewOverlay);

		function ViewContact(el, onHideCallback, callbackScope) {
			_classCallCheck(this, ViewContact);

			return _possibleConstructorReturn(this, (ViewContact.__proto__ || Object.getPrototypeOf(ViewContact)).call(this, el, onHideCallback, callbackScope));
		}

		return ViewContact;
	}(_ViewOverlay3.default);

	exports.default = ViewContact;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _ViewNavItem = __webpack_require__(33);

	var _ViewNavItem2 = _interopRequireDefault(_ViewNavItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DELAY_TIME = 50;

	var ViewMobileMenu = function () {
		function ViewMobileMenu(el) {
			var _this = this;

			_classCallCheck(this, ViewMobileMenu);

			this._el = el;

			setTimeout(function () {
				_this._el.style.opacity = 1;
			}, 500);

			this.isActive = false;

			this._burgerEl = this._el.querySelector('.menuBurger');
			this._burgerEl.addEventListener('click', function (e) {
				_this.onBurgerClick(e);
			});

			this._navItems = [];
			var navItems = this._el.querySelectorAll('.nav-item');
			for (var i = 0; i < navItems.length; i++) {
				var navItem = new _ViewNavItem2.default(navItems[i]);
				this._navItems.push(navItem);

				navItems[i].addEventListener('click', function (e) {
					_this.onItemClick();
				});
			}

			this.isOpen = false;
		}

		_createClass(ViewMobileMenu, [{
			key: 'onItemClick',
			value: function onItemClick() {

				if (!this.isActive) return;

				this.hideMenu();
			}
		}, {
			key: 'onBurgerClick',
			value: function onBurgerClick(e) {

				if (!this.isActive) return;

				e.preventDefault();

				this.isOpen ? this.hideMenu() : this.showMenu();
			}
		}, {
			key: 'showMenu',
			value: function showMenu() {

				var delay = 0;
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = this._navItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var item = _step.value;

						item.show(delay);

						delay += DELAY_TIME;
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				this.isOpen = true;
			}
		}, {
			key: 'hideMenu',
			value: function hideMenu() {

				var delay = (this._navItems.length - 1) * DELAY_TIME;
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = this._navItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var item = _step2.value;

						item.hide(delay);

						delay -= DELAY_TIME;
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}

				this.isOpen = false;
			}
		}, {
			key: 'onResize',
			value: function onResize(w, h) {

				this.isActive = w < 768 ? true : false;
			}
		}]);

		return ViewMobileMenu;
	}();

	exports.default = ViewMobileMenu;

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ViewNavItem = function () {
		function ViewNavItem(el) {
			_classCallCheck(this, ViewNavItem);

			this._el = el;

			this.timer = null;
		}

		_createClass(ViewNavItem, [{
			key: 'show',
			value: function show(delay) {
				var _this = this;

				clearTimeout(this.timer);
				this.timer = setTimeout(function () {
					_this._el.style[window.NS.transform] = 'translate(0,0)';
				}, delay);
			}
		}, {
			key: 'hide',
			value: function hide(delay) {
				var _this2 = this;

				clearTimeout(this.timer);
				this.timer = setTimeout(function () {
					_this2._el.style[window.NS.transform] = 'translate(-200px,0)';
				}, delay);
			}
		}]);

		return ViewNavItem;
	}();

	exports.default = ViewNavItem;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _ViewPostitItem = __webpack_require__(35);

	var _ViewPostitItem2 = _interopRequireDefault(_ViewPostitItem);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ViewPostitGrid = function ViewPostitGrid(el, projects) {
		_classCallCheck(this, ViewPostitGrid);

		this._el = el;

		this._items = {};

		for (var i = 0; i < projects.length; i++) {
			var item = new _ViewPostitItem2.default(projects[i], this._el);
			this._items[projects[i].title] = item;
		}
		// this.data = projects.find((e) => e.featured);

		// const img = new Image();
		// const src = '../assets/projects/' + this.data.frontAsset + '.jpg';
		// img.onload = () => {
		// 	this._el.appendChild(img);
		// 	this._el.style.backgroundImage = `url(${src})`;
		// }
		// img.src = src;
	};

	exports.default = ViewPostitGrid;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ViewPostitItem = function ViewPostitItem(project, parentEl) {
		_classCallCheck(this, ViewPostitItem);

		this._parentEl = parentEl;

		this._el = document.createElement('div');
		this._el.className = "postit-item";

		this._parentEl.appendChild(this._el);

		// this._el = el;


		// this.data = projects.find((e) => e.featured);

		// const img = new Image();
		// const src = '../assets/projects/' + this.data.frontAsset + '.jpg';
		// img.onload = () => {
		// 	this._el.appendChild(img);
		// 	this._el.style.backgroundImage = `url(${src})`;
		// }
		// img.src = src;
	};

	exports.default = ViewPostitItem;

/***/ }),
/* 36 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Data = function Data() {
		_classCallCheck(this, Data);

		this.projects = [{
			title: "Unfold",
			frontAsset: {
				'title': "project_dripping",
				'width': 200,
				'height': 200
			},
			detail: {
				'descr': "",
				'assetsFolder': 'dripping',
				'assets': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg']
			},
			featured: false,
			type: 'art'
		}, {
			title: "Indigo",
			frontAsset: {
				'title': "project_indigo",
				'width': 200,
				'height': 200
			},
			detail: {
				'descr': "",
				'assetsFolder': 'indigo',
				'assets': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg']
			},
			featured: true,
			type: 'art'
		}, {
			title: "Yarn Life",
			frontAsset: {
				'title': "project_yarn",
				'width': 200,
				'height': 200
			},
			detail: {
				'descr': "",
				'assetsFolder': 'yarn',
				'assets': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg']
			},
			featured: false,
			type: 'art'
		}, {
			title: "Recycle",
			frontAsset: {
				'title': "project_recycle",
				'width': 200,
				'height': 200
			},
			detail: {
				'descr': "",
				'assetsFolder': 'recycle',
				'assets': ['1.jpg', '2.jpg', '3.jpg', '4.jpg']
			},
			featured: false,
			type: 'art'
		}, {
			title: "The process",
			frontAsset: {
				'title': "project_process",
				'width': 200,
				'height': 200
			},
			detail: {
				'descr': "",
				'assetsFolder': 'the_process',
				'assets': ['1.jpg', '2.jpg', '3.jpg', '4.jpg']
			},
			featured: false,
			type: 'commercial'
		}, {
			title: "Wrapped",
			frontAsset: {
				'title': "project_wrapped",
				'width': 200,
				'height': 200
			},
			detail: {
				'descr': "",
				'assetsFolder': 'wrapped',
				'assets': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg']
			},
			featured: false,
			type: 'commercial'
		}];
	};

	exports.default = Data;

/***/ })
/******/ ]);