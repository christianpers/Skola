import NodeParamContainer from '../NodeComponents/NodeParamContainer';

export default class NonagonType {
    constructor(parentEl, params, node) {
        this.parentEl = parentEl;
        this.params = params;
        this.paramContainers = [];
        this.inputParams = [];
        this.node = node;

        this.parentEl.classList.add('nonagon-node');

        const nonagonSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		nonagonSvg.setAttribute("width", "260px");
		nonagonSvg.setAttribute("height", "260px");
		nonagonSvg.setAttribute("viewBox", "0 0 1200 1200");

		const nonagonShape = `M464.133,1097.487c-22.564,0-55.171-11.867-72.457-26.372l-208.16-174.667c-17.285-14.504-34.635-44.554-38.553-66.777
						L97.777,562.066c-3.918-22.223,2.107-56.394,13.391-75.936l135.865-235.328c11.283-19.542,37.863-41.846,59.068-49.563
						L561.446,108.3c21.205-7.718,55.902-7.718,77.107,0L893.9,201.239c21.205,7.718,47.785,30.021,59.067,49.563l135.864,235.328
						c11.283,19.542,17.309,53.713,13.391,75.936l-47.186,267.604c-3.918,22.224-21.268,52.273-38.553,66.777l-208.16,174.667
						c-17.286,14.505-49.893,26.372-72.457,26.372H464.133z
		`;

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute("d", nonagonShape);

        nonagonSvg.appendChild(path);
        
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
				const paramContainer = new NodeParamContainer(this.parentEl, i, obj, this.node);
				
                this.paramContainers.push(paramContainer);
				
			}
		} else {
			const index = 0;
			for (const key in this.params) {
				const paramContainer = new NodeParamContainer(this.parentEl, index);
				if (this.params[key].useAsInput) {
					// const param = new NodeParam(this.topPartEl, this.params[key], this.onInputClickBound);
					// this.inputParams[this.params[key].title] = param;
				}
				index++;
			}
		}
    }
}