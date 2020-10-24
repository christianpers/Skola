import {
    getPointOnRingRadius,
} from './helpers';

export default class AnimateAlongCircle {
    constructor(object, startAngle, targetAngle, radius, center, finishedCallback) {
        this.object = object;
        this.radius = radius;
        this.center = center;

        this.finishedCallback = finishedCallback;

        this.currentAngle = startAngle;
        this.targetAngle = targetAngle;

        this.updateBound = this.update.bind(this);
        this.renderBound = this.render.bind(this);

        this.reqframe = -1;

        this.update();
    }

    update() {
        const angleDiff = this.targetAngle - this.currentAngle;

        if (Math.abs(angleDiff) > 0.05) {
            this.reqframe = window.requestAnimationFrame(this.updateBound);
        } else {
            if (this.finishedCallback) {
                this.finishedCallback();
            }
        }
        this.currentAngle += angleDiff * 0.1;

        this.render();
    }

    render() {
        const radians = (Math.PI / 180) * this.currentAngle;
        const pos = getPointOnRingRadius(this.center, radians, this.radius);
        this.object.position.x = pos.x;
        this.object.position.y = pos.y;
        this.object.position.z = 0;
    }
}