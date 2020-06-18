import * as SHADERS from '../../shaders/SHADERS';

export default class Render{
	constructor() {

		this.renderer = new THREE.WebGLRenderer({alpha: true});
		if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.chemistry.id) {
			this.renderer.setClearColor(0xffffff, 1);
		}
	}
}