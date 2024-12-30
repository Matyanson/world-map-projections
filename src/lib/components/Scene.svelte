<script lang="ts">
    import { values } from "$lib/projections";
    import { createSceneController } from "$lib/scene/scene";
    import { mouse, onMouseDown, onMouseMove, onMouseUp, textureOffset, zoom } from "$lib/scene/state";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    
    let mapIndex = 0;
    let canvas: HTMLCanvasElement;
    const sceneControler = createSceneController();

    $: sceneControler.updateShaders(mapIndex, 'B');

    onMount(() => {
        console.log("onMount");
        sceneControler.initScene(canvas);

        mouse.position.subscribe((state) => {
            const cursor = mouse.getCursorPosition();
            sceneControler.updateCursorPosition(cursor.x, cursor.y);
        });
        textureOffset.position.subscribe((state) => {
            const cursor = textureOffset.getCursorPosition();
            sceneControler.updateOffsetPosition(cursor.x, cursor.y);
        });
    })

    function onWheel(e: WheelEvent) {
        const direction = e.deltaY > 0 ? 1 : -1;
        zoom.update(z => z + direction * 0.1);
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
</div>

<style>
    .scene {
        display: flex;
        flex-flow: column;
    }
</style>