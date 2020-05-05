export default class Stars{
    constructor(scene) {
        const vertices = [];

        const randFloatSpread = (range) => {
            return range * ( 0.5 - Math.random() );
        };

        for ( let i = 0; i < 1000; i ++ ) {

            const x = randFloatSpread( 1200 );
            const y = randFloatSpread( 1200 );
            const z = randFloatSpread( 1200 );

            vertices.push( x, y, z );

        }

        const geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        const material = new THREE.PointsMaterial( { color: 0x888888 } );

        const points = new THREE.Points( geometry, material );

        scene.add( points );
    }
}