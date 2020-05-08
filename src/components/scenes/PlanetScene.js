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
            gui: new Dat.GUI(), // Create GUI for scene
            rotationSpeed: 0,
            wireframe: false,
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const planet = new Planet();
        const lights = new BasicLights();
        this.planet = planet;
        this.add(this.planet, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
        this.state.gui.add(this.state, 'wireframe');
        
        // arbitrary number of layers of detail processing
        this.NUMBER_OF_LAYERS = 5;
        this.previousLevel = 0;

        // determine arbitrary levels of details
        this.distances = [];
        let startDist = 10;
        for (let i = 0; i < this.NUMBER_OF_LAYERS; i++) {
            this.distances.push(startDist / Math.pow(2, i));
        }
        // set up processedDetails list
        this.processedDetails = [];
        let initialDetails = {};
        initialDetails.vertices = this.planet.getVertices();
        console.log(initialDetails.vertices);
        initialDetails.faces = this.planet.getFaces();
        initialDetails.textureCoords = this.planet.getTextureCoords();
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
        for (let i = 0; i < this.NUMBER_OF_LAYERS; i++) {
            if (distance > this.distances[i] || i == this.NUMBER_OF_LAYERS - 1) {
                console.log('layer', i);
                //console.log('processedDetails', this.processedDetails[i]);
                if (isEmpty(this.processedDetails[i])) {

                    //this.planet.mesh.material = new MeshBasicMaterial({color:0x00ffff, side:DoubleSide}); this works

                    console.log('processing', i);
                    this.processedDetails[i] = this.planet.getDetails(i, this.previousLevel, this.processedDetails[i]);
                }
                //console.log('processedDetails', this.processedDetails[i]);
                this.planet.updateVertices(this.processedDetails[i].vertices);
                this.planet.updateFaces(this.processedDetails[i].faces);
                this.planet.updateTextureCoords(this.processedDetails[i].textureCoords);
                console.log(this.planet.mesh.geometry.vertices);
                this.previousLevel = i;
                break;
            }
        }
            // if so, check if next level/location of mesh is created
                // if not, generate this by:
                // - generating new vertices and faces
                // - saving indices of new vertices and faces
                // - save indices object to processedDetails
            // apply linterp to mesh geo

        
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