'use strict';

import './main.scss';

import SignIn from './js/SignIn';
import UserWindow from './js/UserWindow';

class Index {
	constructor() {

		this.signIn = new SignIn();
		this.userWindow = new UserWindow(document.body);

		this.starter = null;

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.signIn.hide();

				const { email } = user;
				this.userWindow.update(email);
				this.userWindow.show();
				if (this.starter) {
					this.starter.onLogin();
				}
				
				if (!this.starter) {
					import(/* webpackChunkName: "Starter" */'./js/Starter')
					.then(Starter => {
						this.starter = new Starter.default();
					});
				}
				
			} else {
				// User is signed out.

				this.signIn.show();
				this.userWindow.hide();
				if (this.starter) {
					this.starter.onLogout();
				}
				
			}
		});
		
	}
};

if(document.body) new Index();
else {
	window.addEventListener("load", new Index());
}






