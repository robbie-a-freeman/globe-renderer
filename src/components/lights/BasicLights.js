import { Group, AmbientLight, PointLight, MeshBasicMaterial, SphereBufferGeometry, Mesh } from 'three';

class BasicLights extends Group {
    constructor(...args) {
        // Invoke parent Group() constructor with our args
        super(...args);

        const ambi = new AmbientLight(0xffffff, 0.5);
        const point = new PointLight(0xffffff, 1.32, 0, 2);

        point.position.set(100,0,0);

        // add 3D representation of the sun
        var sunGeometry = new SphereBufferGeometry(6, 10, 10);
        var sunMaterial = new MeshBasicMaterial({color:0xffffe0});
        var sun = new Mesh(sunGeometry, sunMaterial);
        sun.position.set(100,0,0);

        this.mesh = sun;


        this.add(ambi, point, sun);
    }
}

export default BasicLights;
