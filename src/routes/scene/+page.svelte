<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import vertexShader from "$lib/shaders/vertex.glsl";
    import fragmentShader from "$lib/shaders/fragment.glsl";


    let m: {x: number, y: number} = {x: 0, y: 0};
    let canvas: HTMLCanvasElement;

    let scene: THREE.Scene;
    let camera: THREE.Camera;
    let renderer: THREE.WebGLRenderer;
    let sphere: THREE.Mesh;
    let uniforms: {
        globeTexture: {
            value: THREE.Texture;
        },
        cursorPosition: {
            value: THREE.Vector2;
        }
    }

    onMount(()=>{
        createScene();
    })

    function createScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        

        renderer.setSize(window.innerWidth-1, window.innerHeight-1);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setAnimationLoop( animate );

        const geometry = new THREE.SphereGeometry(0.5, 50, 50);
        uniforms = {
            globeTexture: {
                value: new THREE.TextureLoader().load('earth_day.jpg')
            },
            cursorPosition: {
                value: new THREE.Vector2(0, 0)
            }
        }
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms
        });
        sphere = new THREE.Mesh( geometry, material );
        scene.add( sphere );

        camera.position.z = 1;
    }

    function animate() {
        renderer.render( scene, camera );
    }

    function onMouseMove(e: MouseEvent) {
        // Normalize mouse position
        m.x = e.clientX / window.innerWidth;
        m.y = e.clientY / window.innerHeight;

        // Update the cursorPosition uniform
        uniforms.cursorPosition.value.set(m.x, m.y);
    }



</script>

<canvas bind:this={canvas}></canvas>

<svelte:window on:mousemove={onMouseMove}></svelte:window>