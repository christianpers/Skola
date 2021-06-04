import ForegroundRender from '../ForegroundRender';

export default class MathForegroundRender extends ForegroundRender{
	constructor(mainRender, canvas, scene) {
        super(mainRender, canvas);
        this.scene = scene;

        const w = window.innerWidth;
		const h = window.innerHeight;
		
        this.camera.position.set( 0, 10, 30 );

        this.cameraControls.target = new THREE.Vector3(0, 10, -10);
	}

    fitCameraToObjects() {
        //OVERRIDE SUPER
	}

    resetMeshToFollow() {
        //OVERRIDE SUPER
	}

    addNode(outputNode) {
        super.addNode(outputNode);
    }

    update() {
        const delta = this.clock.getDelta();
		const hasControlsUpdated = this.cameraControls.update( delta );
    }

	render() {
		//OVERRIDE SUPER
	}

	onResize(renderWindowDimensions) {
		const w = renderWindowDimensions.w;
		const h = renderWindowDimensions.h;

		if (this.camera.aspect) {
			this.camera.aspect = w / h;
		} else {
			this.camera.left = w / - 2;
			this.camera.right = w / 2;
			this.camera.top = h / -2;
			this.camera.bottom = h / 2;
		}
		this.camera.updateProjectionMatrix();
	}
}