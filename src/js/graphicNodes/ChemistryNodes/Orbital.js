export default class Orbital{
    constructor(angle, radius, positions, createMesh, allowConnectionMove) {
        this._angle = angle;
        this.overridedAngle;
        this._radius = radius;
        this._allowConnectionMove = allowConnectionMove;
        this.positions = positions;
        this.color = new THREE.Color(1, 0, 1).getHex();
        const geometry = new THREE.CircleGeometry( 1, 10 );
        const material = new THREE.MeshBasicMaterial( { color: this.color } );
        this.mesh = new THREE.Mesh( geometry, material );

        const radians = angle * (Math.PI / 180);
        const x = (radius + 5) * Math.cos(radians);
        const y = (radius + 5) * Math.sin(radians);

        this.mesh.position.x = x;
        this.mesh.position.y = y;

        this.currentDistance = Number.MAX_SAFE_INTEGER;
       
        this.hideMesh();

        /* TO CHECK IF AVAILABLE FOR CONNECTION GET THE POSITION KEYS AND GET THE OBJECTS IN ATOMCIRCLE AND CHECK IF AVAILABLE */
    }

    // used for connections to set a new angle for the connection to fit -- IS IT USED ???
    overrideAngle(overridedAngle) {
        this.overridedAngle = overridedAngle;
    }

    setRadius(radius) {
        const radians = this.angleRadian;
        const x = radius * Math.cos(radians);
        const y = radius * Math.sin(radians);

        this.mesh.position.x = x;
        this.mesh.position.y = y;
    }

    hideMesh() {
        this.mesh.visible = false;
    }

    showMesh() {
        this.mesh.visible = true;
    }

    resetConnecting() {
        this.setDistance(20);
        this.hideMesh();
    }

    setDistance(value) {
        const maxDistance = 20;
        const minDistance = 0;
        this.currentDistance = value;

        const dist = Math.min(value, maxDistance);
        const scale = Math.min(Math.max((maxDistance - dist) * 0.2, 0.1), 4);

        this.mesh.scale.set(scale, scale, scale);
    }

    get position() {
        return this.mesh.position;
    }

    get allowConnectionMove() {
        return this._allowConnectionMove;
    }

    get visualAngle() {
        if (this.overridedAngle) {
            return this.overridedAngle;
        }

        return this._angle;
    }

    get angle() {
        return this._angle;
    }

    get radius() {
        return this._radius;
    }

    get angleRadian() {
        return this._angle * (Math.PI / 180);
    }

    get positions() {
        return this._positions;
    }

    set positions(value) {
        this._positions = value;
    }
}