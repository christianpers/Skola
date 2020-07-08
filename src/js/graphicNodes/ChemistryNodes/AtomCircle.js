export default class AtomCircle{
	constructor(radius, ringDef, index) {

        this.title = 'AtomCircle';
        this.index = index;
        this.ringDef = ringDef;
        this.radius = radius;
		// SHOULD BE OBJECTS WITH REF TO OBJ AND ANGLE
		this.connectedElectrons = new Map();
        this.highlightColor = new THREE.Color(1, 1, 1).getHex();
        this.defaultColor = new THREE.Color(1, 0, 0).getHex();
        this.initCurve(radius);
	}

	addConnectedElectron(key, value) {
		this.connectedElectrons.set(key, value);
	}

	removeConnectedElectron(key) {
		this.connectedElectrons.delete(key);
	}

	initCurve(radius) {
		this.curve = new THREE.EllipseCurve(
			0,  0,            // ax, aY
			radius, radius, // xRadius, yRadius
			0,  2 * Math.PI,  // aStartAngle, aEndAngle
			false,            // aClockwise
			0                 // aRotation
		);

		const points = this.curve.getPoints( 50 );
		const arrLength = 51;
		const positions = new Float32Array( 51 * 3 );
		let index = 0;

		for (let i = 0; i < arrLength; i++) {
			positions[index++] = points[i].x;
			positions[index++] = points[i].y;
			positions[index++] = 0;
		}
		this.geometry = new THREE.BufferGeometry();
		this.bufferAttr = new THREE.BufferAttribute( positions, 3 );
		// this.bufferAttr.setDynamic(true);
		this.geometry.addAttribute( 'position', this.bufferAttr );

		this.material = new THREE.LineBasicMaterial( { color : this.defaultColor } );

		this.mesh = new THREE.Line( this.geometry, this.material );
		this.mesh.visible = false;
	}

    setHighlighted() {
        this.material.color.setHex(this.highlightColor);
    }

    setDefault() {
        this.material.color.setHex(this.defaultColor);
    }

	addElectron(obj, angle) {
		const electronObj = { obj, angle };
		this.connectedElectrons.push(electronObj);
	}

	removeElectron() {

	}

    remove() {
        this.geometry.dispose();
        this.material.dispose();
    }

	
	update() {
		

		// this.currentT += this.currentSpeed * window.NS.settings.speedModifier;
		// if (this.currentT > 1) {
		// 	this.currentT = 0;
		// }
	}

	updateMesh(curvePointsForHelperMesh = {}) {
		const points = this.curve.getPoints( 50 );
		const arrLength = 51;
		const positions = new Float32Array( 51 * 3 );
		let index = 0;

		for (let i = 0; i < arrLength; i++) {
			positions[index++] = this.enabledAxes['x'] ? points[i].x : curvePointsForHelperMesh['x'] || 0;
			positions[index++] = this.enabledAxes['y'] ? points[i].y : curvePointsForHelperMesh['y'] || 0;
			positions[index++] = this.enabledAxes['z'] ? points[i].y : curvePointsForHelperMesh['z'] || 0;
		}
		this.bufferAttr.set(positions);
		this.mesh.geometry.attributes.position.needsUpdate = true;
	}

	render() {

	}

	

	removeFromDom() {

		this.reset();
		// window.cancelAnimationFrame(this.animateValues.reqAnimFrame);

		super.removeFromDom();

	}
}