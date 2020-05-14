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

        var psSphere = new Mesh(psGeometry, psMaterial); //, side:DoubleSide
        psSphere.material.wireframe = false;
        this.mesh = psSphere;
        
        // randomize the vertex positions that make up the shape
        //this.shufflePoints();
        //this.generateOffsets();
        
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
        //return new SphereBufferGeometry(2, triangleLevel, triangleLevel);
        let oldSphere = this.mesh.geometry;
        let newSphere = new SphereBufferGeometry(2, triangleLevel, triangleLevel);
        let newPositions = newSphere.getAttribute("position");

        let vertexInSphere = function(s, v) {
            let positions = s.getAttribute("position");
            let EPS = 0.000001;
            for (let i = 0; i < positions.count; i++) {
                if (v.x < positions.getX(i) + EPS && v.x > positions.getX(i) - EPS &&
                    v.y < positions.getY(i) + EPS && v.y > positions.getY(i) - EPS &&
                    v.z < positions.getZ(i) + EPS && v.z > positions.getZ(i) - EPS) {
                    return true;
                }
            }
            return false;
        }

        // shift the new positions to match the old positions, vertex by vertex
        oldSphere.computeVertexNormals();
        //oldSphere.computeBoundingBox();
        newSphere.computeVertexNormals();
        for (let i = 0; i < newPositions.count; i++) {
            let vertex = new Vector3(newPositions.getX(i), newPositions.getY(i), newPositions.getZ(i));
            let vertexIsInSphere = vertexInSphere(oldSphere, vertex);
            if (!vertexIsInSphere) {
                vertex = this.noiseFunc(vertex, oldSphere, newLevel);
                newPositions.setX(i, vertex.x);
                newPositions.setY(i, vertex.y);
                newPositions.setZ(i, vertex.z);
            }
        }
        newSphere.setAttribute("position", newPositions);
        this.mesh.geometry.getAttribute("position").needsUpdate = true;
        return newSphere;
    }

    // adds random noise in geometry of sphere
    generateOffsets(sphere) {
        /*console.log(this.mesh.geometry.attributes.position.version);
        let positions = this.mesh.geometry.getAttribute("position");
        for (let i = 0; i < positions.count; i++) {
            //this.mesh.geometry.attributes.position.array[i] = this.mesh.geometry.attributes.position.array[i] + Math.random() * 100;
            //positions.setXYZ( i, positions.array[i * 3] + Math.random(), positions.array[i * 3 + 1] + Math.random(), positions.array[i * 3 + 2] + Math.random() ); 
            positions.setXYZ( i, 100., 0., 0. );
        }
        this.mesh.geometry.setAttribute("position", positions);
        this.mesh.geometry.getAttribute("position").needsUpdate = true;
        console.log(this.mesh.geometry.attributes);
        console.log(this.mesh.geometry.attributes.position.version); */

        let positions = this.mesh.geometry.getAttribute("position");
        let offsets = [positions.count * 3];
        for (let i = 0; i < offsets.length; i++) {
            //this.mesh.geometry.attributes.position.array[i] = this.mesh.geometry.attributes.position.array[i] + Math.random() * 100;
            //positions.setXYZ( i, positions.array[i * 3] + Math.random(), positions.array[i * 3 + 1] + Math.random(), positions.array[i * 3 + 2] + Math.random() ); 
            //positions.setXYZ( i, 100., 0., 0. );
            offsets[i] = Math.random() * 2 - 1;
        }
        this.mesh.geometry.setAttribute("offsets", offsets);
    }


    // Below are the noise functions. linterp is default

    linterp(v, oldSphere, lvl) {
        let newV = new Vector3(0,0,0);

        // find the closest vertices to v
        let neighbors = [];
        let center = new Vector3(0,0,0);
        let pos = oldSphere.getAttribute("position");
        let compare = function(e1, e2) {
            if (e1.lengthSq() > e2.lengthSq()) {
                return 1;
            } else if (e1.lengthSq() < e2.lengthSq()) {
                return -1;
            }
            return 0;
        };
        for (let i = 0; i < pos.count; i++) {
            let oldV = new Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
            neighbors.push(oldV);
            if (neighbors.length > 1) {
                neighbors.sort(compare);
            }
            if (neighbors.length > 20) { // saves computation
                neighbors.pop();
            }
        }

        // weight them by their distances to v, should add to 1
        let weights = [20];
        let sum = 0;
        for (let i = 0; i < neighbors.length; i++) {
            weights[i] = new Vector3().subVectors(v, neighbors[i]).length();
            sum = sum + weights[i];
        }
        for (let i = 0; i < neighbors.length; i++) {
            weights[i] = weights[i] / sum;
        }

        // average their weighted distances squared to the center
        let avgDist = 0;
        for (let i = 0; i < neighbors.length; i++) {
            avgDist = avgDist + new Vector3().subVectors(center, neighbors[i]).length() * weights[i];
        }
        avgDist = avgDist;

        // multiply by v's normal. assume center is 0,0,0
        for (let i = 0; i < neighbors.length; i++) {
            newV = v.clone().normalize();
            newV.multiplyScalar(avgDist);
        }

        return newV;
    }

    perlin(v, oldSphere, lvl) {
        // perform linterp
        let newV = this.linterp(v, oldSphere).clone();
        // generate vector
        let scale = 2 * lvl;
        let perlinVec = new Vector3((Math.random() - 0.5) * 0.1 / scale, (Math.random() - 0.5) * 0.1 / scale, (Math.random() - 0.5) * 0.1 / scale);
        // apply vector
        return newV.add(perlinVec);
    }

    brownian(v, oldSphere) {

    }

    // places a PlaneBufferGeometry object over the specified point with enhanced
    // coloring based on the surface below of the sphere.
    random(v, oldSphere, lvl) {
        if (lvl > 4) {
            
        }
    }
}

export default Planet;
