import * as Dat from 'dat.gui';
import { Scene, Color } from 'three';
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
            updateList: [],
        };

        // Set background to a nice color
        this.background = new Color(0x7ec0ee);

        // Add meshes to scene
        const planet = new Planet();
        const lights = new BasicLights();
        this.add(planet, lights);

        // Populate GUI
        this.state.gui.add(this.state, 'rotationSpeed', -5, 5);
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
        let processedDetails = []

        // determine arbitrary levels of details

        // check if new details need to be rendered. if not, return
            // if so, check if next level/location of mesh is created
                // if not, generate this by:
                // - generating new vertices and faces
                // - saving indices of new vertices and faces
                // - save indices object to processedDetails
            // apply linterp to mesh geo

        
    }
}

export default PlanetScene;
