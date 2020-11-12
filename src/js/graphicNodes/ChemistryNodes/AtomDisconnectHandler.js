const DISCONNECT_WAIT = 1000;

export default class AtomDisconnectHandler{
    constructor(onDisconnectCallback, position, hideMesh, progressMesh) {
        this.onDisconnectCallback = onDisconnectCallback;

        this.hideMesh = hideMesh;
        this.progressMesh = progressMesh;
        setTimeout(() => {
            this.progressMesh.visible = true;

            this.hideMesh.material.opacity = 0;

            this.reqframe = window.requestAnimationFrame(this.onUpdateBound);
        }, 100);
        

        this.hasDisconnected = false;
        this.startPosition = position.clone();
        this.timeout = setTimeout(() => {
            this.hasDisconnected = true;
            this.reset();
            this.onDisconnectCallback();
        }, DISCONNECT_WAIT);

        this.onUpdateBound = this.onProgressUpdate.bind(this);

        this.startTime = performance.now();
    }

    onProgressUpdate() {
        this.reqframe = window.requestAnimationFrame(this.onUpdateBound);

        const now = performance.now();
        const diff = now - this.startTime;

        const scale = Math.max(1 - (diff / DISCONNECT_WAIT), 0);

        this.progressMesh.scale.set(scale, scale, 1);
    }

    reset() {
        this.progressMesh.visible = false;
        this.progressMesh.scale.set(1, 1, 1);
        this.hideMesh.material.opacity = 1;
        cancelAnimationFrame(this.reqframe);
    }

    onMove(position) {
        const dist = position.distanceTo(this.startPosition);
        if (dist > 1) {
            this.reset();
            clearTimeout(this.timeout);
        }
    }

    onEnd() {
        this.reset();
        clearTimeout(this.timeout);
    }
}