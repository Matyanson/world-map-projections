import * as THREE from "three";
import Delaunator from 'delaunator';
import vertexShader from "$lib/shaders/sphere/vertex.glsl";
import fragmentShader from "$lib/shaders/sphere/fragment.glsl";
import { tRot, tTrans } from "./state";
import { get } from "svelte/store";

export function initTestScene(canvas: HTMLCanvasElement) {
    // SCENE
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.0001, 1000 );
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    
    // SETUP
    camera.position.z = 5.0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // GEOMETRY
    const plane = getMesh();
    const wireframe = getWireframe(plane.geometry, plane.material);
    scene.add(plane, wireframe);

    // RENDER
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);

    function animate() {
        renderer.render(scene, camera);
    }
}

function getUniforms() {
    return {
        tRot: {
            value: get(tRot)
        },
        tTrans: {
            value: get(tTrans)
        },
        color: {
            value: new THREE.Vector3(1, 0, 0)
        }
    }
}

function getMesh() {
    // VERTICES
    const vb: number[] = [];
    // Border
    const w = 2 * Math.PI;
    const h = Math.PI;
    vb.push(...getRectBorderPoints(-w/2, -h/2, w, h, 2, 10));
    // Sphere
    vb.push(...getFibonacciSpherePoints(1024));

    const vertices = new Float32Array(vb);
    const indices = delaunayTriangulation2D(Array.from(vertices), 3);

    const geometry = new THREE.BufferGeometry();
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );

    // UNIFORMS
    const uniforms = getUniforms();

    // MATERIAL
    const shaders = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms
    });
    const mesh = new THREE.Mesh( geometry, shaders );

    tRot.subscribe((t) => {
        uniforms.tRot.value = t;
    })
    tTrans.subscribe((t) => {
        uniforms.tTrans.value = t;
    })

    return mesh;
}

function getWireframe(geometry: THREE.BufferGeometry, material: THREE.ShaderMaterial) {
    const wireframe = new THREE.WireframeGeometry( geometry );
    const wireMat = new THREE.ShaderMaterial({
        vertexShader: material.vertexShader,
        fragmentShader: `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      }`,
      uniforms: material.uniforms
    });
    const line = new THREE.LineSegments( wireframe, wireMat );

    return line;
}

function getRectBorderPoints(x: number, y: number, w: number, h: number, m: number, n: number) {

    const vb: number[] = [];
    // horizontal
    let wOffset = 0;
    for(let i = 0; i <= m; i++) {
        vb.push(
            x + 0 + wOffset, y + 0 + 0,       1.0, // v0
            x + 0 + wOffset, y + h + 0,       1.0, // v2
        );
        wOffset += w / m;
    }
    // vertical
    let hOffset = h / n;
    for(let i = 1; i < m; i++) {
        vb.push(
            x + 0 + 0,       y + 0 + hOffset, 1.0, // v0
            x + w + 0,       y + 0 + hOffset, 1.0, // v1
        );
        hOffset += h / n;
    }
    return vb;
}

function delaunayTriangulation2D(
    vertices: number[],
    stride: number = 3,
    mask: [number, number] = [0, 1]
  ): Uint32Array {

    // Convert flat array to an array of [x, y] points
    const points: [number, number][] = [];
    for (let i = 0; i < vertices.length; i += stride) {
        points.push(
            [vertices[i + mask[0]], vertices[i + mask[1]]]
        );
    }

    const delaunay = Delaunator.from(points);
  
    // delaunay.triangles is already a typed array (Uint32Array)
    return reverseTriangleWinding(delaunay.triangles);
}

function reverseTriangleWinding(indices: Uint32Array): Uint32Array {
    const reversed = new Uint32Array(indices.length);
    for (let i = 0; i < indices.length; i += 3) {
        // Keep the first vertex, swap the second and third vertices.
        reversed[i] = indices[i];
        reversed[i + 1] = indices[i + 2];
        reversed[i + 2] = indices[i + 1];
    }
    return reversed;
}

// https://stackoverflow.com/a/44164075
function getFibonacciSpherePoints(n: number) {
    const points: number[] = [];
    const offset = 0.5;
    for (let i = 0; i < n; i++) {
        const index = i + offset;
        const phi = Math.acos(1 - (2 * index) / n);
        const theta = Math.PI * (1 + Math.sqrt(5)) * index;

        const lon = theta % (2 * Math.PI) - Math.PI;
        const lat = 0.5 * Math.PI - phi;
        points.push(lon, lat, 1.0);
    }
    return points;
}

// https://scholar.rose-hulman.edu/cgi/viewcontent.cgi?article=1387&context=rhumj
function getAproxFibonacciSpherePoints(n: number) {
    const points: number[] = [];
    
    const x = 0.1 + 1.2 * n;
    const start = 1 / (n - 1) - 1;
    const increment = (2 - 2 / (n - 1)) / (n - 1);
  
    for (let i = 0; i < n; i++) {
        const s = start + i * increment;
        const sign = s < 0 ? -1 : 1;
        let theta = s * x;
        let phi = (Math.PI / 2) * sign * (1 - Math.sqrt(1 - Math.abs(s)));
        
        const lon = (Math.abs(theta) % (2 * Math.PI)) - Math.PI;
        const lat = (phi % Math.PI) - 0.0 * Math.PI;
        points.push(lon, lat, 1.0);
    }
  
    return points;
}
  