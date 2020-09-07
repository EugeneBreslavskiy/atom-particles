import * as THREE from 'three';

export default class AtomGroup {
    constructor(particleOrbit, intersectPlane) {
        this.particleOrbit = particleOrbit;
        this.intersectPlane = intersectPlane;
    }
    init() {
        let group = new THREE.Group();
        // group.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        group.add(this.particleOrbit, this.intersectPlane);

        // console.log(group);

        return group;
    }
}
