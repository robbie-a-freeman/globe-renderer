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
            psGeometry.vertices[i].set(psGeometry.vertices[i].x + 1 * (Math.random() - 0.5), psGeometry.vertices[i].y + 1 * (Math.random() - 0.5), psGeometry.vertices[i].z + 1 * (Math.random() - 0.5));
        }

        var psPlane = new Mesh(psGeometry, new MeshBasicMaterial({color:0x0000ff, side:DoubleSide}));
        psPlane.material.wireframe = true;
        this.mesh = psPlane;
        
        var cubeB = new Mesh( geometry, material );
        cubeB.position.set( -100, -100, 0 );
        
        //create a group and add the two cubes
        //These cubes can now be rotated / scaled etc as a group
        this.name = 'planet';
        //this.add( cubeA );
        this.add( psPlane );
        this.add( cubeB );

    }

    getVertices() {
        return this.mesh.geometry.vertices;
    }

    getFaces() {
        return this.mesh.geometry.faces;
    }

    getDetails(currentLevel, previousLevel) {
        let details = {}
        if (currentLevel > previousLevel) {
            details.vertices = [...this.mesh.geometry.vertices];
            details.faces = [...this.mesh.geometry.faces];
            console.log(details.vertices);
            console.log(details.faces);
            for (let i = 0; i < this.mesh.geometry.faces.length; i++) {
                let centerPoint = details.vertices[details.faces[i].a].clone().add(details.vertices[details.faces[i].b]).add(details.vertices[details.faces[i].c]).multiplyScalar(1/3);
                details.vertices.push(centerPoint);
                let face = this.mesh.geometry.faces[i];

                // order of vertices?

                let face1 = new Face3(face.a, face.b, details.vertices.length - 1);
                //details.faces.push(face1);
                details.faces[i] = face1;
                let face2 = new Face3(face.b, face.c, details.vertices.length - 1);
                details.faces.push(face2);
                let face3 = new Face3(face.c, face.a, details.vertices.length - 1);
                details.faces.push(face3);
            }
        }
        return details;
    }

    updateVertices(vs) {
        this.mesh.geometry.vertices = vs;
        this.mesh.geometry.verticesNeedUpdate = true;
    }

    updateFaces(fs) {
        this.mesh.geometry.faces = fs;
    }

    toggleWireframe() {
        this.mesh.material.wireframe = !this.mesh.material.wireframe;
    }
}

export default Planet;
