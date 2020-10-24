export default class Shared {
    constructor() {
        // NOT USED CAN BE REMOVED
        this._hidePlaneGeometry = new THREE.PlaneGeometry(1, 1);
        // this._hidePlaneGeometry.scale(18, 18, 1);
        const color = new THREE.Color(0.0, 0.0, 0.0).getHex();
        this._hidePlaneMaterial = new THREE.MeshBasicMaterial( { transparent: true, opacity: 0.8, color, side: THREE.DoubleSide } );
    }
    
    // NOT USED CAN BE REMOVED
    getAtomHidePlane() {
        const mesh = new THREE.Mesh(this._hidePlaneGeometry, this._hidePlaneMaterial);
        mesh.position.z = 0.51;
        mesh.scale.set(12, 12, 1);
        mesh.visible = false;

        return mesh;
    }
}