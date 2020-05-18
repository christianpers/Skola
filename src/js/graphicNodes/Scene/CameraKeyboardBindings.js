import { KeyboardKeyHold } from 'hold-event';

export default class CameraKeyboardBindings{
    constructor(cameraControls) {
        this.cameraControls = cameraControls;

        const KEYCODE = {
			W: 87,
			A: 65,
			S: 83,
			D: 68,
			ARROW_LEFT : 37,
			ARROW_UP   : 38,
			ARROW_RIGHT: 39,
			ARROW_DOWN : 40,
		};

		const wKey = new KeyboardKeyHold( KEYCODE.W, 100 );
		const aKey = new KeyboardKeyHold( KEYCODE.A, 100 );
		const sKey = new KeyboardKeyHold( KEYCODE.S, 100 );
		const dKey = new KeyboardKeyHold( KEYCODE.D, 100 );
		aKey.addEventListener( 'holding', ( event ) => { this.cameraControls.truck( - 0.01 * event.deltaTime, 0, true ) } );
		dKey.addEventListener( 'holding', ( event ) => { this.cameraControls.truck(   0.01 * event.deltaTime, 0, true ) } );
		wKey.addEventListener( 'holding', ( event ) => { this.cameraControls.forward(   0.01 * event.deltaTime, true ) } );
		sKey.addEventListener( 'holding', ( event ) => { this.cameraControls.forward( - 0.01 * event.deltaTime, true ) } );

		const leftKey  = new KeyboardKeyHold( KEYCODE.ARROW_LEFT,  100 );
		const rightKey = new KeyboardKeyHold( KEYCODE.ARROW_RIGHT, 100 );
		const upKey    = new KeyboardKeyHold( KEYCODE.ARROW_UP,    100 );
		const downKey  = new KeyboardKeyHold( KEYCODE.ARROW_DOWN,  100 );
		leftKey.addEventListener ( 'holding', ( event ) => { this.cameraControls.rotate(  0.1 * THREE.Math.DEG2RAD * event.deltaTime, 0, true ) } );
		rightKey.addEventListener( 'holding', ( event ) => { this.cameraControls.rotate( - 0.1 * THREE.Math.DEG2RAD * event.deltaTime, 0, true ) } );
		upKey.addEventListener   ( 'holding', ( event ) => { this.cameraControls.rotate( 0, 0.05 * THREE.Math.DEG2RAD * event.deltaTime, true ) } );
		downKey.addEventListener ( 'holding', ( event ) => { this.cameraControls.rotate( 0, - 0.05 * THREE.Math.DEG2RAD * event.deltaTime, true ) } );
    }
}