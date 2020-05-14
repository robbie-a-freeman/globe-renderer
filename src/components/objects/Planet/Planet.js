import { Group, BoxBufferGeometry, TextureLoader, MeshBasicMaterial, MeshLambertMaterial, Mesh, DoubleSide, Vector2, Vector3, Face3, SphereBufferGeometry } from 'three';

class Planet extends Group {
    constructor() {
        // Call parent Group() constructor
        super();

        //var geometry = new BoxBufferGeometry( 1, 1, 1 );
        //var material = new MeshBasicMaterial( {color: 0x00ff00} );
        
        //var cubeA = new Mesh( geometry, material );
        //cubeA.position.set( 0, 0, 0 );

        var psGeometry = new SphereBufferGeometry(2,10,10);
        // randomize the vertex positions that make up the shape
        /*for (let i = 0; i < psGeometry.vertices.length; i++) {
            psGeometry.vertices[i].set(psGeometry.vertices[i].x + 1 * (Math.random() - 0.5), psGeometry.vertices[i].y + 1 * (Math.random() - 0.5), psGeometry.vertices[i].z + 1 * (Math.random() - 0.5));
        } */
        
        var texture = new TextureLoader().load('earth.jpg');
        var psMaterial = new MeshLambertMaterial( { map: texture } ); 

        psMaterial.aoMapIntensity = 0;

        var psSphere = new Mesh(psGeometry, psMaterial);  //, side:DoubleSide
        psSphere.material.wireframe = false;
        this.mesh = psSphere;
        
        //create a group and add the two cubes
        //These cubes can now be rotated / scaled etc as a group
        this.name = 'planet';
        //this.add( cubeA );
        this.add( psSphere );

        
        // begin copied portion from https://stackoverflow.com/a/15048260
        /*
        Returns a random point of a sphere, evenly distributed over the sphere.
        The sphere is centered at (x0,y0,z0) with the passed in radius.
        The returned point is returned as a three element array [x,y,z]. 
        */
        function randomSpherePoint(x0,y0,z0,radius){
            var u = Math.random();
            var v = Math.random();
            var theta = 2 * Math.PI * u;
            var phi = Math.acos(2 * v - 1);
            var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
            var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
            var z = z0 + (radius * Math.cos(phi));
            return [x,y,z];
        }
        // end copied portion

        // simulate stars
        let num_stars = 400
        let stars_radius = 100
        for (let i = 0; i < num_stars; i++) {
            let size = Math.random() * 0.25 + 0.25;
            let star_geo = new BoxBufferGeometry( size, size, size );
            let star_mat = new MeshBasicMaterial( {color: 0xffffff} );
            var star = new Mesh(star_geo, star_mat);
            let point = randomSpherePoint(0,0,0, stars_radius);
            star.position.set(point[0], point[1], point[2]);
            this.add(star);
        }

        this.noiseFunc = this.linterp;

    }

    // switch to noise func with number func
    switchNoiseFuncLinterp() {
        this.noiseFunc = this.linterp;
    }
    switchNoiseFuncPerlin() {
        this.noiseFunc = this.perlin;
    }
    switchNoiseFuncBrownian() {
        this.noiseFunc = this.brownian;
    }
    switchNoiseFuncRandom() {
        this.noiseFunc = this.random;
    }


    // generates details for Planet mesh. uses the given noise function
    // to generate noise at the next level.
    // Assumes the previous level is the current level.
    getDetails(newLevel) {
        //let details = {}
        let triangleLevel = 10 * newLevel + 10;
        //details.push(new SphereBufferGeometry(2, triangleLevel, triangleLevel));
        return new SphereBufferGeometry(2, triangleLevel, triangleLevel);
    }

    linterp() {

    }

    perlin() {

    }

    brownian() {

    }

    random() {

    }
}

export default Planet;
