import * as SHADERS from '../../shaders/SHADERS';

export default class Render{
	constructor() {

		this.renderer = new THREE.WebGLRenderer({alpha: true});
	}
}