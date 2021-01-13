
export default class SpaceManager {
    constructor() {
        this.planetsToCheckDistance = [];

        window.NS.singletons.lessons.space = {};
        window.NS.singletons.lessons.space.distanceModifier = 0;

        this.origin = new THREE.Vector3();

        this.onCameraChangedBound = this.onCameraChanged.bind(this);

		document.documentElement.addEventListener('camera-pos-changed', this.onCameraChangedBound);

        /* TODO Compare distance between origin and targetNode with camerapos and origin  */

    }

    onCameraChanged(e) {
        if (!this.planetsToCheckDistance || this.planetsToCheckDistance.length === 0) {
            return;
        }
        const orbitNode = window.NS.singletons.ConnectionsManager.getConnectedNodeWithType(this.planetsToCheckDistance[0].ID, 'Space Orbit');
        // console.log('o: ', orbitNode.ID, ' d: ', orbitNode.currentDistanceToOrigin);
        const cameraPos = new THREE.Vector3(e.detail.x, 0, e.detail.z);
        const getDistance = (targetNode) => {
            const camDistanceToCenter = cameraPos.distanceToSquared(this.origin);
            const diff = Math.abs(camDistanceToCenter - orbitNode.currentDistanceToOrigin);
            // console.log(camDistanceToCenter);
            
            const minDistance = 3000;
            const maxDistance = 3200;

            return Math.max(Math.min((1 - ((diff - minDistance) / (maxDistance - minDistance))), 1), 0);
        };

        let distModifier = 0;
        for (let i = 0; i < this.planetsToCheckDistance.length; i++) {
            const planetDistModifier = getDistance(this.planetsToCheckDistance[i]);
            if (planetDistModifier > 0) {
                distModifier = planetDistModifier;
            }
        }

        window.NS.singletons.lessons.space.distanceModifier = distModifier;
	}

    addPlanetToCheckDistance(planetNode) {
        this.removePlanetToCheckDistance(planetNode);
        this.planetsToCheckDistance.push(planetNode);
    }

    removePlanetToCheckDistance(planetNode) {
        const temp = this.planetsToCheckDistance.filter(t => t.ID !== planetNode.ID);
        this.planetsToCheckDistance = temp;
    } 
}