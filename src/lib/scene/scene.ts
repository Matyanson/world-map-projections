import * as THREE from "three";
import { defaultValue, insertID, values } from "$lib/projections/index";
import vertexShaderHead from "$lib/shaders/vertex_head.glsl";
import vertexShaderBody from "$lib/shaders/vertex_body.glsl";
import fragmentShader from "$lib/shaders/fragment.glsl";
import { get, writable } from "svelte/store";
import { mouse, centralPoint, transition, zoom } from "./state";


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
        centralPoint: {
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

    function updateCursorPosition(x: number, y: number) {
        uniforms.update((state) => {
            if(!state) return state;

            state.cursorPosition.value = new THREE.Vector2(x, y);

            return state;
        })
    }

    function updateCenterPosition(x: number, y: number) {
        uniforms.update((state) => {
            if(!state) return state;

            state.centralPoint.value = new THREE.Vector2(x, y);

            return state;
        })
    }

    function setCustomProjection(code: string, id: string) {
        sphere.update((state) => {
            console.log('update shaders!!!');
            if (!state || !(state.material instanceof THREE.ShaderMaterial)) return state;
    
            const updatedVertexShader = getCustomVertexShader(code, id);
            console.log(updatedVertexShader);
    
            state.material.vertexShader = updatedVertexShader;
            state.material.needsUpdate = true;

            return state;
        })
    }

    function updateShaders(vertexShaderIndex: number, id: string) {
        sphere.update((state) => {
            console.log('update shaders!!!');
            if (!state || !(state.material instanceof THREE.ShaderMaterial)) return state;
    
            const updatedVertexShader = getVertexShader(vertexShaderIndex, id);
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
        setCustomProjection,
        updateCursorPosition,
        updateCenterPosition
    }
}

// util functions

function createScene(canvas: HTMLCanvasElement) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.0001, 1000 );
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setAnimationLoop(animate);

    // SPHERE
    const geometry = new THREE.SphereGeometry(1, 50, 50);
    const uniforms = getUniforms()
    const material = new THREE.ShaderMaterial({
        vertexShader: getVertexShader(0, 'B'),
        fragmentShader,
        uniforms
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // STARS
    scene.add(getStars());

    // SETUP
    camera.position.z = 3.0;

    transition.subscribe((t) => {
        uniforms.transition.value = t;
    })

    zoom.subscribe((z) => {
        camera.position.z = 1.0001 + Math.pow(2, z);
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

function getStars() {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({ color: 0xfffffffff });
    const stars = new THREE.Points(geometry, material);

    const vb = [];
    for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * -900 - 100;
        vb.push(x, y, z);
    }

    geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(vb, 3)
    );

    return stars;
}


function getUniforms() {
    const cursor = mouse.getCursorPosition();
    const center = centralPoint.getCursorPosition();
    const globeTexture = new THREE.TextureLoader().load("earth_day.jpg");
    // Set texture wrapping mode
    globeTexture.wrapS = THREE.RepeatWrapping; // Horizontal wrapping (U)
    globeTexture.wrapT = THREE.MirroredRepeatWrapping; // Vertical wrapping (V)

    return {
        globeTexture: {
            value: globeTexture
        },
        cursorPosition: {
            value: new THREE.Vector2(cursor.x, cursor.y)
        },
        centralPoint: {
            value: new THREE.Vector2(center.x, center.y)
        },
        transition: {
            value: get(transition)
        }
    }
}

function getVertexShader(index: number, id: string) {
    const projectionData = Object.assign({}, defaultValue, values[index]);

    const fullVertexShader = vertexShaderHead + `
    vec2 applyMapProjectionB(float a, float b) {
        ${insertID(projectionData.projection, id)}
        return vec2(x, y);
    }
    vec3 projectUVToPositionB(vec2 uv) {
        ${insertID(projectionData.position, id)}
    }
    vec4 applyCursorCenteringB(vec3 position, vec2 cursor) {
        ${insertID(projectionData.centerTransformation, id)}
    }
    ` + vertexShaderBody;

    return fullVertexShader;
}

function getCustomVertexShader(projection: string, id: string) {
    const projectionData = Object.assign({}, defaultValue);

    const fullVertexShader = vertexShaderHead + `
    vec2 applyMapProjectionB(float a, float b) {
        ${insertID(projection, id)}
        return vec2(x, y);
    }
    vec3 projectUVToPositionB(vec2 uv) {
        ${insertID(projectionData.position, id)}
    }
    vec4 applyCursorCenteringB(vec3 position, vec2 cursor) {
        ${insertID(projectionData.centerTransformation, id)}
    }
    ` + vertexShaderBody;

    return fullVertexShader;
}