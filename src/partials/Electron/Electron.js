import * as THREE from 'three';

export default class Electron {
    constructor(position, index) {
        this.position = position;
        this.index = index;
    }
    init() {
        let electronGeometry = new THREE.SphereGeometry(0.45, 10, 10);
        let electronMaterial = new THREE.MeshPhongMaterial(
            {
                color: 0xc4bcd6,
                emissive: 0xc4bcd6,
                specular: 0xc4bcd6,
                shininess: 50
            }
        );
        let electron = new THREE.Mesh(electronGeometry, electronMaterial);
        electron.position.set(this.position.x, this.position.y, this.position.z);
        electron.index = this.index;

        return electron;
    }
}
