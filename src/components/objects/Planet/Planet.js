import { Group, BoxBufferGeometry, MeshBasicMaterial, Mesh, PlaneGeometry, DoubleSide, Vector3, Face3 } from 'three';

class Planet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        var geometry = new BoxBufferGeometry( 1, 1, 1 );
        var material = new MeshBasicMaterial( {color: 0x00ff00} );
        
        //var cubeA = new Mesh( geometry, material );
        //cubeA.position.set( 0, 0, 0 );

        var psGeometry = new PlaneGeometry(3,2,10);

        console.log(psGeometry.vertices);
        console.log(psGeometry.faces);
        /*psGeometry.vertices.push(
            new Vector3( -10,  10, 0 ),
            new Vector3( -10, -10, 0 ),
            new Vector3(  10, -10, 0 )
        );
        console.log(psGeometry.vertices);
        psGeometry.faces.push( new Face3( 22, 23, 24 ) );*/

        // randomize the vertex positions that make up the shape
        for (let i = 0; i < psGeometry.vertices.length; i++) {
            psGeometry.vertices[i].set(psGeometry.vertices[i].x + 0.1 * (Math.random() - 0.5), psGeometry.vertices[i].y + 0.1 * (Math.random() - 0.5), psGeometry.vertices[i].z + 0.1 * (Math.random() - 0.5));
        }

        var psPlane = new Mesh(psGeometry, new MeshBasicMaterial({color:0x0000ff, side:DoubleSide}));
        
        var cubeB = new Mesh( geometry, material );
        cubeB.position.set( -100, -100, 0 );
        
        //create a group and add the two cubes
        //These cubes can now be rotated / scaled etc as a group
        this.name = 'planet';
        //this.add( cubeA );
        this.add( psPlane );
        this.add( cubeB );

    }
}

export default Planet;
