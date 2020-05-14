import { Group, AmbientLight, PointLight } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const ambi = new AmbientLight(0xffffff, 1.32);
        const point = new PointLight(0xffffff, 4, 0, 2);

        point.position.set(100,0,0);
        
        this.add(ambi, point);
    }
}

export default BasicLights;
