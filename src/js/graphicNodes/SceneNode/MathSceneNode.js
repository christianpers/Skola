import SceneNode from './SceneNode';
import MathForegroundRender from '../Scene/math/ForegroundRender';

const getLineMesh = (points) => {
    // const points = [];
    // points.push( new THREE.Vector3( - 20, 0, 0 ) );
    // points.push( new THREE.Vector3( 20, 0, 0 ) );

    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

    const geometry = new THREE.BufferGeometry().setFromPoints( points );

    return new THREE.Line( geometry, material );
}

export default class MathSceneNode extends SceneNode {
    constructor(mainRenderer) {
        super(mainRenderer);

        this.foregroundRender = new MathForegroundRender(this.mainRender, this.topPartEl, this.scene);

    }

    init(parentEl) {
        super.init(parentEl);

        const framebufferMesh = this.scene.getObjectByName('framebuffer-mesh');
		this.scene.remove(framebufferMesh);

        this.scene.background = new THREE.Color( 0xe0e0e0 );
        this.scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 )

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
        hemiLight.position.set( 0, 20, 0 );
        this.scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.set( 0, 20, 10 );
        this.scene.add( dirLight );

        const grid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.scene.add( grid );

        
        // HORIZONTAL LINE
        const horizontalPoints = [];
        horizontalPoints.push( new THREE.Vector3( - 20, 0, 0 ) );
        horizontalPoints.push( new THREE.Vector3( 20, 0, 0 ) );
        const horizontalMesh = getLineMesh(horizontalPoints);
        this.scene.add(horizontalMesh);


        //VERTICAL LINE
        const verticalPoints = [];
        verticalPoints.push( new THREE.Vector3( - 20, 0, 0 ) );
        verticalPoints.push( new THREE.Vector3( -20, 20, 0 ) );
        const verticalMesh = getLineMesh(verticalPoints);
        this.scene.add(verticalMesh);

        // DEPTH LINE
        const depthPoints = [];
        depthPoints.push( new THREE.Vector3( - 20, 0, 0 ) );
        depthPoints.push( new THREE.Vector3( -20, 0, -20 ) );
        const depthMesh = getLineMesh(depthPoints);
        this.scene.add(depthMesh);

        

        // const geometry = new THREE.BufferGeometry().setFromPoints( points );

        // const line = new THREE.Line( geometry, material );

        // this.scene.add( line );
    }

    enableInput(outputNode, inputType) {
		// this.inputs[inputType].enable();

		if (outputNode.isBackgroundNode) {
		} else if (outputNode.isForegroundNode) {
			this.foregroundRender.addNode(outputNode);
		} else if (outputNode.isLightNode) {
			this.foregroundRender.addLight(outputNode);
		}

		const obj = {
			out: outputNode,
			type: inputType,
		};
		this.enabledInputs.push(obj);

	}

	disableInput(outNode, inputType) {
		if (outNode.isBackgroundNode) {
		} else if (outNode.isForegroundNode) {
			this.foregroundRender.removeNode(outNode);

		} else if (outNode.isLightNode) {
			// this.inputs[inputType].disable();
			this.foregroundRender.removeLight(outNode);
		}
		
		this.enabledInputs = this.enabledInputs.filter(t => t.out.ID !== outNode.ID);
		// const graphicInputs = this.enabledInputs.filter(t => !t.out.isLightNode);
	}

    setBackgroundTexture(texture) {
	}

	enableForeground() {
	}

    update() {
        this.foregroundRender.update();
    }

    render() {
        const camera = this.foregroundRender.getCamera();
        this.renderer.render(this.scene, camera);
    }
}