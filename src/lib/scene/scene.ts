import * as THREE from "three";
import { defaultValue, insertID, values } from "$lib/projections/index";
import vertexShaderHead from "$lib/shaders/vertex_head.glsl";
import vertexShaderBody from "$lib/shaders/vertex_body.glsl";
import fragmentShader from "$lib/shaders/fragment.glsl";
import { get, writable } from "svelte/store";
import { mapIndex, mouse, transition } from "./state";


export function createSceneController() {
    const scene = writable<THREE.Scene>();
    const renderer = writable<THREE.WebGLRenderer>();
    const camera = writable<THREE.Camera>();
    const sphere = writable<THREE.Mesh>();
    const uniforms = writable<{
        globeTexture: {
            value: THREE.Texture;
        },
        cursorPosition: {
            value: THREE.Vector2;
        },
        transition: {
            value: number;
        }
    }>();

    function initScene(canvas: HTMLCanvasElement) {
        const sceneData = createScene(canvas);

        scene.set(sceneData.scene);
        renderer.set(sceneData.renderer);
        camera.set(sceneData.camera);
        sphere.set(sceneData.sphere);
        uniforms.set(sceneData.uniforms);
    }

    function updateMousePosition(x: number, y: number) {
        uniforms.update((state) => {
            if(!state) return state;

            state.cursorPosition.value = new THREE.Vector2(x, y);

            return state;
        })
    }

    function updateShaders(vertexShaderIndex: number) {
        sphere.update((state) => {
            console.log('update shaders!!!');
            if (!state || !(state.material instanceof THREE.ShaderMaterial)) return state;
    
            const updatedVertexShader = getVertexShader(vertexShaderIndex);
            console.log(updatedVertexShader);
    
            state.material.vertexShader = updatedVertexShader;
            state.material.needsUpdate = true;

            return state;
        })
    }

    return {
        scene,
        renderer,
        camera,
        sphere,
        initScene,
        updateShaders,
        updateMousePosition
    }
}

// util functions

function createScene(canvas: HTMLCanvasElement) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    renderer.setSize(window.innerWidth-1, window.innerHeight-1);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setAnimationLoop(animate);

    const geometry = new THREE.SphereGeometry(1, 50, 50);
    const uniforms = getUniforms()
    const material = new THREE.ShaderMaterial({
        vertexShader: getVertexShader(get(mapIndex)),
        fragmentShader,
        uniforms
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 3.0;

    transition.subscribe((t) => {
        uniforms.transition.value = t;
    })

    function animate() {
        renderer.render(scene, camera);
    }

    return {
        scene,
        camera,
        renderer,
        sphere,
        uniforms
    }
}


function getUniforms() {
    const cursor = mouse.getCursorPosition();
    const globeTexture = new THREE.TextureLoader().load("earth_day.jpg");

    return {
        globeTexture: {
            value: globeTexture
        },
        cursorPosition: {
            value: new THREE.Vector2(cursor.x, cursor.y)
        },
        transition: {
            value: get(transition)
        }
    }
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