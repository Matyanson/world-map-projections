<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";


    let canvas: HTMLCanvasElement;

    let scene: THREE.Scene;
    let camera: THREE.Camera;
    let renderer: THREE.WebGLRenderer;
    let cube: THREE.Mesh;

    onMount(()=>{
        createScene();
    })

    function createScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setAnimationLoop( animate );

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        cube = new THREE.Mesh( geometry, material );
        scene.add( cube );

        camera.position.z = 5;
    }

    function animate() {

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    }

</script>

<canvas bind:this={canvas} />