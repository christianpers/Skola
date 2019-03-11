import GraphicNode from '../GraphicNode';

export default class TextureSelectorNode extends GraphicNode{
	constructor() {
		super();

		this.isGraphicsNode = true;
		this.isBackgroundNode = true;

		this.currentOutConnections = [];

		this.el.classList.add('no-height');
		this.el.classList.add('texture-selector-node');

		this.texture = new THREE.TextureLoader().load( 'assets/test/Image1.png' );
		this.texture.magFilter = THREE.LinearFilter;
		this.texture.minFilter = THREE.LinearFilter;

		const textures = [
			{
				rymden: [
					{
						title: 'Jorden',
						name: 'space/2k_earth_daymap.jpg',
					},
					{
						title: 'Solen',
						name: 'space/2k_sun.jpg',
					},
					{
						title: 'Mars',
						name: 'space/2k_mars.jpg',
					},
				],
			},
		];

		this.wrapper = document.createElement('div');
		this.wrapper.className = 'wrapper';

		for (let i = 0; i < textures.length; i++) {
			const obj = textures[i];
			for (const key in obj) {
				const keyObj = obj[key];
				const parentLabel = document.createElement('h4');
				parentLabel.innerHTML = key;

				const childrenContainer = document.createElement('div');
				childrenContainer.className = 'children-container';

				childrenContainer.appendChild(parentLabel);

				for (let q = 0; q < keyObj.length; q++) {
					const el = document.createElement('div');
					el.className = 'child-wrapper';

					const label = document.createElement('h4');
					label.innerHTML = keyObj[q].title;

					el.onclick = (e) => {
						e.preventDefault();
						e.stopPropagation();
						this.onTextureSelected(keyObj[q], el);
					};

					el.appendChild(label);

					childrenContainer.appendChild(el);
				}

				this.wrapper.appendChild(childrenContainer);
			}
		}

		this.topPartEl.appendChild(this.wrapper);

		this.params = {
		};

		this.paramVals = {};
	}

	onTextureSelected(obj, el) {
		const src = `assets/textures/${obj.name}`;
		this.texture = new THREE.TextureLoader().load( src );

		for (let i = 0; i < this.currentOutConnectionsLength; i++) {
			const param = this.currentOutConnections[i].param;

			if (this.currentOutConnections[i].in.isCanvasNode) {
				this.currentOutConnections[i].in.setBackgroundTexture(this.texture);
			} else if (param) {
				this.currentOutConnections[i].in.updateParam(param, this);
			}
			
		}

		const selectors = this.wrapper.querySelectorAll('.child-wrapper');
		for (let i = 0; i < selectors.length; i++) {
			selectors[i].classList.remove('active');
		}

		el.classList.add('active');

	}

	enableOutput(param, connection) {
		super.enableOutput();

		this.currentOutConnections.push(connection);
		this.currentOutConnectionsLength = this.currentOutConnections.length;
		
	}


	disableOutput(nodeIn, param) {
		const tempOutConnections = this.currentOutConnections.map(t => t);

        let paramConnections = tempOutConnections.filter(t => t.param);
        let nodeConnections = tempOutConnections.filter(t => !t.param);

        if (param) {
            paramConnections = paramConnections.filter(t => t.param && (t.param.title !== param.title));
        } else {
            nodeConnections = nodeConnections.filter(t => t.in.ID !== nodeIn.ID);
        }
        
        const finalConnections = paramConnections.concat(nodeConnections);
        this.currentOutConnections = finalConnections;
        this.currentOutConnectionsLength = this.currentOutConnections.length;

        if (this.currentOutConnectionsLength <= 0) {
            super.disableOutput();

        }
		
		
	}

}