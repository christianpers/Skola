export default class NodeLibrary{
	constructor(parentEl, nodeTypes, onNodeAddedCallback) {

		this.parentEl = parentEl;

		this.onNodeAddedCallback = onNodeAddedCallback;

		this.el = document.createElement('div');
		this.el.className = 'node-library';

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

					// this.el.appendChild(nodeWrapper);

					nodeWrapper.addEventListener('mousedown', (e) => {
						this.onMouseDown(e, nodeTypes[key][keySub][i]);
					});
				}
			}

			this.el.appendChild(level0);
		}

		
	}

	onMouseDown(e, data) {

		this.onNodeAddedCallback(data);

	}


}