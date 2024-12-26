<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import vertexShader from "$lib/shaders/vertex.glsl";
    import fragmentShader from "$lib/shaders/fragment.glsl";


    let canvas: HTMLCanvasElement;

    let scene: THREE.Scene;
    let camera: THREE.Camera;
    let renderer: THREE.WebGLRenderer;
    let sphere: THREE.Mesh;

    onMount(()=>{
        createScene();
    })

    function createScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        

        renderer.setSize( window.innerWidth-1, window.innerHeight-1 );
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setAnimationLoop( animate );

        const geometry = new THREE.SphereGeometry(0.5, 500, 500);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                globeTexture: {
                    value: new THREE.TextureLoader().load('earth_day.jpg')
                }
            }
        });
        sphere = new THREE.Mesh( geometry, material );
        scene.add( sphere );

        camera.position.z = 1;
    }

    function animate() {

        sphere.rotation.x += 0.01;
        sphere.rotation.y += 0.01;

        renderer.render( scene, camera );
    }

</script>

<canvas bind:this={canvas}></canvas>