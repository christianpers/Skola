import { SIMPLE_3D_VERTEX_LIGHT, ELECTRON_FRAGMENT } from '../../../shaders/SHADERS';

export default class Electron {
    constructor(index, pos, parentMesh) {
        this.ID = `${Date.now()}-${index}`;
        this.connectionStatus = {
            connectedToRingIndex: -1,
        };

        this.parentMesh = parentMesh;

        const color = new THREE.Color(1, 0.5, 1).getHex();

        const geometry = new THREE.SphereGeometry(0.5, 10, 10);
        const material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
				THREE.UniformsLib['lights'],
				{
					lightIntensity: {type: 'f', value: 1.0}
				}
			]),
            vertexShader: SIMPLE_3D_VERTEX_LIGHT,
            fragmentShader: ELECTRON_FRAGMENT,
            lights: true,
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = 'electron';
        this.mesh.userData = {
            ID: this.ID,
        };

        this.currentAngle = 0;

        // const z = 0;

        // const pos = new THREE.Vector3(pos.x, pos.y, pos.z);
        // pos.add(offsetPos);

        this.mesh.position.set(pos.x, pos.y, pos.z);

        this.parentMesh.add(this.mesh);
    }

    getRingIndex() {
        return this.connectionStatus.connectedToRingIndex;
    }

    setConnectionStatus(ringIndex) {
        this.connectionStatus.connectedToRingIndex = ringIndex;
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
}