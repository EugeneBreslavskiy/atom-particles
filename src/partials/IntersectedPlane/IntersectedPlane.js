import * as THREE from 'three';

export default class IntersectedPlane {
    constructor(index) {
        this.index = index;
        this.width = 45;
        this.height = 45;
        this.segments = 1;
        this.color = 0xffffff
        this.opacity = 0.1;
        this.rotation = Math.PI / 2;
    }
    init() {
        let planeGeometry = new THREE.PlaneGeometry(this.width, this.height, this.segments, this.segments);
        let planeMaterial = new THREE.MeshBasicMaterial({
            color: this.color,
            side: THREE.DoubleSide,
            visible: true,
            transparent: true,
            opacity: this.opacity
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.set(this.rotation, 0, 0);
        plane.index = this.index;
        plane.position.set(0, 0, 0);

        return plane;
    }
}
