export default class Raycaster{
    constructor(clickListenerEl, foregroundRender) {
        this.raycaster = new THREE.Raycaster();

        this.clickListenerEl = clickListenerEl;
        this.foregroundRender = foregroundRender;

        this.onClickBound = this.onClick.bind(this);
        this.clickListenerEl.addEventListener('click', this.onClickBound);
    }

    onClick(e) {
        console.log('x: ', e, ' w: ', this.clickListenerEl.clientWidth);
        const winW = window.innerWidth;
        const canvasW = this.clickListenerEl.clientWidth;
        const xOffset = winW - canvasW;

        console.log('newX: ', e.x - xOffset);
        const normalizedX = ( (e.x - xOffset) / canvasW ) * 2 - 1;
        const normalizedY = ( e.y / this.clickListenerEl.clientHeight ) * 2 - 1;

        const mouse = { x: normalizedX, y: normalizedY };

        console.log('m: ', mouse);

        const { camera, scene } = this.foregroundRender;

        this.raycaster.setFromCamera( mouse, camera );

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects( scene.children );

        console.log('i: ', intersects);

        // for ( var i = 0; i < intersects.length; i++ ) {

        //     // intersects[ i ].object.material.color.set( 0xff0000 );
            

        // }
    }
}