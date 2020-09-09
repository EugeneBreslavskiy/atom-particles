<template>
    <section class="scene" ref="scene"></section>
</template>

<script>
import * as THREE from 'three';
import { TweenMax } from 'gsap';
import * as dat from 'dat.gui';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import AtomGroup from "@/partials/AtomGroup/AtomGroup";
import ParticlesOrbit from '@/partials/ParticlesOrbit/ParticlesOrbit';
import Electron from '@/partials/Electron/Electron';
//import IntersectedPlane from "@/partials/IntersectedPlane/IntersectedPlane";
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
                    radius: 12,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.15 , 0, -0.1),
                    particlesCount: 1500,
                    seed: 0.25,
                    size: Math.random() * 0.2
                },
                {
                    radius: 12,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.2 , 0, 0.6),
                    particlesCount: 1500,
                    seed: 0.25,
                    size: Math.random() * 0.2
                },
                {
                    radius: 12,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.2, 0, -0.6),
                    particlesCount: 1500,
                    seed: 0.25,
                    size: Math.random() * 0.2
                },
                {
                    radius: 8,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.21, 0.38374413426506115, 0.48707220753312597),
                    particlesCount: 1500,
                    size: Math.random() * 0.2,
                    seed: 0.25
                },
                {
                    radius: 12,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: new THREE.Vector3(0.45, 0, -1),
                    particlesCount: 1500,
                    size: Math.random() * 0.2,
                    seed: 0.25
                },
            ],
            orbit: null,
            electrons: [
                {
                    position: new THREE.Vector3(-10, 6.5, 1.5),
                },
                {
                    position: new THREE.Vector3(-12, 1, 0.9),
                },
                {
                    position: new THREE.Vector3(-9.4, -7.2, 2),
                },
                {
                    position: new THREE.Vector3(10, 6.5, 1.5),
                },
                {
                    position: new THREE.Vector3(12, -1.25, 0.9),
                },
                {
                    position: new THREE.Vector3(9.4, -7.2, 2),
                }
            ],
            intersectedElectrons: [],
            raycaster: null,
            mouse: null,
            vector: new THREE.Vector3(0, 0, 0),
            vectors: [
                {
                    vector: new THREE.Vector3(-4, 3, 23)
                },
                {
                    vector: new THREE.Vector3(-4, 1, 23)
                },
                {
                    vector: new THREE.Vector3(-4, -3.2, 23)
                },
                {
                    vector: new THREE.Vector3(4, 3, 23)
                },
                {
                    vector: new THREE.Vector3(4, 1, 23)
                },
                {
                    vector: new THREE.Vector3(4, -3.2, 23)
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
            this.createSettings();

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
            this.camera.position.set( 0, 1, 30 );
            // this.camera.lookAt(-15.75, 11.2, 5);
            let helper = new THREE.CameraHelper( this.camera );
            this.scene.add( helper );

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
            let spotLight = new THREE.SpotLight( 0xffffff, 1 );
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
            this.scene.add( spotLight );
        },
        createRenderer() {
            this.renderer = new THREE.WebGLRenderer( { antialias: true } );
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.renderer.setPixelRatio( window.devicePixelRatio );
            this.container.appendChild( this.renderer.domElement );
        },
        createObject() {
            // const loader = new GLTFLoader();
            // loader.load(
            //     'models/atom/scene.gltf',
            //     ( gltf ) => {
            //         // called when the resource is loaded
            //         this.scene.add( gltf.scene );
            //         console.log(gltf.scene);
            //
            //
            //     },
            //     ( xhr ) => {
            //         // called while loading is progressing
            //         console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
            //     },
            //     ( error ) => {
            //         // called when loading has errors
            //         console.error( 'An error happened', error );
            //     },
            // );

            let sphereGeometry = new THREE.SphereGeometry( 1.5, 15, 15 );
            let sphereMaterial = new THREE.MeshPhongMaterial(
                {
                    color: 0xC4BCD6,
                    emissive: 0x6F8FB4,
                    specular: 0x3F5E7D,
                    shininess: 50
                }
            );
            let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.index = 6;

            this.intersectedElectrons.push(sphere);

            this.scene.add(sphere);

            //console.log('sphere', sphere);

            this.orbits.forEach((item) => {
                let orbitInstance = new ParticlesOrbit(item.radius, item.position, item.rotation, item.particlesCount, item.size, item.seed);
                let orbit = orbitInstance.init();

                //console.log(orbit);

                this.scene.add(orbit);
            });

            this.electrons.forEach((item, index) => {
                let electronInstance = new Electron(item.position, index);
                let electron = electronInstance.init();

                //console.log(electron);

                this.intersectedElectrons.unshift(electron);

                this.scene.add(electron);
            });


        },
        createSettings() {
            const gui = new dat.GUI();
            gui.add(this.settings, 'x', -100, 100, 1);
            gui.add(this.settings, 'y', -100, 100, 1);
            gui.add(this.settings, 'z', -100, 100, 1);
            // gui.add(this.el, 'x', -25, 25, 0.1 );
            // gui.add(this.el, 'y', -25, 25, 0.1 );
            // gui.add(this.el, 'z', -25, 25, 0.1 );
            // console.log(gui);
        },
        update() {
            this.controls.update();
        },
        render() {
            this.renderer.render( this.scene, this.camera );
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

            this.raycaster.setFromCamera(this.mouse, this.camera);
            let intersects = this.raycaster.intersectObjects(this.intersectedPlanes, true);

            if (intersects.length > 0) {
                // console.log(intersects[0].point);
                // this.orbits[0].material.uniforms.mousePosition.value = intersects[0].point;
            }
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
    }
}
</script>

<style lang="scss">

</style>
