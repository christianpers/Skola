import NodePlaceHelper from './NodePlaceHelper';

export default class NodeLibraryTab{
    constructor(parentEl, type, nodeTypes, setMouseDown, workspaceManager, onNodeAddedCallback) {
        this.parentEl = parentEl;
        this.type = type;

		this.setMouseDown = setMouseDown;
		this.workspaceManager = workspaceManager;
		this.onNodeAddedCallback = onNodeAddedCallback;

		this.nodeToPlaceData = {
			type: undefined,
			data: undefined,
		};

		this.onMouseMoveBound = this.onMouseMove.bind(this);
		this.onMouseUpBound = this.onMouseUp.bind(this);

        this.el = document.createElement('div');
        this.el.classList.add('library-tab');

        this.parentEl.appendChild(this.el);

        const outerScrollEl = document.createElement('div');
		outerScrollEl.className = 'outer-scroll';

		this.el.appendChild(outerScrollEl);

        const innerScroll = document.createElement('div');
		innerScroll.className = 'inner-scroll';

		outerScrollEl.appendChild(innerScroll);

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
					const isModifier = nodeTypes[key][keySub][i].isModifier;
					nodeWrapper.className = `library-node${isModifier ? ' modifier' : ''}`;
					nodeWrapper.setAttribute('data-type-0', key);
					nodeWrapper.setAttribute('data-type-1', keySub);

					const type = document.createElement('h4');
					type.className = 'node-type';
					type.innerHTML = nodeTypes[key][keySub][i].type;

					const nodeTitle = nodeTypes[key][keySub][i].title;
					if (nodeTitle) {
						type.innerHTML = nodeTitle;
					}
					

					const typeStr = nodeTypes[key][keySub][i].type;
					

					const title = isModifier ? `${typeStr}-modifier` : `${typeStr}-node`;
					const shape = isModifier ? this.getTriangleShape() : this.getNonagonShape(true);

					nodeWrapper.appendChild(shape);

					if (title) {
						const iconPath = `${title.replace(' ', '-').toLowerCase()}-icon`;

						const iconImg = new Image();
						iconImg.onload = () => {
							nodeWrapper.appendChild(iconImg);
						};
						iconImg.src = `./assets/icons/white/${iconPath}.svg`;
					}
				
					nodeWrapper.appendChild(type);
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

    show() {
        this.el.classList.add('visible');
    }

    hide() {
        this.el.classList.remove('visible');
    }

	onMouseDown(e) {

		// this.mouseIsDown = true;
		this.setMouseDown(true);

		this.nodePlaceHelper = new NodePlaceHelper(
			this.workspaceManager,
			{x: e.clientX, y: e.clientY},
			this.nodeToPlaceData.data.isModifier,
			this.nodeToPlaceData.data.isModifier ? this.getTriangleShape() : this.getNonagonShape()
		);
		this.nodePlaceHelper.onMouseDown(e);

		window.addEventListener('mouseup', this.onMouseUpBound);
		window.addEventListener('mousemove', this.onMouseMoveBound);
	}

	onMouseMove(e) {
		this.nodePlaceHelper.onMouseMove(e);

		const nodePos = this.nodePlaceHelper.getPos();

		if (Math.abs(this.nodePlaceHelper.deltaX) > 4 && !this.currentCreatedNode) {
			const node = this.onNodeAddedCallback(this.nodeToPlaceData, nodePos);
			this.currentCreatedNode = node;
			node.onMouseDown(e, false);
			return;
		}

		if (this.currentCreatedNode) {
			this.currentCreatedNode.onMouseMove(e);
		}
	}

	onMouseUp(e) {
		this.nodePlaceHelper.onMouseUp();

		if (this.currentCreatedNode) {
			this.currentCreatedNode.onMouseUp(e, false);
		}

		this.currentCreatedNode = null;

		window.removeEventListener('mouseup', this.onMouseUpBound);
		window.removeEventListener('mousemove', this.onMouseMoveBound);

		this.nodeToPlaceData = {
			type: undefined,
			data: undefined,
		};

		// this.mouseIsDown = false;
		this.setMouseDown(false);
	}

    getTriangleShape() {
		const triangleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        triangleSvg.classList.add("modifier");
		triangleSvg.setAttribute("width", "44px");
		triangleSvg.setAttribute("height", "44px");
		triangleSvg.setAttribute("viewBox", "0 0 24 24");
		triangleSvg.setAttribute("fill", 'rgba(50, 50, 50, .9)');

		const shape = `M23.677 18.52c.914 1.523-.183 3.472-1.967 3.472h-19.414c-1.784 0-2.881-1.949-1.967-3.472l9.709-16.18c.891-1.483 3.041-1.48 3.93 0l9.709 16.18z`;

		const trianglePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		trianglePath.setAttribute("d", shape);

		triangleSvg.appendChild(trianglePath);
		
		return triangleSvg;
	}

	getNonagonShape(small) {
		const nonagonSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		nonagonSvg.setAttribute("width", small ? "50px" : "260px");
		nonagonSvg.setAttribute("height", small ? "50px" : "260px");
		nonagonSvg.setAttribute("viewBox", "0 0 1200 1200");
		nonagonSvg.setAttribute("fill", 'rgba(50, 50, 50, .9)');

		const nonagonShape = `M464.133,1097.487c-22.564,0-55.171-11.867-72.457-26.372l-208.16-174.667c-17.285-14.504-34.635-44.554-38.553-66.777
						L97.777,562.066c-3.918-22.223,2.107-56.394,13.391-75.936l135.865-235.328c11.283-19.542,37.863-41.846,59.068-49.563
						L561.446,108.3c21.205-7.718,55.902-7.718,77.107,0L893.9,201.239c21.205,7.718,47.785,30.021,59.067,49.563l135.864,235.328
						c11.283,19.542,17.309,53.713,13.391,75.936l-47.186,267.604c-3.918,22.224-21.268,52.273-38.553,66.777l-208.16,174.667
						c-17.286,14.505-49.893,26.372-72.457,26.372H464.133z
		`;

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", nonagonShape);

        nonagonSvg.appendChild(path);
        
        return nonagonSvg;
	}


}