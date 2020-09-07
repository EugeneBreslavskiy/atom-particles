<template>
    <section class="scene" ref="scene"></section>
</template>

<script>
import * as THREE from 'three';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import AtomGroup from "@/partials/AtomGroup/AtomGroup";
import ParticlesOrbit from "@/partials/ParticlesOrbit/ParticlesOrbit";
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
            orbits: [
                {
                    radius: 20,
                    position: new THREE.Vector3(0, 0, 0),
                    rotation: {
                        x: 0,
                        y: 0,
                        z: 0
                    },
                    particlesCount: 2000
                }
            ],
            intersectedPlanes: [],
            raycaster: null,
            mouse: null
        }
    },
    methods: {
        init() {
            this.container = this.$refs.scene;
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color( 0x333333 );
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();

            this.createCamera();
            //this.createControls();
            this.createLights();
            this.createRenderer();
            this.createObject();

            this.renderer.setAnimationLoop(() => {
                //this.update();
                this.render();
            })
            window.addEventListener( 'resize', this.resizeWindowHandler, false );
            //window.addEventListener('mousemove', this.mouseMoveHandler, false);
        },
        createCamera() {
            this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
            this.camera.position.set( 0, 0, 50 );
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

            let orbitInstance = new ParticlesOrbit(20, 1000);
            let orbit = orbitInstance.init();

            this.scene.add(orbit);
        },
        update() {
            this.controls.update();
        },
        render() {
            this.renderer.render( this.scene, this.camera );
            // this.orbits[0].material.uniforms.time.value = Math.abs(Math.sin(performance.now() / 1000));
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
        }
    },
    mounted() {
        this.init();
    }
}
</script>

<style lang="scss">

</style>
