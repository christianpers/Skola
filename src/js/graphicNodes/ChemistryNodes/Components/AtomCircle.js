import { getCircle } from '../helpers';


export default class AtomCircle {
    constructor(radius, index) {
        this._radius = radius;
        this._index = index;
    }

    init(atomID) {
        const atomState = window.NS.singletons.LessonManager.chemistryState.getAtom(atomID);

        this.initCurve();
    }

    initCurve() {
		const detailPerPartCurve = 10;
        const radius = this._radius;
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

		this.material = new THREE.LineBasicMaterial( { transparent: true, color : this.defaultColor, opacity: 1.0 } );
		this.material.userData.toggleSelected = true;

		this.mesh = new THREE.Group();
		
		this.ringMesh = new THREE.Line( this.geometry, this.material );

		this.mesh.add(this.ringMesh);
		// for (let i = 0; i < this.orbitals.length; i++) {
		// 	this.mesh.add(this.orbitals[i].mesh);
		// }

		// this.mesh.visible = false;
	}
}