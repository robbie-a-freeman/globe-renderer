import * as Dat from 'dat.gui';
import { Scene, Color } from 'three'; //, MeshBasicMaterial, DoubleSide
import { Planet } from 'objects';
import { BasicLights } from 'lights';

class PlanetScene extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Init state
        this.state = {
            gui: new Dat.GUI( { autoPlace: true }), // Create GUI for scene
            wireframe: false,
            rotation: 2,
            thresholds: 5,
            // texture: none,
            updateList: [],
        };

        var rotation = 2;

        // Set background to space-black
        this.background = new Color(0x343435);

        // Add meshes to scene
        const planet = new Planet();
        const lights = new BasicLights();
        this.planet = planet;
        this.add(this.planet, lights);

        let showWireframe = function(flag) {
            planet.mesh.material.wireframe = flag;
        }

        let updateRotation = function(speed) {
            rotation = speed;
        }

        // arbitrary number of layers of detail processing
        this.previousLevel = 0;

        // determine arbitrary levels of details

        let distances = [];
        this.distances = distances;
        let updateThresholds = function (thr) {
            let startDist = 10;
            for (let i = 0; i < thr; i++) {
                distances.push(startDist / Math.pow(2, i) + 1);
            }
        }
        updateThresholds(5);

        let dummyFunc = function() {
            console.log();
        }

        // Populate GUI
        this.state.gui.add(this.state, 'wireframe').onChange(showWireframe);
        this.state.gui.add(this.state, 'rotation', -10, 10, 1).onChange(updateRotation);
        this.state.gui.add(this.state, 'thresholds', 1, 25, 1).onChange(updateThresholds);
        //this.state.gui.add(this.planet, 'loadTexture').name('Linterp'); 
        let folder = this.state.gui.addFolder('Noise generation');
        folder.add(this.planet, 'switchNoiseFuncLinterp').name('Linterp'); 
        folder.add(this.planet, 'switchNoiseFuncPerlin').name('Perlin');
        folder.add(this.planet, 'switchNoiseFuncBrownian').name('Brownian');
        folder.add(this.planet, 'switchNoiseFuncRandom').name('Random');
        
        // set up processedDetails list
        this.processedDetails = [];
        let initialDetails = {};
        this.processedDetails.push(initialDetails);
        for (let i = 1; i < this.NUMBER_OF_LAYERS; i++) {
            this.processedDetails.push({});
        }

    }

    addToUpdateList(object) {
        this.state.updateList.push(object);
    }

/* //handles rotation
    update(timeStamp) {
        const { rotationSpeed, updateList } = this.state;
        this.rotation.y = (rotationSpeed * timeStamp) / 10000;

        // Call update for each object in the updateList
        for (const obj of updateList) {
            obj.update(timeStamp);
        }

        
    } */ 

    // checks if more/less detail is to be rendered
    // assumes the position of planet is 0,0,0
    update(camera) {
        // distance of camera from the object
        let distance = camera.position.length();
        //console.log(distance);
        // check if new details need to be rendered. if not, return
        for (let i = 0; i < this.state.thresholds; i++) {
            if (distance > this.distances[i] || i == this.state.thresholds - 1) {
                console.log('layer', i);
                //console.log('processedDetails', this.processedDetails[i]);
                if (isEmpty(this.processedDetails[i])) {
                    this.processedDetails[i] = this.planet.getDetails(i);
                }
                //console.log('processedDetails', this.processedDetails[i]);
                this.planet.mesh.geometry = this.processedDetails[i];
                this.previousLevel = i;
                break;
            }
        }
        
        // rotate the planet
        this.planet.mesh.rotation.y += 0.001 * this.state.rotation;
    }

    
}

export default PlanetScene;


// helper function to check if object is empty
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}