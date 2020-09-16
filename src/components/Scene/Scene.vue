<template>
    <section class="wapper">
        <section class="scene" ref="scene"></section>
        <ul class="content content__1">
            <li>Умный город</li>
            <li>Цифровые решения<br/>коммунальной инфраструктуры</li>
            <li>Цифровые туристические<br/>сервисы</li>
        </ul>
        <ul class="content content__2">
            <li>- Выстраивает диалог между муниципальной властью, населением и бизнесом</li>
            <li>- Подготавливает муниципалитет к новым требованиям организации управления</li>
            <li>- Повышает эффективность работы муниципальных служб</li>
            <li>- Предоставляет каждому жителю возможность влиять на вопросы городского развития</li>
            <li>- Повышает туристическую привлекательность города и региона</li>
        </ul>
    </section>
</template>

<script>
import * as THREE from 'three';
import { TweenMax } from 'gsap';
import Draggable from 'gsap/Draggable'
import ThrowPropsPlugin from '@/assets/js/gsap/bonus-files-for-npm-users/ThrowPropsPlugin'
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ParticlesOrbit from '@/partials/ParticlesOrbit/ParticlesOrbit';
import Electron from '@/partials/Electron/Electron';
const OrbitControls = require('three-orbitcontrols');

export default {
    name: 'Scene',
    data() {
        return {
            container: null,
            camera: null,
            controls: null,
            scene: null,
            renderer: null,
            start: null,
            settings: {
                x: 0,
                y: 1,
                z: 30
            },
            el: {
                x: 0,
                y: 0,
                z: 0
            },
            orbits: [
                {
                    context: null,
                    radius: 12.4,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.2, 0, -0.12),
                    particlesCount: 10000,
                    seed: 0.25,
                    size: Math.random() * 0.2
                },
                {
                    context: null,
                    radius: 12.4,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.25 , 0, 0.52),
                    particlesCount: 10000,
                    seed: 0.25,
                    size: Math.random() * 0.2
                },
                {
                    context: null,
                    radius: 12.4,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.2, 0, -0.7),
                    particlesCount: 10000,
                    seed: 0.25,
                    size: Math.random() * 0.2
                }
            ],
            orbit: null,
            models: [],
            electrons: [
                {
                    position: new THREE.Vector3(-9.4, 7.7, 2.2),
                },
                {
                    position: new THREE.Vector3(-12.4, 1.2, 1),
                },
                {
                    position: new THREE.Vector3(-11, -6.3, -1.1),
                },
                {
                    position: new THREE.Vector3(10.8, 6.4, -0.5),
                },
                {
                    position: new THREE.Vector3(12.4, -1.6, 0),
                },
                {
                    position: new THREE.Vector3(9.5, -8.2, 0),
                }
            ],
            sprites: [
                {
                    position: new THREE.Vector3(0, 2, 0),
                },
                {
                    position: new THREE.Vector3(0, 2, 0),
                },
                {
                    position: new THREE.Vector3(0, 2, 0),
                },
                {
                    position: new THREE.Vector3(0, 2, 0),
                },
                {
                    position: new THREE.Vector3(0, 2, 0),
                },
                {
                    position: new THREE.Vector3(0, 2, 0),
                }
            ],
            intersectedElectrons: [],
            raycaster: null,
            mouse: null,
            vector: new THREE.Vector3(0, 0, 0),
            vectors: [
                {
                    vector: new THREE.Vector3(-4, 5.7, 22) // 22 - old zoom
                },
                {
                    vector: new THREE.Vector3(-12, 2.2, 22)
                },
                {
                    vector: new THREE.Vector3(-5, -4.7, 22)
                },
                {
                    vector: new THREE.Vector3(4, 5.7, 22)
                },
                {
                    vector: new THREE.Vector3(12, -0.5, 22)
                },
                {
                    vector: new THREE.Vector3(4.6, -5.7, 22)
                },
                {
                    vector: new THREE.Vector3(0, 0, 30)
                }
            ]
        }
    },
    methods: {
        init() {
            this.container = this.$refs.scene;
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.TextureLoader().load('textures/bg.jpg');
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            this.start = Date.now();

            this.createCamera();
            //this.createControls();
            this.createLights();
            this.createRenderer();
            this.createObject();
            //this.createSettings();
            this.createDraggable();

            this.renderer.setAnimationLoop(() => { 
                //this.update();
                this.render();
            })
            window.addEventListener( 'resize', this.resizeWindowHandler, false );
            window.addEventListener('click', this.mouseClickHandler, false);
            //window.addEventListener('mousemove', this.mouseMoveHandler, false);
        },
        createCamera() {
            this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
            this.camera.position.set( 0, 0, 30 );
            // this.camera.lookAt(-15.75, 11.2, 5);
            // let helper = new THREE.CameraHelper( this.camera );
            // this.scene.add( helper );
        },
        createControls() {
            this.controls = new OrbitControls( this.camera, this.container );
            // this.controls.enableZoom = false;
            this.controls.enablePan = false;
            this.controls.autoRotate = false;
            this.controls.autoRotateSpeed = 1;
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.5;
        },
        createLights() {
            let spotLight = new THREE.SpotLight( 0xffffff, 1.1 );
            spotLight.position.set( 0, 50, 0 );
            spotLight.angle = Math.PI / 4;
            spotLight.penumbra = 0.05;
            spotLight.decay = 1;
            spotLight.distance = 200;

            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            spotLight.shadow.camera.near = 10;
            spotLight.shadow.camera.far = 200;
            this.scene.add(spotLight);

            let directionalLight = new THREE.DirectionalLight( 0xffffff, 1.01 );
            directionalLight.position.set(0, 0, 10);
            this.scene.add(directionalLight);
        },
        createRenderer() {
            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.container.appendChild( this.renderer.domElement );
        },
        createObject() {
            const loader = new GLTFLoader();
        
            var sizes = [4, 11, 26];

            for (let i = 0; i < 3; i++) {
                loader.load(
                    'models/particles/output_particles.glb',
                    ( gltf ) => {
                        let particleGeometry = new THREE.BufferGeometry();
                        particleGeometry.setAttribute('position', new THREE.BufferAttribute( gltf.scene.children[0].geometry.attributes.position.array, 3 ));
                        particleGeometry.setAttribute('normal', new THREE.BufferAttribute( gltf.scene.children[0].geometry.attributes.color.array, 3 ));
                        particleGeometry.setAttribute('customColor', new THREE.BufferAttribute( gltf.scene.children[0].geometry.attributes.color.array, 3 ));

                        let particleMaterial = new THREE.ShaderMaterial(
                            {
                                uniforms: {
                                    time: {
                                        type: 'f',
                                        value: 0.0
                                    },
                                    amplitude: {
                                        type: 'f',
                                        value: 0
                                    },
                                    color: {
                                        value: new THREE.Color( 0x6F8FB4 ) //#3F5E7D
                                    }
                                },
                                vertexShader: `
                                    vec3 mod289(vec3 x)
                                    {
                                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                                    }

                                    vec4 mod289(vec4 x)
                                    {
                                    return x - floor(x * (1.0 / 289.0)) * 289.0;
                                    }

                                    vec4 permute(vec4 x)
                                    {
                                    return mod289(((x*34.0)+1.0)*x);
                                    }

                                    vec4 taylorInvSqrt(vec4 r)
                                    {
                                    return 1.79284291400159 - 0.85373472095314 * r;
                                    }

                                    vec3 fade(vec3 t) {
                                    return t*t*t*(t*(t*6.0-15.0)+10.0);
                                    }

                                    // Classic Perlin noise
                                    float cnoise(vec3 P)
                                    {
                                    vec3 Pi0 = floor(P); // Integer part for indexing
                                    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
                                    Pi0 = mod289(Pi0);
                                    Pi1 = mod289(Pi1);
                                    vec3 Pf0 = fract(P); // Fractional part for interpolation
                                    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
                                    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
                                    vec4 iy = vec4(Pi0.yy, Pi1.yy);
                                    vec4 iz0 = Pi0.zzzz;
                                    vec4 iz1 = Pi1.zzzz;

                                    vec4 ixy = permute(permute(ix) + iy);
                                    vec4 ixy0 = permute(ixy + iz0);
                                    vec4 ixy1 = permute(ixy + iz1);

                                    vec4 gx0 = ixy0 * (1.0 / 7.0);
                                    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
                                    gx0 = fract(gx0);
                                    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
                                    vec4 sz0 = step(gz0, vec4(0.0));
                                    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
                                    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

                                    vec4 gx1 = ixy1 * (1.0 / 7.0);
                                    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
                                    gx1 = fract(gx1);
                                    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
                                    vec4 sz1 = step(gz1, vec4(0.0));
                                    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
                                    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

                                    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
                                    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
                                    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
                                    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
                                    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
                                    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
                                    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
                                    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

                                    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
                                    g000 *= norm0.x;
                                    g010 *= norm0.y;
                                    g100 *= norm0.z;
                                    g110 *= norm0.w;
                                    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
                                    g001 *= norm1.x;
                                    g011 *= norm1.y;
                                    g101 *= norm1.z;
                                    g111 *= norm1.w;

                                    float n000 = dot(g000, Pf0);
                                    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
                                    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
                                    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
                                    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
                                    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
                                    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
                                    float n111 = dot(g111, Pf1);

                                    vec3 fade_xyz = fade(Pf0);
                                    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
                                    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
                                    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
                                    return 2.2 * n_xyz;
                                    }

                                    // Classic Perlin noise, periodic variant
                                    float pnoise(vec3 P, vec3 rep)
                                    {
                                    vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
                                    vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
                                    Pi0 = mod289(Pi0);
                                    Pi1 = mod289(Pi1);
                                    vec3 Pf0 = fract(P); // Fractional part for interpolation
                                    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
                                    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
                                    vec4 iy = vec4(Pi0.yy, Pi1.yy);
                                    vec4 iz0 = Pi0.zzzz;
                                    vec4 iz1 = Pi1.zzzz;

                                    vec4 ixy = permute(permute(ix) + iy);
                                    vec4 ixy0 = permute(ixy + iz0);
                                    vec4 ixy1 = permute(ixy + iz1);

                                    vec4 gx0 = ixy0 * (1.0 / 7.0);
                                    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
                                    gx0 = fract(gx0);
                                    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
                                    vec4 sz0 = step(gz0, vec4(0.0));
                                    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
                                    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

                                    vec4 gx1 = ixy1 * (1.0 / 7.0);
                                    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
                                    gx1 = fract(gx1);
                                    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
                                    vec4 sz1 = step(gz1, vec4(0.0));
                                    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
                                    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

                                    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
                                    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
                                    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
                                    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
                                    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
                                    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
                                    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
                                    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

                                    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
                                    g000 *= norm0.x;
                                    g010 *= norm0.y;
                                    g100 *= norm0.z;
                                    g110 *= norm0.w;
                                    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
                                    g001 *= norm1.x;
                                    g011 *= norm1.y;
                                    g101 *= norm1.z;
                                    g111 *= norm1.w;

                                    float n000 = dot(g000, Pf0);
                                    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
                                    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
                                    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
                                    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
                                    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
                                    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
                                    float n111 = dot(g111, Pf1);

                                    vec3 fade_xyz = fade(Pf0);
                                    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
                                    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
                                    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
                                    return 2.2 * n_xyz;
                                    }

                                    uniform float time;

                                    varying vec2 vUv;
                                    varying vec3 vPosition;
                                    varying vec3 vColor;
                                    varying float noise;
                                    varying vec3 vNormal;
                                    attribute vec3 customColor;
                                   

                                    float turbulence( vec3 p ) {
                                    float w = 100.0;
                                    float t = -.5;
                                    for (float f = 1.0 ; f <= 10.0 ; f++ ){
                                        float power = pow( 2.0, f );
                                        t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
                                    }
                                    return t;
                                    }

                                    void main() {

                                        vUv = uv;
                                        vPosition = position;
                                        vNormal = normal;
                                        vColor = customColor;

                                        float newScale = 0.00125* 100.;

                                        noise = 50.0 *  -.10 * turbulence( .5 * normal + time );
                                        float b = 5.0 * pnoise( 0.05 * position + vec3( 2.0 * time ), vec3( 100.0 ) );
                                        float displacement = - noise + b;

                                        vec3 newPosition = position + normal * (displacement * 0.005);

                                        gl_PointSize = 1.0;

                                        //vec3 newPosition = vec3(position.x, position.y, position.z);
                                        
                                        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
                                        //gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );

                                        // vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

                                        // gl_PointSize = newScale * ( 1.0 / - mvPosition.z );
                                     
                                        // gl_Position = projectionMatrix * mvPosition;

                                    }
                                `,
                                fragmentShader: `
                                    uniform float time;
                                    varying vec3 vPosition;
                                    varying vec2 vUv;
                                    varying vec3 vColor;
                                    varying vec3 vNormal;
                                    void main() {
                                       
                                        //if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
                                        gl_FragColor = vec4( vColor, 1.0 );

                                    }
                                `,
                                transparent: true
                            }
                        );

                        let particles = new THREE.Points( particleGeometry, particleMaterial );
                        particles.scale.set(sizes[i], sizes[i], sizes[i]);
                        this.models.push(particles);
                    
                        this.scene.add(particles);
                    }
                );
            }
            
            loader.load(
                'models/logo/logo.glb',
                (gltf) => {
                    let logoMaterial = new THREE.MeshPhongMaterial(
                        {
                            color: 0xc4bcd6,
                            emissive: 0x111111,
                            specular: 0xc4bcd6,
                            shininess: 50
                        }
                    );
                    gltf.scene.children[0].material = logoMaterial;
                    gltf.scene.rotation.x = Math.PI / 2;
                    gltf.scene.scale.set(1.65, 1.65, 1.65);
                    this.scene.add(gltf.scene);
                }
            );

            this.orbits.forEach((item) => {
                let orbitInstance = new ParticlesOrbit(item.radius, item.position, new THREE.Vector3(), item.particlesCount, item.size, item.seed);
                let orbit = orbitInstance.init();

                item.context = orbit;

                let group = new THREE.Group();
                group.rotation.setFromVector3(item.rotation);
                group.add(orbit);

                this.scene.add(group);
            });

            this.electrons.forEach((item, index) => {
                let electronInstance = new Electron(item.position, index);
                let electron = electronInstance.init();

                let intersectGeometry = new THREE.SphereGeometry(1.5, 10, 10);
                let intersectMaterial = new THREE.MeshBasicMaterial(
                    {
                        color: 0x00ff33,
                        visible: false
                    }
                );
                let intersect = new THREE.Mesh(intersectGeometry, intersectMaterial);
                intersect.index = index

                this.intersectedElectrons.unshift(intersect);

                

                //this.intersectedElectrons.push(electron);

                let spriteMap = new THREE.TextureLoader().load(`textures/text/sprite-${index+1}.png`);
                let spriteMaterial = new THREE.SpriteMaterial({ map: spriteMap, depthWrite: false });
                let sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(10, 2.5, 10);

                sprite.position.x = this.sprites[index].position.x;
                sprite.position.y = this.sprites[index].position.y;
                sprite.position.z = this.sprites[index].position.z;

                let group = new THREE.Group();
                group.add(electron);
                group.add(sprite);
                group.add(intersect);
                
                group.position.x = this.electrons[index].position.x;
                group.position.y = this.electrons[index].position.y;
                group.position.z = this.electrons[index].position.z;
                
                this.scene.add(group);

                // this.scene.add(sprite);

                // this.scene.add(electron);
            });

            let planeGeometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
            let planeMaterial = new THREE.MeshBasicMaterial( {color: 0x11ffaa, visible: false} );
            let plane = new THREE.Mesh( planeGeometry, planeMaterial );
            plane.index = 6;
            plane.position.set(0, 0, -1);

            this.intersectedElectrons.push(plane);

            this.scene.add(plane);
        },
        createSettings() {
            const gui = new dat.GUI();
            gui.add(this.settings, 'x', -30, 30, 0.1);
            gui.add(this.settings, 'y', -30, 30, 0.1);
            gui.add(this.settings, 'z', -30, 30, 0.1);
        },
        createDraggable() {
            const _this = this;
            let scale = 0.00035;
            let lastX = 0;
            let lastY = 0;
            let meshX = 0;
            let meshY = 0;

            new Draggable(document.createElement("div"), {
                onDrag: dragAction,
                onThrowUpdate: dragAction,
                trigger: this.renderer.domElement,
                throwProps: true,
                throwResistance: 0.1
            });

            function dragAction() {
                let x = this.x;
                let y = this.y;

                let dx = x - lastX;
                let dy = y - lastY;

                lastX = x;
                lastY = y;

                meshX += dx;
                meshY += dy;

                _this.models[0].rotation.x = meshY * scale;
                _this.models[0].rotation.y = meshX * scale;

                _this.models[1].rotation.x = meshY * scale;
                _this.models[1].rotation.y = meshX * scale;

                _this.models[2].rotation.x = meshY * scale;
                _this.models[2].rotation.y = meshX * scale;
            }
        },
        update() {
            this.controls.update();
        },
        render() {
            this.renderer.render( this.scene, this.camera );

            // this.camera.position.x = this.settings.x;
            // this.camera.position.y = this.settings.y;
            // this.camera.position.z = this.settings.z;

            this.orbits[0].context.rotation.y += 0.001;
            this.orbits[1].context.rotation.y -= 0.001;
            this.orbits[2].context.rotation.y -= 0.001;

            if (this.models.length > 0) {
                this.models[0].rotation.y += 0.0001;
                this.models[1].rotation.y += 0.0001;
                this.models[2].rotation.y += 0.0001;

                this.models[0].material.uniforms.time.value = .0001 * ( Date.now() - this.start );
                this.models[1].material.uniforms.time.value = .0001 * ( Date.now() - this.start );
                this.models[2].material.uniforms.time.value = .0001 * ( Date.now() - this.start );
            }
        },
        resizeWindowHandler() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        },
        mouseMoveHandler(event) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            // this.raycaster.setFromCamera(this.mouse, this.camera);
            // let intersects = this.raycaster.intersectObjects(this.intersectedPlanes, true);
            //
            // if (intersects.length > 0) {
            //     // this.orbits[0].material.uniforms.mousePosition.value = intersects[0].point;
            // }
        },
        mouseClickHandler(event) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            let intersects = this.raycaster.intersectObjects(this.intersectedElectrons, true);

            if (intersects.length > 0) {
                //console.log(intersects[0].object.index);

                TweenMax.to(this.camera.position, 0.8,
                    {
                        x: this.vectors[intersects[0].object.index].vector.x,
                        y: this.vectors[intersects[0].object.index].vector.y,
                        z: this.vectors[intersects[0].object.index].vector.z,
                        ease: 'sine.inOut',
                        onUpdate: () => {
                            //this.camera.updateProjectionMatrix();
                        },
                        onComplete: () => {

                            if (intersects[0].object.index == 0 && intersects[0].object.index != 6) {
                                console.log('animate')
                                TweenMax.staggerTo(document.querySelectorAll('.content li'), 0.8, {
                                    opacity: 1
                                }, 0.1)
                            }

                            
                        }
                    }
                )

                if (intersects[0].object.index == 6 ) {
                    TweenMax.staggerTo(document.querySelectorAll('.content li'), 0.1, {
                        opacity: 0
                    }, 0.05)
                }
            }
        }
    },
    mounted() {
        this.init();

        console.log(ThrowPropsPlugin);
    }
}
</script>

<style>
.scene {
    opacity: 1;
    /* position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5; */
}

.content {
    list-style: none;
    position: absolute;
    top: 0;
    z-index: 10;
    opacity: 1;
    pointer-events: none;
}

.content li {
    opacity: 0;
}

.content__1 {
    top: 360px;
    left: 240px;
}

.content__1 li {
    text-align: right;
}

.content__2 {
    left: 780px;
    top: 170px;
}

.content__2 li {
    text-align: left;
}

.content li {
    margin: 15px 0;
    font-size: 12px;
    color: #fff;
}

canvas {
    cursor: pointer !important;
}
</style>
