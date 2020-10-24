const DISCONNECT_WAIT = 3000;

export default class AtomDisconnectHandler{
    constructor(onDisconnectCallback, position) {
        this.onDisconnectCallback = onDisconnectCallback;

        this.hasDisconnected = false;
        this.startPosition = position.clone();
        this.timeout = setTimeout(() => {
            this.hasDisconnected = true;
            this.onDisconnectCallback();
        }, DISCONNECT_WAIT);
    }

    onMove(position) {
        const dist = position.distanceTo(this.startPosition);
        // console.log('dist: ', dist,  '  start pos: ', this.startPosition, ' pos: ', position);
        if (dist > 1) {
            clearTimeout(this.timeout);
        }
    }

    onEnd() {
        clearTimeout(this.timeout);
    }
}