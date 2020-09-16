import * as THREE from 'three';

export default class ParticlesOrbit {
    constructor(radius, position, rotation, count, size, seed) {
        this.radius = radius;
        this.position = position;
        this.rotation = rotation;
        this.count = count;
        this.size = size;
        this.seed = seed;
    }
    init() {
        let vertices = [];
        let scales = [];
        for (let i = 0; i < this.count; i++) {
            let angle = (i / this.count) * (Math.PI * 2);
            let x = Math.cos(angle) * this.radius;
            let y = Math.sin(this.seed) * (Math.random() - 0.5) * 1.0;
            let z = Math.sin(angle) * this.radius;
            vertices.push(x, y, z);
            scales.push(this.size * 0.5);
        }

        let particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ));
        particleGeometry.setAttribute('scale', new THREE.Float32BufferAttribute( scales, 1 ));

        let particleMaterial = new THREE.ShaderMaterial(
            {
                uniforms: {
                    time: {
                        type: 'f',
                        value: 0
                    },
                    amplitude: {
                        type: 'f',
                        value: 0
                    },
                    color: {
                        value: new THREE.Color( 0x6F8FB4 ) //#3F5E7D
                    },
                    mousePosition: {
                        type: 'v3',
                        value: new THREE.Vector3(100, 100, 100)
                    }
                },
                vertexShader: `
                    uniform float amplitude;
                    uniform vec3 mousePosition;
                    uniform float time;

                    varying vec2 vUv;
                    varying vec3 vPosition;

                    attribute float scale;

                    void main() {
                        vUv = uv;
                        vPosition = position;
                        float newScale = scale* 3.;
                      
                        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                        // gl_PointSize = newScale * ( 300.0 / - mvPosition.z );
                        gl_PointSize = newScale * ( 300.0 / - mvPosition.z );
                        gl_Position = projectionMatrix * mvPosition;
                    }
               `,
                fragmentShader: `
                    uniform vec3 color;
                    uniform vec3 mousePosition;
                    varying vec3 vPosition;
                    varying vec2 vUv;

                    void main() {
                        float distance = 2.0;
                        vec3 newColor = color;
                        vec3 color1 = vec3(0.1, 0.95, 0.95);
                        vec3 color2 = vec3(0.5, 0.7, 0.9);
                       
                        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                        gl_FragColor = vec4( newColor, 1.0 );
                    }
               `,
                transparent: true
            }
        );

        //let particleMaterial = new THREE.PointsMaterial(
        //    {
        //        size: 0.155,
        //        color: 0x6CACE4,
        //        map: new THREE.TextureLoader().load('textures/disc.png'),
        //        transparent: true,
        //        alphaTest: 0.5
        //    }
        //);

        let particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.name = 'orbit';
        particles.position.set(0, 0, 0);
        particles.rotation.setFromVector3(this.rotation);

        return particles;
    }

}
