<script lang="ts">
    import { values } from "$lib/projections";
    import { createSceneController } from "$lib/scene/scene";
    import { mouse, onMouseDown, onMouseMove, onMouseUp, centralPoint, zoom } from "$lib/scene/state";
    import { onMount } from "svelte";
    
    export let mapIndexA = 0;
    export let mapIndexB = 0;
    let code = "";
    let canvas: HTMLCanvasElement;
    const sceneControler = createSceneController();

    $: sceneControler.updateShaders(mapIndexA, mapIndexB);
    $: code = values[mapIndexA].projection;

    onMount(() => {
        sceneControler.initScene(canvas, mapIndexA, mapIndexB);
        code = values[mapIndexA].projection;

        mouse.position.subscribe((state) => {
            const cursor = mouse.getCursorPosition();
            sceneControler.updateCursorPosition(cursor.x, cursor.y);
        });
        centralPoint.position.subscribe((state) => {
            const cursor = centralPoint.getCursorPosition();
            sceneControler.updateCenterPosition(cursor.x, cursor.y);
        });
    })

    function onWheel(e: WheelEvent) {
        const direction = e.deltaY > 0 ? 1 : -1;
        zoom.update(z => z + direction * 0.1);
    }

    function updateProjection() {
        sceneControler.setCustomProjection(code, mapIndexB);
    }

</script>

<div class="scene">    
    <canvas width="650" height="500"
        bind:this={canvas}
        on:mousemove={onMouseMove} 
        on:mousedown={onMouseDown}
        on:mouseup={onMouseUp}
        on:wheel|preventDefault={onWheel}
    ></canvas>
    <p class="info">
        a = longitude in radians &nbsp;[-π, π]<br>
        b = latitude in radians &emsp;[-π/2, π/2]
    </p>
    <textarea bind:value={code}></textarea>
    <button on:click={updateProjection}>Update Projection</button>
</div>

<style>
    .scene {
        display: flex;
        flex-flow: column;
    }

    .scene textarea {
        height: 200px;
        background-color: #333;
        color: #fff;
    }

    canvas {
        -webkit-user-drag: none;
    }
</style>