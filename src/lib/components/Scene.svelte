<script lang="ts">
    import { values } from "$lib/projections";
    import { createSceneController } from "$lib/scene/scene";
    import { mouse, onMouseDown, onMouseMove, onMouseUp, centralPoint, zoom } from "$lib/scene/state";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    
    export let mapIndex = 0;
    let code = "";
    let canvas: HTMLCanvasElement;
    const sceneControler = createSceneController();

    $: sceneControler.updateShaders(mapIndex, 'B');
    $: code = values[mapIndex].projection;

    onMount(() => {
        console.log("onMount");
        sceneControler.initScene(canvas);
        sceneControler.updateShaders(mapIndex, 'B');
        code = values[mapIndex].projection;

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
        sceneControler.setCustomProjection(code, 'B');
    }

</script>

<div class="scene">
    <select bind:value={mapIndex}>
        {#each values as option, i}
          <option value={i}>{option.name}</option>
        {/each}
    </select> {mapIndex} {values[mapIndex].name}
    
    <canvas width="650" height="500"
        bind:this={canvas}
        on:mousemove={onMouseMove} 
        on:mousedown={onMouseDown}
        on:mouseup={onMouseUp}
        on:wheel|preventDefault={onWheel}
    ></canvas>
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