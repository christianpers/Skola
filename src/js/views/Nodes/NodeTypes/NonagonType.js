import NodeParamContainer from '../NodeComponents/NodeParamContainer';

export default class NonagonType {
    constructor(parentEl, params, node, nodeConfig) {
        this.parentEl = parentEl;
        this.params = params;
        this.paramContainers = [];
        this.inputParams = [];
		this.node = node;
		this.nodeConfig = nodeConfig;

        this.parentEl.classList.add('nonagon-node');

		this.size = 200;

		const parents = Object.keys(this.params).reduce((acc, curr) => {
			const param = this.params[curr];
			if (!acc[param.parent]) {
				acc[param.parent] = true;
			}
			return acc;
		}, {});

		const isTriangleShape = Object.keys(parents).length === 3;
		
		// Set css class for triangle.. needs some spec css props
		if (isTriangleShape) {
			parentEl.classList.add('triangle-shape');
		}

        const nonagonSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		nonagonSvg.setAttribute("width", `${this.size}px`);
		nonagonSvg.setAttribute("height", `${this.size}px`);
		nonagonSvg.setAttribute("viewBox", `0 0 ${this.size} ${this.size}`);
		
		this.nonagonSvg = nonagonSvg;
        
        parentEl.appendChild(nonagonSvg);

        this.initParams();
    }

    initParams() {
        const paramParents = [];
		for (const key in this.params) {
			if (this.params[key].useAsInput && this.params[key].parent) {
				const parent = this.params[key].parent;
				if (!paramParents.some(t => t.parent === parent)) {
					const obj = {parent, children: []};
					paramParents.push(obj);
					obj.children.push(this.params[key]);
				} else {
					const obj = paramParents.find(t => t.parent === parent);
					obj.children.push(this.params[key]);
				}
			}
		}

		if (paramParents.length > 0) {
			for (let i = 0; i < paramParents.length; i++) {
				const obj = paramParents[i];
				// const paramHeader = new NodeHeader(this.topPartEl, obj.parent, i > 0);
				// const index = -Math.floor(paramParents.length / 2) + i;
				const ID = Math.random().toString(36).substr(2, 9);
				const backendConfig = this.nodeConfig ? this.nodeConfig.data.paramContainers[i] : null;
				const paramContainer = new NodeParamContainer(this.parentEl, obj, this.node, ID, backendConfig);
				
                this.paramContainers.push(paramContainer);
				
			}
		} else {
			const index = 0;
			for (const key in this.params) {
				const paramContainer = new NodeParamContainer(this.parentEl, index);
				// if (this.params[key].useAsInput) {
					// const param = new NodeParam(this.topPartEl, this.params[key], this.onInputClickBound);
					// this.inputParams[this.params[key].title] = param;
				// }
				index++;
			}
		}

		const angle = 360 / paramParents.length;
		const sides = paramParents.length;
		const radius = this.size / 2;
		const a = ((Math.PI * 2) / sides);
		const points = [];
		for (let i = 0; i < sides; i++) {
			const x = radius * Math.cos(a * i);
			const y = radius * Math.sin(a * i);
			const point = {x, y};
			points.push(point);

			const rotation = i * angle + (angle / 2);
			this.paramContainers[i].setRotation(rotation, i);
		}

		let pathStr = `M ${points[0].x} ${points[0].y}`;
		for (let i = 1; i < points.length; i++) {
			pathStr += ` L ${points[i].x} ${points[i].y}`;
		}
		pathStr+= 'Z';

		const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
		g.setAttribute('transform', `translate(${this.size / 2}, ${this.size / 2}) rotate(-90)`);
		g.setAttribute("width", `${this.size}`);
		g.setAttribute("height", `${this.size}`);

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", pathStr);
		path.setAttribute("stroke", 'black');

		g.appendChild(path);

		const color1 = 'rgb(61, 63, 67)';
		const color2 = 'rgb(48, 50, 54)';
		const color3 = 'rgb(36, 37, 41)';
		const color4 = 'rgb(84, 86, 95)';
		const color5 = 'rgb(72, 74, 81)';
		const colors = [color1, color2, color3, color4, color5];

		for (let i = 0; i < points.length; i++) {
			const trianglePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
			const startIndex = i;
			const endIndex = i + 1 < points.length ? i + 1 : 0;
			const startPoint = points[startIndex];
			const endPoint = points[endIndex];

			this.paramContainers[i].setTextRotation(startPoint, endPoint);

			const triangleStr = `M ${startPoint.x} ${startPoint.y} L 0 0 L ${endPoint.x} ${endPoint.y}`;
			trianglePath.setAttribute("fill", colors[i % 5]);
			// console.log(colors[i % 4]);
			trianglePath.setAttribute("d", triangleStr);

			g.appendChild(trianglePath);

			const outlinePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
			const outlineStr = `M ${startPoint.x} ${startPoint.y} ${endPoint.x} ${endPoint.y}`;

			outlinePath.setAttribute("class", 'outline');
			outlinePath.setAttribute("d", outlineStr);
			// outlinePath.setAttribute("stroke", "white");
			// outlinePath.setAttribute("stroke-width", 0);

			g.appendChild(outlinePath);
		}
		this.nonagonSvg.appendChild(g);
	}

	setActive() {
		this.parentEl.style.transform = `scale(1)`;
	}

	setInactive() {
		this.parentEl.style.transform = `scale(.6)`;
	}

	getEnabledParamsForType(type, initObj) {
		const ret = initObj;
		const paramContainer = this.paramContainers.find(t => t.parentTitle === type);
		const keys = Object.keys(paramContainer.inputParams);
		const keysLength = keys.length;
		for (let i = 0; i < keysLength; i++) {
			if (paramContainer.inputParams[keys[i]].isConnected) {
				ret[paramContainer.inputParams[keys[i]].param.param] = {enabled: true, paramID: paramContainer.inputParams[keys[i]].ID};
			}
		}
		return ret;
	}
}