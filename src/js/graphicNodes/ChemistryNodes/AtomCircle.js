import { getCircle, getDoubleCircle } from './helpers';

export default class AtomCircle{
	constructor(radius, ringDef, index) {
        this.title = 'AtomCircle';
        this.index = index;
		// RINGDEF CONTAINS AMOUNT ELECTRONS ALLOWED IN RING
        this.ringDef = ringDef;
        this.radius = radius;
		// SHOULD BE OBJECTS WITH REF TO OBJ AND ANGLE
		this.connectedElectrons = new Set();
        this.highlightColor = new THREE.Color(1, 1, 1).getHex();
        this.defaultColor = new THREE.Color(1, 0, 0).getHex();
        this.initCurve(radius);
	}

	addConnectedElectron(key) {
		this.connectedElectrons.add(key);
	}

	removeConnectedElectron(key) {
		this.connectedElectrons.delete(key);
	}

	getElectronRingIndex(electronID) {
		return [...this.connectedElectrons].findIndex(t => t === electronID);
	}

	initCurve(radius) {
		const detailPerPartCurve = 10;
		// const rotateOrigin = { x: 0, y: 0 };
		// const rotateAngle = 120;
		// const points = getDoubleCircle(rotateOrigin, rotateAngle, detailPerPartCurve, 0, 0, radius, radius);
		const points = getCircle(detailPerPartCurve, 0, 0, radius, radius);
		
		let index = 0;

		const length = points.length;
		const positions = new Float32Array( length * 3 );

		for (let i = 0; i < length; i++) {
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

		// this.mesh.rotation.z = - (3.14 / 2);
	}

    setHighlighted() {
        this.material.color.setHex(this.highlightColor);
    }

    setDefault() {
        this.material.color.setHex(this.defaultColor);
    }

	// USE TO GET ELECTRON POSITION --- NEW FUNCTION TO USE
	getElectronPosition(offset, electronRingIndex) {
		const getAngle = (ringIndex, orbPositions, orbDistance) => {
			const pairOffset = ringIndex >= orbPositions ? 5 : -5;
			return ((ringIndex % orbPositions) * orbDistance + 90) - pairOffset;
		};
		const { orbitalPositions } = this.ringDef;
		const orbitalDistance = 360 / orbitalPositions;
		const electronAngle = getAngle(electronRingIndex, orbitalPositions, orbitalDistance);

		const radians = electronAngle * (Math.PI / 180);
		const x = offset.x + this.radius * Math.cos(radians);
		const y = offset.y + this.radius * Math.sin(radians);

		return new THREE.Vector2(x, y);
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

	// updateMesh(curvePointsForHelperMesh = {}) {
	// 	const points = this.curve.getPoints( 50 );
	// 	const arrLength = 51;
	// 	const positions = new Float32Array( 51 * 3 );
	// 	let index = 0;

	// 	for (let i = 0; i < arrLength; i++) {
	// 		positions[index++] = this.enabledAxes['x'] ? points[i].x : curvePointsForHelperMesh['x'] || 0;
	// 		positions[index++] = this.enabledAxes['y'] ? points[i].y : curvePointsForHelperMesh['y'] || 0;
	// 		positions[index++] = this.enabledAxes['z'] ? points[i].y : curvePointsForHelperMesh['z'] || 0;
	// 	}
	// 	this.bufferAttr.set(positions);
	// 	this.mesh.geometry.attributes.position.needsUpdate = true;
	// }

	render() {

	}

	

	removeFromDom() {

		this.reset();
		// window.cancelAnimationFrame(this.animateValues.reqAnimFrame);

		super.removeFromDom();

	}
}