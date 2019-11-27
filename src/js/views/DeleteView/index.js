import './index.scss';

export default class DeleteView{
    constructor(parentEl) {
        this.el = document.createElement('div');
        this.el.classList.add('delete-view');

        this.img = new Image();
        this.img.src = './assets/delete.svg';

        this.el.appendChild(this.img);

        document.body.appendChild(this.el);

        parentEl.appendChild(this.el);

        this.deleteOnRelease = false;
    }

    onNodeMoveStart() {
        this.deleteOnRelease = false;
        this.el.classList.add('visible');
    }

    onNodeMove(x,y) {
        const nodePos = new THREE.Vector2(x, y);
        const pos = this.getPos();

        const dist = nodePos.distanceTo(pos);

        if (dist < 50) {
            this.deleteOnRelease = true;
        } else {
            this.deleteOnRelease = false;
        }

        const scaleVal = 1 + (400 - Math.min(400, dist)) / 400 * 0.75;
        this.img.style.transform = `scale(${scaleVal})`;
    }

    // CALLED ON RELEASE
    deleteOnNodeRelease() {
        this.el.classList.remove('visible');
        this.img.style.transform = `scale(1.0)`;
        return this.deleteOnRelease;
    }

    getPos() {
		const pos = new THREE.Vector2();
		const rect = this.el.getBoundingClientRect();
		pos.set(rect.x + rect.width / 2, rect.y + rect.height / 2);
		
		return pos;
	}

}