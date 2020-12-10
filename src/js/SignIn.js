export default class SignIn{
	constructor() {
		const parentEl = document.body;

		this.mailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

		this.containerEl = document.createElement('div');
		this.containerEl.className = 'sign-in';

		this.errorMessage = document.createElement('h5');
		this.errorMessage.className = 'error-message';

		const usernameContainer = document.createElement('div');
		usernameContainer.className = 'input-container';

		usernameContainer.appendChild(this.errorMessage);

		const usernameLabel = document.createElement('h4');
		usernameLabel.innerHTML = 'Användarnamn';

		this.usernameInput = document.createElement('input');
		this.usernameInput.className = 'sign-in-input';
		this.usernameInput.type = 'text';
		// this.usernameInput.placeholder = 'Användarnamn';

		usernameContainer.appendChild(usernameLabel);
		usernameContainer.appendChild(this.usernameInput);

		this.containerEl.appendChild(usernameContainer);

		const passwordContainer = document.createElement('div');
		passwordContainer.className = 'input-container';

		const passwordLabel = document.createElement('h4');
		passwordLabel.innerHTML = 'Lösenord';

		this.passwordInput = document.createElement('input');
		this.passwordInput.className = 'sign-in-input';
		this.passwordInput.type = 'password';
		// this.passwordInput.placeholder = 'Lösenord';

		passwordContainer.appendChild(passwordLabel);
		passwordContainer.appendChild(this.passwordInput);

		this.containerEl.appendChild(passwordContainer);

		this.onSignInBound = this.onSignIn.bind(this);
		this.signInButton = document.createElement('h3');
		this.signInButton.className = 'sign-in-button';
		this.signInButton.innerHTML = 'Logga in';
		this.signInButton.addEventListener('click', this.onSignInBound);

		this.containerEl.appendChild(this.signInButton);

		parentEl.appendChild(this.containerEl);

		this.onKeyDownBound = this.onKeyDown.bind(this);
		// window.addEventListener('keydown', this.onKeyDownBound);
	}

	onKeyDown(e) {
		const code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) { //Enter keycode
		    this.onSignIn();
		}
	}

	onSignIn() {

		this.errorMessage.innerHTML = '';

		const usernameInputValue = this.usernameInput.value;
		const passwordInputValue = this.passwordInput.value;

		if (!this.mailRegex.test(usernameInputValue)) {
			this.errorMessage.innerHTML = 'Wrong username';
			return;
		}

		// if (!/(?=.*[0-9])/.test(passwordInputValue)) {
		// 	this.errorMessage.innerHTML = 'Wrong password';
		// 	return;
		// }

		firebase.auth().signInWithEmailAndPassword(usernameInputValue, passwordInputValue).catch((error) => {
			// // Handle Errors here.
			// var errorCode = error.code;
			// var errorMessage = error.message;
			this.errorMessage.innerHTML = error.message;
		});
	}

	show() {

		console.log('sign in show');
		this.containerEl.style.transform = 'translateY(0)';
		this.containerEl.style.opacity = 1;
		window.addEventListener('keydown', this.onKeyDownBound);
	}

	hide() {

		this.containerEl.style.transform = 'translateY(-400%)';
		this.containerEl.style.opacity = 0;

		this.usernameInput.value = '';
		this.passwordInput.value = '';
		window.removeEventListener('keydown', this.onKeyDownBound);
	}


}