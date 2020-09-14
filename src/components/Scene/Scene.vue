<template>
    <section class="scene" ref="scene"></section>
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
                    radius: 12,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.15 , 0, 0),
                    particlesCount: 5000,
                    seed: 0.25,
                    size: Math.random() * 0.2
                },
                {
                    context: null,
                    radius: 12,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.2 , 0, 0.6),
                    particlesCount: 5000,
                    seed: 0.25,
                    size: Math.random() * 0.2
                },
                {
                    context: null,
                    radius: 12,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.2, 0, -0.6),
                    particlesCount: 5000,
                    seed: 0.25,
                    size: Math.random() * 0.2
                }
            ],
            orbit: null,
            model: null,
            electrons: [
                {
                    position: new THREE.Vector3(-10, 6.5, 2),
                },
                {
                    position: new THREE.Vector3(-12, 0, 0),
                },
                {
                    position: new THREE.Vector3(-9.5, -7.2, 2),
                },
                {
                    position: new THREE.Vector3(10, 6.5, 2),
                },
                {
                    position: new THREE.Vector3(12, 0, 0),
                },
                {
                    position: new THREE.Vector3(9.5, -7.2, 2),
                }
            ],
            intersectedElectrons: [],
            raycaster: null,
            mouse: null,
            vector: new THREE.Vector3(0, 0, 0),
            vectors: [
                {
                    vector: new THREE.Vector3(-3, 3, 24)
                },
                {
                    vector: new THREE.Vector3(-4, 1, 24)
                },
                {
                    vector: new THREE.Vector3(-3, -3.5, 24)
                },
                {
                    vector: new THREE.Vector3(2.5, 3.5, 24)
                },
                {
                    vector: new THREE.Vector3(4, 1, 24)
                },
                {
                    vector: new THREE.Vector3(3, -3.5, 24)
                },
                {
                    vector: new THREE.Vector3(0, 1, 30)
                }
            ]
        }
    },
    methods: {
        init() {
            this.container = this.$refs.scene;
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0x05041D );
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();

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

            console.log(this.camera);
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
            let spotLight = new THREE.SpotLight( 0xffffff, 2 );
            spotLight.position.set( 0, 50, 0 );
            spotLight.angle = Math.PI / 4;
            spotLight.penumbra = 0.05;
            spotLight.decay = 2;
            spotLight.distance = 200;

            spotLight.castShadow = true;
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            spotLight.shadow.camera.near = 10;
            spotLight.shadow.camera.far = 200;
            this.scene.add(spotLight);

            let directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
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
            loader.load(
                'models/particles/output_particles.glb',
                ( gltf ) => {
                    //console.log(gltf.scene);
                    let particleGeometry = new THREE.BufferGeometry();
                    particleGeometry.setAttribute('position', new THREE.BufferAttribute( gltf.scene.children[0].geometry.attributes.position.array, 3 ));

                    let particleMaterial = new THREE.PointsMaterial(
                        {
                            size: 0.25,
                            color: 0x025EA1, //0x93D6F4
                            map: new THREE.TextureLoader().load('textures/disc.png'),
                            transparent: true,
                            alphaTest: 0.5
                        }
                    );
                    //particleMaterial.color.setHSL( 1.0, 0.3, 0.7 );

                    let particles = new THREE.Points( particleGeometry, particleMaterial );
                    particles.scale.set(10, 10, 10);
                    this.model = particles;
                    this.scene.add(particles);
                }
            );
            loader.load(
                'models/logo/logo.glb',
                (gltf) => {
                    //console.log(gltf);
                    gltf.scene.rotation.x = Math.PI / 2;
                    this.scene.add(gltf.scene);
                }
            );

            //this.intersectedElectrons.push(sphere);

            this.orbits.forEach((item) => {
                let orbitInstance = new ParticlesOrbit(item.radius, item.position, new THREE.Vector3(), item.particlesCount, item.size, item.seed);
                let orbit = orbitInstance.init();

                //console.log(orbit);

                item.context = orbit;

                let group = new THREE.Group();
                group.rotation.setFromVector3(item.rotation);
                group.add(orbit);

                this.scene.add(group);
            });

            this.electrons.forEach((item, index) => {
                let electronInstance = new Electron(item.position, index);
                let electron = electronInstance.init();

                console.log(electron);

                this.intersectedElectrons.unshift(electron);

                this.scene.add(electron);
            });
        },
        createSettings() {
            const gui = new dat.GUI();
            gui.add(this.settings, 'x', -100, 100, 1);
            gui.add(this.settings, 'y', -100, 100, 1);
            gui.add(this.settings, 'z', -100, 100, 1);
        },
        createDraggable() {
            const _this = this;
            let scale = 0.005;
            let lastX = 0;
            let lastY = 0;
            let meshX = 0;
            let meshY = 0;

            new Draggable(document.createElement("div"), {
                onDrag: dragAction,
                onThrowUpdate: dragAction,
                trigger: this.renderer.domElement,
                throwProps: true,
                throwResistance: 10000
            });

            function dragAction() {

                console.log('drag')
                console.log(this)

                let x = this.x;
                let y = this.y;

                let dx = x - lastX;
                let dy = y - lastY;

                lastX = x;
                lastY = y;

                meshX += dx;
                meshY += dy;

                _this.model.rotation.x = meshY * scale;
                _this.model.rotation.y = meshX * scale;
            }
        },
        update() {
            this.controls.update();
        },
        render() {
            this.renderer.render( this.scene, this.camera );

            // this.orbits[0].context.rotation.y += 0.0025;
            // this.orbits[1].context.rotation.y -= 0.0025;
            // this.orbits[2].context.rotation.y -= 0.0025;
            // this.orbits[0].material.uniforms.time.value = Math.abs(Math.sin(performance.now() / 1000));
            // this.camera.position.set(this.settings.x, this.settings.y, this.settings.z);
            // this.intersectedElectrons[3].position.set(this.el.x, this.el.y, this.el.z);
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
            //     // console.log(intersects[0].point);
            //     // this.orbits[0].material.uniforms.mousePosition.value = intersects[0].point;
            // }
        },
        mouseClickHandler(event) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);
            let intersects = this.raycaster.intersectObjects(this.intersectedElectrons, true);

            if (intersects.length > 0) {
                console.log(intersects[0].object.index);
                //
                // intersects[0].object.geometry.computeBoundingBox();
                //
                // let center = intersects[0].object.geometry.boundingSphere.center;
                // let radius = intersects[0].object.geometry.boundingSphere.radius;
                // let distance = center.distanceTo(this.camera.position) - radius;

                //let height = intersects[0].object.geometry.

                //console.log(distance);
                // console.log(intersects[0].object.geometry.boundingBox);

                // this.orbits[0].material.uniforms.mousePosition.value = intersects[0].point;

                // this.camera.lookAt(-18, 8, 34);
                //this.camera.lookAt(-15.75, 11.2, 5);
                //console.log(this.camera.rotation);
                // this.camera.zoom = 2;

                //console.log(this.camera.lookAt);

                // let realHeight = Math.abs(intersects[0].object.geometry.boundingBox.max.y - intersects[0].object.geometry.boundingBox.min.y);
                //
                // console.log(realHeight);
                //
                // let fov = 2 * Math.atan(realHeight * 25 / (2 * distance)) * (180 / Math.PI);
                //
                // // console.log(fov);
                // //
                // // this.camera.fov = fov;
                // // this.camera.updateProjectionMatrix();


                // TweenMax.to(this.camera, 1,
                //     {
                //         zoom: 1.5,
                //         //ease: 'sine.inOut'
                //         onUpdate: () => {
                //             //console.log('update')
                //             this.camera.updateProjectionMatrix();
                //         }
                //     }
                // )

                TweenMax.to(this.camera.position, 0.8,
                    {
                        x: this.vectors[intersects[0].object.index].vector.x,
                        y: this.vectors[intersects[0].object.index].vector.y,
                        z: this.vectors[intersects[0].object.index].vector.z,
                        ease: 'sine.inOut',
                        onUpdate: () => {
                            //console.log('update')
                            //this.camera.updateProjectionMatrix();
                        }
                    }
                )

                // TweenMax.to(this.vector, 1,
                //     {
                //         x: intersects[0].object.position.x,
                //         y: intersects[0].object.position.y,
                //         z: intersects[0].object.position.z,
                //         onStart: () => {
                //             console.log('start');
                //             console.log(this.vector);
                //         },
                //         onUpdate: () => {
                //             this.camera.lookAt(this.vector.x, this.vector.y, this.vector.z);
                //             this.camera.updateProjectionMatrix();
                //             console.log(this.vector);
                //         },
                //         onComplete: () => {
                //             console.log('end');
                //             console.log(this.vector);
                //         }
                //     }
                // )

                // TweenMax.to(this.camera, 1,
                //     {
                //         zoom: 1.25,
                //         //ease: 'sine.inOut'
                //         onUpdate: () => {
                //             //console.log('update')
                //             //this.camera.updateProjectionMatrix();
                //         }
                //     }
                // )

                console.log(TweenMax);
            }
        }
    },
    mounted() {
        this.init();

        console.log(ThrowPropsPlugin)
        console.log(this.$refs.scene.children[0])
    }
}
</script>

<style lang="scss">

</style>
