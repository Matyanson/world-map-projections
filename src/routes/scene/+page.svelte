<script lang="ts">
    import { onMount } from "svelte";
    import * as THREE from "three";
    import vertexShaderHead from "$lib/shaders/vertex_head.glsl";
    import vertexShaderBody from "$lib/shaders/vertex_body.glsl";
    import fragmentShader from "$lib/shaders/fragment.glsl";
    import { defaultValue, insertID, values } from "$lib/projections/index";
    import { createMouseController } from "$lib/mouseControler";


    let transition = 0;
    let projectionIndex = 0;
    let canvas: HTMLCanvasElement;

    const mouseController = createMouseController(0.5, 0.5);

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

        mouseController.mouseState.subscribe((state) => {
            const cursor = mouseController.getCursorPosition();
            uniforms.cursorPosition.value.set(cursor.x, cursor.y);
        })
    })

    $: updateShaders(projectionIndex);

    function updateShaders(vertexShaderIndex: number) {
        console.log('update shaders!!!');
        if (!sphere || !sphere.material || !(sphere.material instanceof THREE.ShaderMaterial)) {
            console.error("Sphere or material not initialized properly.");
            return;
        }

        const updatedVertexShader = getVertexShader(vertexShaderIndex);
        console.log(updatedVertexShader);

        sphere.material.vertexShader = updatedVertexShader;
        sphere.material.needsUpdate = true;
    }

    function getVertexShader(index: number) {
        const projectionData = Object.assign({}, defaultValue, values[index]);

        const fullVertexShader = vertexShaderHead + `
        vec2 applyMapProjectionB(float a, float b) {
            ${insertID(projectionData.projection, 'B')}
            return vec2(x, y);
        }
        vec3 projectUVToPositionB(vec2 uv) {
            ${insertID(projectionData.position, 'B')}
        }
        vec4 applyCursorCenteringB(vec3 position, vec2 cursor) {
            ${insertID(projectionData.centerTransformation, 'B')}
        }
        ` + vertexShaderBody;

        return fullVertexShader;
    }

    function createScene() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        

        renderer.setSize(window.innerWidth-1, window.innerHeight-1);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setAnimationLoop( animate );

        const geometry = new THREE.SphereGeometry(1, 50, 50);
        const cursor = mouseController.getCursorPosition();
        uniforms = {
            globeTexture: {
                value: new THREE.TextureLoader().load('earth_day.jpg')
            },
            cursorPosition: {
                value: new THREE.Vector2(cursor.x, cursor.y)
            },
            transition: {
                value: transition
            }
        }
        const material = new THREE.ShaderMaterial({
            vertexShader: getVertexShader(projectionIndex),
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

    function onTransition() {
        uniforms.transition.value = transition;
    }

    function onWheel(e: WheelEvent) {
        const direction = e.deltaY > 0 ? 1 : -1;
        camera.translateZ(direction * 0.05);
    }

</script>

<input type="range" min="0" max="1" step="0.01" bind:value={transition} on:input={onTransition} /> {transition}
<select bind:value={projectionIndex}>
    {#each values as option, i}
      <option value={i}>{option.name}</option>
    {/each}
</select> {projectionIndex} {values[projectionIndex].name}
<canvas 
    bind:this={canvas}
    on:mousemove={mouseController.onMouseMove} 
    on:mousedown={mouseController.onMouseDown}
    on:mouseup={mouseController.onMouseUp}
    on:wheel|preventDefault={onWheel}
></canvas>