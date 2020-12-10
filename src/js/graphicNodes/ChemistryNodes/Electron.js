import { SIMPLE_3D_VERTEX_LIGHT, ELECTRON_FRAGMENT } from '../../../shaders/SHADERS';

export default class Electron {
    constructor(index, pos, parentMesh) {
        this.ID = `${Date.now()}-${index}`;
        this.connectionStatus = {
            connectedToRingIndex: -1,
        };

        this._orbitalAngle = undefined;

        this._isConnectingToAtom = false;

        this._ringPositionKey;

        this._overrideConnectionAngle = undefined;

        this.parentMesh = parentMesh;

        // const color = new THREE.Color(1, 0.5, 1).getHex();

        const geometry = new THREE.SphereGeometry(0.5, 10, 10);
        // const material = new THREE.ShaderMaterial({
        //     uniforms: THREE.UniformsUtils.merge([
		// 		THREE.UniformsLib['lights'],
		// 		{
		// 			lightIntensity: {type: 'f', value: 1.0}
		// 		}
		// 	]),
        //     vertexShader: SIMPLE_3D_VERTEX_LIGHT,
        //     fragmentShader: ELECTRON_FRAGMENT,
        //     lights: true,
        // });
        this.orbitalConnectedColor = new THREE.Color(152/255, 235/255, 169/255).getHex();
        this.selectedColor = new THREE.Color(75/255, 133/255, 250/255).getHex();
        this.deselectedColor = new THREE.Color(0.8, 0.8, 1.0).getHex();
		// const material = new THREE.MeshLambertMaterial({ color });
        const material = new THREE.MeshBasicMaterial( { transparent: true, opacity: 1, color: this.deselectedColor, side: THREE.DoubleSide } );
		material.userData.toggleSelected = true;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = 'electron';
        this.mesh.userData = {
            ID: this.ID,
        };

        this._orbitalIndex;
        this.currentAngle = 0;

        this.mesh.position.set(pos.x, pos.y, pos.z);

        this.parentMesh.add(this.mesh);
    }

    getRingIndex() {
        return this.connectionStatus.connectedToRingIndex;
    }

    setConnectionStatus(ringIndex) {
        this.connectionStatus.connectedToRingIndex = parseInt(ringIndex);
    }

    getConnectionStatus() {
        return this.connectionStatus;
    }

    isConnected() {
        return this.connectionStatus.connectedToRingIndex > -1;
    }

    remove() {
        this.mesh.geometry.dispose();
        this.mesh.material.dispose();
        this.parentMesh.remove(this.mesh);
    }

    set ringPositionKey(value) {
        const color = value ? this.selectedColor : this.deselectedColor;
        this.mesh.material.color.set(color);
        this._ringPositionKey = value ? parseInt(value) : value;
    }

    get ringPositionKey() {
        return this._ringPositionKey;
    }

    get isConnectingToAtom() {
        return this._isConnectingToAtom;
    }

    set isConnectingToAtom(value) {
        this._isConnectingToAtom = value;
    }

    set position(pos) {
        this.mesh.position.set(pos.x, pos.y, 0);
    }

    set orbitalAngle(value) {
        this._orbitalAngle = value;
    }

    get orbitalAngle() {
        return this._orbitalAngle;
    }

    get overrideConnectionAngle() {
        return this._overrideConnectionAngle;
    }

    set overrideConnectionAngle(value) {
        this._overrideConnectionAngle = value;
    }

    set orbitalConnected(value) {
        this._orbitalConnected = value;

        const color = value === false ? this.selectedColor : this.orbitalConnectedColor;
        this.mesh.material.color.set(color);
    }
}