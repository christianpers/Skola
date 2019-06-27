export default class TriangleType {
    constructor(parentEl, params, node) {
        this.parentEl = parentEl;
        this.paramContainers = [];
        this.triangleSvg = null;
        this.node = node;

        this.isConnected = false;
        this.assignedParamContainer = null;

        this.pos = new THREE.Vector2();

        this.parentEl.classList.add('triangle-node');

        const triangleSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        triangleSvg.classList.add("modifier");
		triangleSvg.setAttribute("width", "40px");
		triangleSvg.setAttribute("height", "40px");
		triangleSvg.setAttribute("viewBox", "0 0 24 24");

		const shape = `M23.677 18.52c.914 1.523-.183 3.472-1.967 3.472h-19.414c-1.784 0-2.881-1.949-1.967-3.472l9.709-16.18c.891-1.483 3.041-1.48 3.93 0l9.709 16.18z`;

		const trianglePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		trianglePath.setAttribute("d", shape);

        triangleSvg.appendChild(trianglePath);
        
        this.triangleSvg = triangleSvg;
        
        parentEl.appendChild(triangleSvg);

        this.latestAngle = 0;
    }

    getPos() {
        const rect = this.parentEl.getBoundingClientRect();
        this.pos.set(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return this.pos;
    }

    setAngle(angle) {
        this.triangleSvg.style.transform = `rotate(${angle}deg)`;
        this.latestAngle = angle;
        // console.log('set angle', angle);

        // this.el.style.transform = `rotate(${(this.index) * 40}deg)`;
    }

    activateAsChild(paramContainer) {
        this.triangleSvg.style.transform = `rotate(0deg)`;
        this.isConnected = true;
        this.assignedParamContainer = paramContainer;
        paramContainer.addModifierAsChild(this);
        this.node.setAsChildToParamContainer(paramContainer);
    }

    deactivateAsChild(e) {
        this.setAngle(this.latestAngle);
        this.isConnected = false;
        this.assignedParamContainer.removeModifierAsChild(this.node.ID);
        this.node.setAsNotChildToParamContainer(this.assignedParamContainer, e);
        this.assignedParamContainer = null;
    }

    hide() {
        this.triangleSvg.style.opacity = 0;
    }

    show() {
        this.triangleSvg.style.opacity = 1;
    }
}