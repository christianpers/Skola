export default class FollowNodeSetting{
    constructor(parentEl) {
        this.el = document.createElement('div');
        this.el.className = 'follow-node-setting settings-item';

        this.isFollowing = false;

        this.followingStateHTML = `<h4>Tillbaka</h4>`;
        this.notFollowingStateHTML = `<h4>Följ aktiv nod</h4>`;

        this.el.innerHTML = this.notFollowingStateHTML;

        this.onClickBound = this.onClick.bind(this);
        this.el.addEventListener('click', this.onClickBound);

        this.parentEl = parentEl;
        this.parentEl.appendChild(this.el);
    }

    checkActive() {
        const currentSelectedNode = window.NS.singletons.SelectionManager.currentSelectedNode;
        if (currentSelectedNode) {
            this.el.classList.add('active');
            if (this.isFollowing) {
                window.NS.singletons.CanvasNode.setForegroundCamera();
            }
        } else {
            this.el.classList.remove('active');
            this.isFollowing = false;
            window.NS.singletons.CanvasNode.resetForegroundCamera();
            this.el.innerHTML = this.notFollowingStateHTML;
        }
    }

    onClick() {
        if (!this.el.classList.contains('active')) {
            return;
        }

        this.isFollowing = !this.isFollowing;
        this.el.innerHTML = this.isFollowing ? this.followingStateHTML : this.notFollowingStateHTML;

        if (this.isFollowing) {
            window.NS.singletons.CanvasNode.setForegroundCamera();
        } else {
            window.NS.singletons.CanvasNode.resetForegroundCamera();
        }
    }

    setIsFollowingState(isFollowing) {
        this.isFollowing = isFollowing;

        this.el.innerHTML = this.isFollowing ? this.followingStateHTML : this.notFollowingStateHTML;
    }
}