export default class ControlUI{
	constructor(parent, sandbox, editor){

		this.parent = parent;

		this.sandbox = sandbox;
		this.editor = editor;

		this.refreshIsDisabled = false;


		const outerWrapper = document.createElement('div');
		outerWrapper.className = 'control-ui';

		const innerWrapper = document.createElement('div');
		innerWrapper.className = 'control-ui-inner';

		const playBtn = document.createElement('div');
		playBtn.className = 'control-play-btn control-btn';

		const playImg = document.createElement('img');
		playImg.src = './assets/play-button.svg';

		playBtn.appendChild(playImg);



		const pauseBtn = document.createElement('div');
		pauseBtn.className = 'control-pause-btn control-btn';

		const pauseImg = document.createElement('img');
		pauseImg.src = './assets/pause-button.svg';

		pauseBtn.appendChild(pauseImg);

		const refreshBtn = document.createElement('div');
		refreshBtn.className = 'control-refresh-btn control-btn';

		const refreshImg = document.createElement('img');
		refreshImg.src = './assets/refresh-button.svg';

		const disabledOverlay = document.createElement('div');
		disabledOverlay.className = 'control-disabled';

		refreshBtn.appendChild(refreshImg);

		refreshBtn.appendChild(disabledOverlay);

		this.refreshBtn = refreshBtn;

		playBtn.addEventListener('click', this.onPlayClick.bind(this));
		pauseBtn.addEventListener('click', this.onPauseClick.bind(this));
		refreshBtn.addEventListener('click', this.onRefreshClick.bind(this));

		innerWrapper.appendChild(playBtn);
		innerWrapper.appendChild(pauseBtn);
		innerWrapper.appendChild(refreshBtn);
		outerWrapper.appendChild(innerWrapper);

		this.parent.appendChild(outerWrapper); 
	}

	disableRefresh() {

		this.refreshIsDisabled = true;
		this.refreshBtn.classList.add('disabled');
	}

	enableRefresh() {
		this.refreshIsDisabled = false;
		this.refreshBtn.classList.remove('disabled');
	}

	onPlayClick() {
		this.sandbox.play();
	}

	onPauseClick() {
		this.sandbox.pause();

	}

	onRefreshClick() {

		if (this.refreshIsDisabled) {
			return;
		}
		
		this.sandbox.canvas.load(this.editor.editorInstance.getValue());
	}
}