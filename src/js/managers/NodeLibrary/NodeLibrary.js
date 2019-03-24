import NodePlaceHelper from './NodePlaceHelper';

export default class NodeLibrary{
	constructor(parentEl, nodeTypes, onNodeAddedCallback, workspaceManager) {

		this.parentEl = parentEl;

		this.onNodeAddedCallback = onNodeAddedCallback;
		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);

		this.workspaceManager = workspaceManager;

		this.nodeToPlaceData = {
			type: undefined,
			data: undefined,
		};

		this.el = document.createElement('div');
		this.el.className = 'node-library';

		const innerScroll = document.createElement('div');
		innerScroll.className = 'inner-scroll';

		this.el.appendChild(innerScroll);

		this.parentEl.appendChild(this.el);

		for (const key in nodeTypes) {
			const level0 = document.createElement('div');
			level0.className = 'level-0';

			let title = document.createElement('h4');
			title.className = 'level-title';
			title.innerHTML = key;

			level0.appendChild(title);

			for (const keySub in nodeTypes[key]) {
				const level1 = document.createElement('div');
				level1.className = 'level-1';

				title = document.createElement('h4');
				title.className = 'level-title';
				title.innerHTML = keySub;

				level1.appendChild(title);

				level0.appendChild(level1);

				const nodeContainer = document.createElement('div');
				nodeContainer.className = 'node-container';

				level1.appendChild(nodeContainer);

				for (let i = 0; i < nodeTypes[key][keySub].length; i++) {
					const nodeWrapper = document.createElement('div');
					nodeWrapper.className = 'library-node audio';
					nodeWrapper.setAttribute('data-type-0', key);
					nodeWrapper.setAttribute('data-type-1', keySub);

					const type = document.createElement('h4');
					type.className = 'node-type';
					type.innerHTML = nodeTypes[key][keySub][i].type;

					const addBtn = document.createElement('img');
					addBtn.className = 'node-add';
					addBtn.src = 'assets/add.svg';
					
					nodeWrapper.appendChild(type);

					nodeWrapper.appendChild(addBtn);

					nodeContainer.appendChild(nodeWrapper);

					nodeWrapper.addEventListener('mousedown', (e) => {
						this.nodeToPlaceData.type = key;
						this.nodeToPlaceData.data = nodeTypes[key][keySub][i];
						this.onMouseDown(e);
					});
				}
			}

			innerScroll.appendChild(level0);
		}
	}

	hide() {
		this.el.style.transform = 'translateX(100%)';
	}

	show() {
		this.el.style.transform = 'translateX(0)';
	}

	onMouseDown(e) {

		this.el.style.opacity = .1;
		this.nodePlaceHelper = new NodePlaceHelper(this.workspaceManager, {x: e.clientX, y: e.clientY});
		this.nodePlaceHelper.onMouseDown(e);

		window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);
	}

	onMouseMove(e) {

		this.nodePlaceHelper.onMouseMove(e);
	}

	onMouseUp() {

		this.nodePlaceHelper.onMouseUp();

		this.el.style.opacity = 1;

		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);

		const nodePos = this.nodePlaceHelper.getPos();

		if (Math.abs(this.nodePlaceHelper.deltaX) > 4) {
			this.onNodeAddedCallback(this.nodeToPlaceData.type, this.nodeToPlaceData.data, nodePos);
		}

		this.nodeToPlaceData = {
			type: undefined,
			data: undefined,
		};
	}
}