export default class Stars{
    constructor(scene) {

        const starTexture = new THREE.TextureLoader().load( './assets/textures/space/star4.jpg' );
        const vertices = [];

        const randFloatSpread = (range) => {
            return range * ( 0.5 - Math.random() );
        };

        for ( let i = 0; i < 1000; i ++ ) {

            const x = randFloatSpread( 12000 );
            const y = randFloatSpread( 12000 );
            const z = randFloatSpread( 12000 );

            vertices.push( x, y, z );

        }

        const geometry = new THREE.BufferGeometry();
        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        const material = new THREE.PointsMaterial( { alphaMap: starTexture } );

        const points = new THREE.Points( geometry, material );

        // const texture	= THREE.ImageUtils.loadTexture('./assets/textures/space/galaxy_starfield.png');
        // const material	= new THREE.MeshBasicMaterial({
        //     map	: texture,
        //     side	: THREE.BackSide
        // })
        // const geometry	= new THREE.SphereGeometry(600, 32, 32)
        // const mesh	= new THREE.Mesh(geometry, material)
        // return mesh

        scene.add( points );


        // scene.background = texture;
        // scene.add(mesh);


        // scene.background = new THREE.CubeTextureLoader()
        //     .setPath( './assets/textures/space/milkyway/' )
        //     .load( [
        //         'px.jpg',
        //         'nx.jpg',
        //         'py.jpg',
        //         'ny.jpg',
        //         'pz.jpg',
        //         'nz.jpg'
        //     ] );
    }
}