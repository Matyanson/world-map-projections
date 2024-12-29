<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import vertexShader from "$lib/shaders/vertex.glsl";
    import fragmentShader from "$lib/shaders/fragment.glsl";


    let m: {x: number, y: number} = {x: 0.5, y: 0.5};
    let mOffset: {x: number, y: number} = {x: 0, y: 0};
    let mIsDown: boolean = false;
    let transition = 0;
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
        },
        transition: {
            value: number;
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

        const geometry = new THREE.SphereGeometry(1, 50, 50);
        uniforms = {
            globeTexture: {
                value: new THREE.TextureLoader().load('earth_day.jpg')
            },
            cursorPosition: {
                value: new THREE.Vector2(m.x, 1 - m.y)
            },
            transition: {
                value: transition
            }
        }
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms
        });
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        camera.position.z = 3.0;
    }

    function animate() {
        renderer.render( scene, camera );
    }

    function onMouseMove(e: MouseEvent) {
        if(mIsDown) {
            // Normalize mouse position
            m.x = -e.clientX / window.innerWidth;
            m.y = -e.clientY / window.innerHeight;

            // cursor (convert to uv space)
            const cursorX =      m.x + mOffset.x;
            const cursorY = 1 - (m.y + mOffset.y);

            // Update the cursorPosition uniform
            uniforms.cursorPosition.value.set(cursorX, cursorY);
        }
    }

    function onMouseDown(e: MouseEvent) {
        if(e.button == 0) {
            mIsDown = true;

            const x = -e.clientX / window.innerWidth;
            const y = -e.clientY / window.innerHeight;

            // difference between last and curr coords
            mOffset.x += m.x - x;
            mOffset.y += m.y - y;
        }
    }

    function onMouseUp(e: MouseEvent) {
        if(e.button == 0) {
            mIsDown = false;
        }
    }

    function onTransition() {
        uniforms.transition.value = transition;
    }

    function onWheel(e: WheelEvent) {
        const direction = e.deltaY > 0 ? 1 : -1;
        camera.translateZ(direction * 0.05);
    }

</script>

<input type="range" min="0" max="1" step="0.01" bind:value={transition} on:input={onTransition} /> {transition}
<canvas 
    bind:this={canvas}
    on:mousemove={onMouseMove} 
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
    on:wheel|preventDefault={onWheel}
></canvas>