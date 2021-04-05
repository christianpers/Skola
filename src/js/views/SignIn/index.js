import './index.scss';

const mailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;


const isValidUsername = (input) => {
    return mailRegex.test(input);
};

const isValidPassword = (input) => {
    return input.length >= 6;
};

export default class SignIn{
	constructor() {
		const parentEl = document.body;

        this._inputState = new Map();
        this._inputState.set('username', { text: '', valid: false });
        this._inputState.set('password', { text: '', valid: false });

        this._notValidResetTimer;
        this._errorMessageResetTimer;
        this._noticeMessageResetTimer;

		this._el = document.createElement('div');
        this._el.classList.add('outer-sign-in');

		parentEl.appendChild(this._el);

		const template = `
			<div class="sign-in">
				<div class="sign-in-inner">
					<div class="input-container username">
						<h4>E-mail (Måste va en giltig email adress)</h4>
						<input type="text" placeholder="Din e-mail" class="sign-in-input"></input>
					</div>
					<div class="input-container password">
						<h4>Lösenord (minst 6 tecken)</h4>
						<input type="password" placeholder="Lösenord" class="sign-in-input"></input>
					</div>
					<button type="button" class="sign-in-btn btn" disabled>
						<h5>Logga in</h5>
					</button>
					<p class="forgot-password">Har du glömt lösenordet ?</p>
                    <div class="error-wrapper">
                        <h5>Följande fel uppstod:</h5>
                        <p></p>
                    </div>
                    <div class="notice-wrapper error-wrapper">
                        <h5></h5>
                    </div>
				</div>
				<button type="button" class="create-user-wrapper btn">
					<h5>Har du inget konto? <span>Skapa konto</span></h5>
				</button>
                
			</div>
		`;

		
		this._el.insertAdjacentHTML('afterbegin', template);

		this._containerEl = this._el.querySelector('.sign-in');

        this._onUsernameInputChange = this._onUsernameInputChange.bind(this);
        this._onPasswordChange = this._onPasswordChange.bind(this);

        this._onSignIn = this._onSignIn.bind(this);
        this._onCreateUser = this._onCreateUser.bind(this);
        this._onPasswordReset = this._onPasswordReset.bind(this);

		this._usernameInput = this._containerEl.querySelector('.input-container.username');
        this._usernameInput.addEventListener('input', this._onUsernameInputChange);

		this._passwordInput = this._containerEl.querySelector('.input-container.password');
        this._passwordInput.addEventListener('input', this._onPasswordChange);

        this._signInBtn = this._containerEl.querySelector('.sign-in-btn');
        this._signInBtn.addEventListener('click', this._onSignIn);

        this._forgotPasswordBtn = this._containerEl.querySelector('.forgot-password');
        this._forgotPasswordBtn.addEventListener('click', this._onPasswordReset);

        this._createUserBtn = this._containerEl.querySelector('.create-user-wrapper');
        this._createUserBtn.addEventListener('click', this._onCreateUser);

        this._signInInnerEl = this._containerEl.querySelector('.sign-in-inner');

        this._errorWrapper = this._containerEl.querySelector('.error-wrapper');
        this._errorMessage = this._errorWrapper.querySelector('p');

        this._noticeWrapper = this._containerEl.querySelector('.notice-wrapper');
        this._noticeMessage = this._noticeWrapper.querySelector('h5');

		this.onKeyDownBound = this.onKeyDown.bind(this);

		window.addEventListener('keydown', this.onKeyDownBound);
	}

    _onUsernameInputChange(e) {
        const val = e.target.value;
        const isValid = isValidUsername(val);
        const state = this._inputState.get('username');
        const newState = Object.assign({}, state, { text: isValid ? val : state.text, valid: isValid });
        this._inputState.set('username', newState);

        if (!isValid) {
            this._usernameInput.classList.add('not-valid');
        } else {
            this._usernameInput.classList.remove('not-valid');
        }

        this.checkValid();
    }

    _onPasswordChange(e) {
        const val = e.target.value;
        const isValid = isValidPassword(val);
        const state = this._inputState.get('password');
        const newState = Object.assign({}, state, { text: isValid ? val : state.text, valid: isValid });
        this._inputState.set('password', newState);

        if (!isValid) {
            this._passwordInput.classList.add('not-valid');
        } else {
            this._passwordInput.classList.remove('not-valid');
        }

        this.checkValid();
    }

    checkValid() {
        const usernameState = this._inputState.get('username');
        const passwordState = this._inputState.get('password');

        if (usernameState.valid && passwordState.valid) {
            this._signInBtn.disabled = false;
            return true;
        }

        this._signInBtn.disabled = true;
        return false;
    }

	onKeyDown(e) {
		const code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
            if (this.checkValid()) {
                this._onSignIn();
            }
		}
	}

    setNoticeMessage(message) {
        clearTimeout(this._noticeMessageResetTimer);
        this._noticeMessage.innerHTML = message;
        this._noticeWrapper.classList.add('visible');

        this._noticeMessageResetTimer = setTimeout(() => {
            this._noticeWrapper.classList.remove('visible');
            setTimeout(() => {
                this._noticeMessage.innerHTML = '';
            }, 400);
        }, 5000);
    }

    setErrorMessage(message) {
        clearTimeout(this._errorMessageResetTimer);
        this._errorMessage.innerHTML = message;
        this._errorWrapper.classList.add('visible');

        this._errorMessageResetTimer = setTimeout(() => {
            this._errorWrapper.classList.remove('visible');
            setTimeout(() => {
                this._errorMessage.innerHTML = '';
            }, 400);
        }, 5000);
    }

	_onSignIn() {
        const usernameState = this._inputState.get('username');
        const passwordState = this._inputState.get('password');

        const username = usernameState.text;
        const password = passwordState.text;

		firebase.auth().signInWithEmailAndPassword(username, password).catch((error) => {
			// // Handle Errors here.
            this.setErrorMessage(error.message);
		});
	}

	_onCreateUser() {
        clearTimeout(this._errorMessageResetTimer);
		const usernameState = this._inputState.get('username');
        const passwordState = this._inputState.get('password');

        let isValid = true;

        if (!usernameState.valid) {
            this._usernameInput.classList.add('not-valid');
            isValid = false;
        }

        if (!passwordState.valid) {
            this._passwordInput.classList.add('not-valid');
            isValid = false;
        }

        this._notValidResetTimer = setTimeout(() => {
            this._usernameInput.classList.remove('not-valid');
            this._passwordInput.classList.remove('not-valid');
        }, 1500);

        if (!isValid) {
            return;
        }

        const username = usernameState.text;
        const password = passwordState.text;

		firebase.auth().createUserWithEmailAndPassword(username, password).catch((error) => {
            this.setErrorMessage(error.message);
        });
	}

	_onPasswordReset() {
		const usernameState = this._inputState.get('username');

        let isValid = true;

        if (!usernameState.valid) {
            this._usernameInput.classList.add('not-valid');
            isValid = false;
        }

        this._notValidResetTimer = setTimeout(() => {
            this._usernameInput.classList.remove('not-valid');
        }, 1500);

        if (!isValid) {
            return;
        }

        const username = usernameState.text;

		firebase.auth().sendPasswordResetEmail(username).then(() => {
			// Email sent.
            this.setNoticeMessage('Du har nu fått ett mail om hur du återställer ditt lösenord.');
		}).catch((error) => {
            this.setErrorMessage(error.message);
			// An error happened.
		});
	}

	show() {
        this._el.classList.remove('hidden');
		this._containerEl.style.transform = 'translateY(0)';
		this._containerEl.style.opacity = 1;
		window.addEventListener('keydown', this.onKeyDownBound);
	}

	hide() {
		this._containerEl.style.transform = 'translateY(-400%)';
		this._containerEl.style.opacity = 0;

		this._usernameInput.value = '';
		this._passwordInput.value = '';
		window.removeEventListener('keydown', this.onKeyDownBound);

        this._el.classList.add('hidden');
	}


}