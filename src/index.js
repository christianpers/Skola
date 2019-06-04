'use strict';

import './main.scss';

import SignIn from './js/SignIn';
import UserWindow from './js/UserWindow';

class Index {
	constructor() {

		const db = firebase.firestore();

		console.log(db);


		const getDrawings = (username) => {
			const drawingsRef = db.collection("Users").doc(username).collection("Drawings");
			drawingsRef.get().then(function(querySnapshot) {
				querySnapshot.forEach(function(doc) {
					// doc.data() is never undefined for query doc snapshots
					console.log(doc.id, " => ", doc.data());
				});
			});
		};

		const getDataTest = (username) => {
			const docRef = db.collection("Users").doc(username);
			var getOptions = {
				source: ''
			};
			docRef.get().then(function(doc) {
				if (doc.exists) {
					console.log("Document data:", doc.data());
					getDrawings(username);
				} else {
					// doc.data() will be undefined in this case
					console.log("No such document!");
				}
			}).catch(function(error) {
				console.log("Error getting document:", error);
			});
		}

		this.signIn = new SignIn();
		this.userWindow = new UserWindow(document.body);

		this.starter = null;

		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				this.signIn.hide();

				const { email } = user;
				getDataTest(email);
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






