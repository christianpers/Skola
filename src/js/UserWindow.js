export default class UserWindow{
	constructor(parentEl, userName) {

		this.logoutScreenVisible = false;

		this.onUsernameClickBound = this.onUsernameClick.bind(this);

		this.el = document.createElement('div');
		this.el.className = 'user-window';

		this.el.addEventListener('click', this.onUsernameClickBound);
		
		



		this.logoutScreenEl = document.createElement('div');
		this.logoutScreenEl.className = 'logout-modal';

		this.onLogoutBound = this.onLogout.bind(this);

		this.logoutBtn = document.createElement('h5');
		this.logoutBtn.className = 'logout-btn';
		this.logoutBtn.innerHTML = 'Logga ut';

		this.logoutBtn.addEventListener('click', this.onLogoutBound);

		this.logoutScreenEl.appendChild(this.logoutBtn);

		this.el.appendChild(this.logoutScreenEl);

		this.usernameContainer = document.createElement('div');
		this.usernameContainer.classList = 'username-container';

		this.userNameEl = document.createElement('h5');

		this.usernameContainer.appendChild(this.userNameEl);

		this.el.appendChild(this.usernameContainer);
		

		parentEl.appendChild(this.el);

		



	}

	update(username) {
		// const getHTML = () => {
		// 	return `
		// 		<div class="user-content">
		// 			<div class="user-data">
		// 				<h5>Inloggad som:</h5>
		// 				<h4>${userName}</h4>
		// 			</div>
		// 			<h5 class="logout-btn">Logga ut</h5>
		// 		</div>
		// 	`;
		// }

		// this.el.insertAdjacentHTML('beforeend', getHTML());
		this.userNameEl.innerHTML = username;
	}

	onUsernameClick() {
		if (this.logoutScreenVisible) {
			this.logoutScreenEl.classList.remove('show');
			this.logoutScreenVisible = false;
		} else {
			this.logoutScreenEl.classList.add('show');
			this.logoutScreenVisible = true;
		}
		
	}

	onLogout() {
		firebase.auth().signOut();
		this.logoutScreenEl.classList.remove('show');
	}

	show() {
		this.el.classList.add('show');
	}

	hide() {
		this.el.classList.remove('show');
	}
}