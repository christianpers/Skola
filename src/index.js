'use strict';

import './main.scss';

class Index {
	constructor() {
		
		// import(/* webpackChunkName: "Starter" */'./js/Starter')
		// 	.then(Starter => {
		// 		new Starter.default();

		// 		// console.log('Starter', Starter.init());
		// 	});
		
	}

	

};

if(document.body) new Index();
else {
	window.addEventListener("load", new Index());
}






