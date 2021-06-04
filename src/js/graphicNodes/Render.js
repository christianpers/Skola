import * as SHADERS from '../../shaders/SHADERS';

export default class Render{
	constructor() {

		this.renderer = new THREE.WebGLRenderer({alpha: true});
		this.renderer.shadowMap.enabled = true;
		// this.renderer.setClearColor(0xe0e0e0, 1);
		if (window.NS.singletons.PROJECT_TYPE === window.NS.singletons.TYPES.chemistry.id) {
			this.renderer.setClearColor(0x000000, 1);
		}
	}
}