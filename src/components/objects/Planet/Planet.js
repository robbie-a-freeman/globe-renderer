import { Group, BoxBufferGeometry, MeshBasicMaterial, Mesh } from 'three';

class Planet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        var geometry = new BoxBufferGeometry( 0, 0, 1 );
        var material = new MeshBasicMaterial( {color: 0x00ff00} );
        
        var cubeA = new Mesh( geometry, material );
        cubeA.position.set( 0, 0, 0 );
        
        var cubeB = new Mesh( geometry, material );
        cubeB.position.set( -100, -100, 0 );
        
        //create a group and add the two cubes
        //These cubes can now be rotated / scaled etc as a group
        this.name = 'planet';
        this.add( cubeA );
        this.add( cubeB );
        
        //scene.add( group );

    }
}

export default Planet;
