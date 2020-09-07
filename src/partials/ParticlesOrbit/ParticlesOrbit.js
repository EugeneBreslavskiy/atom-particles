import * as THREE from 'three';

export default class ParticlesOrbit {
    constructor(radius, count, uniforms) {
        this.radius = radius;
        this.count = count;
        this.uniforms = uniforms;
        this.seed = 0.15;
    }
    init() {
        let group = new THREE.Group();
        // group.rotation.x = Math.PI / 2;
        let vertices = [];
        let scales = [];
        for (let i = 0; i < this.count; i++) {
            let x = Math.cos(i) * this.radius;
            let y = Math.sin(this.seed) * (Math.random() - 0.5);
            let z = Math.sin(i) * this.radius;
            vertices.push(x, y, z);
            scales.push(Math.random());
        }

        let planeGeometry = new THREE.PlaneGeometry(45, 45, 1, 1);
        let planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            visible: true,
            transparent: true,
            opacity: 0.1
        });
        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = Math.PI / 2;
        // plane.updateMatrix();
        // plane.geometry.applyMatrix( plane.matrix );
        // plane.matrix.identity();

        let torusGeometry = new THREE.TorusBufferGeometry( this.radius, 0.1, 30, 200 );
        // torusGeometry.computeBoundingBox();
        let torusMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true, visible: true } );
        let torus = new THREE.Mesh( torusGeometry, torusMaterial );

        torus.rotation.x = Math.PI / 2;
        torus.matrixWorldNeedsUpdate = true;
        torus.geometry.attributes.position.dynamic = true;

        // torus.updateMatrix();

        // torus.geometry.applyMatrix( torus.matrix );
        // torus.matrix.identity();
        // console.log(torusGeometry);

        let particleGeometry = new THREE.BufferGeometry();
        // particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ));
        particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute( torusGeometry.attributes.position.array, 3 ));
        // particleGeometry.attributes.position.needsUpdate = true;
        // particleGeometry.dinamic = true;
        // particleGeometry.setAttribute( 'scale', new THREE.Float32BufferAttribute( scales, 1 ) );
        // particleGeometry.computeBoundingBox();
        //console.log(particleGeometry);

        let particleMaterial = new THREE.ShaderMaterial(
            {
                uniforms: {
                    time: {
                        type: 'f',
                        value: this.uniforms.time.value
                    },
                    amplitude: {
                        type: 'f',
                        value: 0
                    },
                    color: {
                        value: new THREE.Color( 0x6CACE4 )
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
                    // attribute float scale;

                    void main() {
                        vUv = uv;
                        vPosition = position;
                        float distance = 2.0;
                        // float newScale = scale;

                        // if (length( mousePosition - position ) < distance ) {
                        //     newScale = newScale * 2.0;
                        // }

                        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

                        // gl_PointSize = newScale * ( 300.0 / - mvPosition.z );
                        
                        gl_PointSize = 1.0 * ( 300.0 / - mvPosition.z );

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

                        if (length( mousePosition - vPosition ) < distance ) {
                            newColor = vec3(1.0, 0.5, 0.25);
                        }

                        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

                        gl_FragColor = vec4( newColor, 1.0 );

                    }
               `,
                transparent: true
            }
        );
        //let particleMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        let particles = new THREE.Points(particleGeometry, particleMaterial);
        // particles.rotation.x = Math.PI / 2;
        particles.position.set(0, 0, 0);


        //
        group.add(particles, torus, plane);

        return group;

        // return particles;
    }

}
