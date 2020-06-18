export default class AnimateObject{
    constructor(object, finalPosition) {
        this.object = object;
        this.finalPosition = finalPosition;
        this.startPosition = new THREE.Vector2(object.position.x, object.position.y);

        this.currentPosition = this.startPosition.clone();
        this.targetPosition = finalPosition.clone();

        this.updateBound = this.update.bind(this);
        this.renderBound = this.render.bind(this);

        this.reqframe = -1;

        this.update();
    }

    update() {
        const xDiff = this.targetPosition.x - this.currentPosition.x;
        const yDiff = this.targetPosition.y - this.currentPosition.y;

        if (Math.abs(xDiff) > 0.05 || Math.abs(yDiff) > 0.05) {
            this.reqframe = window.requestAnimationFrame(this.updateBound);
        }

        this.currentPosition.x += xDiff * 0.1;
        this.currentPosition.y += yDiff * 0.1;

        this.render();
    }

    render() {
        console.log('r');
        this.object.position.x = this.currentPosition.x;
        this.object.position.y = this.currentPosition.y;
    }
}