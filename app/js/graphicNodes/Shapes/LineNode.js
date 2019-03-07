import RenderNode from '../RenderNode';
import { MeshLine, MeshLineMaterial } from 'three.meshline';

export default class SphereNode extends RenderNode{
	constructor(mainRender) {
		super(mainRender);

		this.isForegroundNode = true;

		this.el.classList.add('no-height');

		// this.shader = SHADERS.CIRCLE_SHAPE_MAIN;

		const w = window.innerWidth;
		const h = window.innerHeight;

		this.camera = new THREE.PerspectiveCamera( 75, w / h, 0.1, 1000 );

		this.camera.position.z = 10;

		const getRandomFloat = (min, max) => {
			return (Math.random() * (max - min)) + min;
		}

		const segmentLength = .2;
		const nbrOfPoints = 64;
		const points = [];
		const turbulence = .2;
		for (let i = 0; i < nbrOfPoints; i++) {
			// ! We have to wrapped points into a THREE.Vector3 this time
			points.push(new THREE.Vector3(
				i * segmentLength,
				1,
				getRandomFloat(-1, 1),
			));
		}

		// 2D spline
		// const linePoints = new THREE.Geometry().setFromPoints(new THREE.SplineCurve(points).getPoints(50));
		const linePoints = new THREE.Geometry().setFromPoints(new THREE.CatmullRomCurve3(points).getPoints(50));


		console.log(linePoints);


		const line = new MeshLine();
		line.setGeometry(linePoints);
		this.geometry = line.geometry;

		this.material = new MeshLineMaterial({
			transparent: true,
			lineWidth: 0.2,
			color: new THREE.Color('#ff0000'),
			// dashArray: 2,     // always has to be the double of the line
			// dashOffset: 0,    // start the dash at zero
			// dashRatio: 0.75,  // visible length range min: 0.99, max: 0.5
		});

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.x = -6.4;

		this.scene.add(this.mesh);

		const textureParam = {
			title: 'Texture',
			param: 'map',
			useAsInput: true,
			parent: 'Material',
			paramHelpersType: 'texture',
			needsFrameUpdate: false,
		};

		const colorParam = {
			title: 'Color',
			param: 'color',
			useAsInput: true,
			defaultVal: new THREE.Color(1,1,1),
			parent: 'Material',
			paramHelpersType: 'color',
			needsFrameUpdate: false,
		};


		this.params = {
			textureParam,
			colorParam,
		}

		this.paramVals = {};
	}

	getMesh() {
		return this.mesh;
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

	update() {
		super.update();

		// console.log(this.lineMesh.material.uniforms.dashOffset.value);

		// if (this.lineMesh.material.uniforms.dashOffset.value < -2) {
		// 	this.lineMesh.material.uniforms.dashOffset.value = 0;
		// 	return;
		// }

	 //    // Decrement the dashOffset value to animate the path with the dash.
	 //    this.lineMesh.material.uniforms.dashOffset.value -= 0.01;
	}
}