'use strict';

import './main.scss';

import SignIn from './js/views/SignIn';
import UserWindow from './js/UserWindow';

class Index {
	constructor() {

		this.signIn = new SignIn();
		this.userWindow = new UserWindow(document.body);

		const title = document.createElement('h2');
		title.innerHTML = 'PIECE OF CAKE';
		title.classList.add('main-title');

		document.body.appendChild(title);

		this.starter = null;

		const initStart = (username) => {
			if (!this.starter) {
				import(/* webpackChunkName: "Starter" */'./js/Starter')
				.then(Starter => {
					this.starter = new Starter.default(username);
				});
			}
		};

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.signIn.hide();

				const { email } = user;
				console.log('email:', email, ' user: ', user.uid);
				// checkUserExists(email);
				this.userWindow.update(email);
				this.userWindow.show();
				if (this.starter) {
					this.starter.onLogin();
				}

				if (!this.starter) {
					initStart(email);
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






