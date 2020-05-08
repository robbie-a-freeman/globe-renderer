import { Group, BoxBufferGeometry, MeshBasicMaterial, Mesh, PlaneGeometry, DoubleSide, Vector2, Vector3, Face3 } from 'three';

class Planet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        var geometry = new BoxBufferGeometry( 1, 1, 1 );
        var material = new MeshBasicMaterial( {color: 0x00ff00} );
        
        //var cubeA = new Mesh( geometry, material );
        //cubeA.position.set( 0, 0, 0 );

        var psGeometry = new PlaneGeometry(3,2,0);

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

    getTextureCoords() {
        return this.mesh.geometry.faceVertexUvs[0];
    }

    getDetails(currentLevel, previousLevel) {
        let details = {}
        if (currentLevel > previousLevel) {
            details.vertices = [...this.mesh.geometry.vertices];
            details.faces = []; //[...this.mesh.geometry.faces];
            details.textureCoords = []
            console.log(details.vertices);
            console.log(details.faces);
            for (let i = 0; i < this.mesh.geometry.faces.length; i++) {
                let centerPoint = this.mesh.geometry.vertices[this.mesh.geometry.faces[i].a].clone().add(this.mesh.geometry.vertices[this.mesh.geometry.faces[i].b]).add(this.mesh.geometry.vertices[this.mesh.geometry.faces[i].c]).multiplyScalar(1/3);
                details.vertices.push(centerPoint);
                let face = this.mesh.geometry.faces[i];

                this.mesh.geometry.computeBoundingBox();
                var max = this.mesh.geometry.boundingBox.max,
                    min = this.mesh.geometry.boundingBox.min;
                var offset = new Vector2(0 - min.x, 0 - min.y);
                var range = new Vector2(max.x - min.x, max.y - min.y);

                // order of vertices?
                // NOTE: texture mapping ignores z
                let face1 = new Face3(face.a, face.b, details.vertices.length - 1); //details.faces.push(face1);
                var v1 = details.vertices[face1.a],  
                    v2 = details.vertices[face1.b], 
                    v3 = details.vertices[face1.c];
                details.faces.push(face1);// details.faces[i] = face1;
                details.textureCoords.push([
                    new Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
                    new Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
                    new Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
                ]);
                let face2 = new Face3(face.b, face.c, details.vertices.length - 1);
                var v1 = details.vertices[face2.a],  
                    v2 = details.vertices[face2.b], 
                    v3 = details.vertices[face2.c];
                details.faces.push(face2);
                details.textureCoords.push([
                    new Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
                    new Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
                    new Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
                ]);
                let face3 = new Face3(face.c, face.a, details.vertices.length - 1);
                var v1 = details.vertices[face3.a],  
                    v2 = details.vertices[face3.b], 
                    v3 = details.vertices[face3.c];
                details.faces.push(face3);
                details.textureCoords.push([
                    new Vector2((v1.x + offset.x)/range.x ,(v1.y + offset.y)/range.y),
                    new Vector2((v2.x + offset.x)/range.x ,(v2.y + offset.y)/range.y),
                    new Vector2((v3.x + offset.x)/range.x ,(v3.y + offset.y)/range.y)
                ]);
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
        this.mesh.geometry.elementsNeedUpdate = true;
    }

    updateTextureCoords(tcs) {
        this.mesh.geometry.faceVertexUvs[0] = tcs;
        this.mesh.geometry.uvsNeedUpdate = true;
    }

    toggleWireframe() {
        this.mesh.material.wireframe = !this.mesh.material.wireframe;
    }
}

export default Planet;
