<script lang="ts">
    import { createMouseController } from "$lib/mouseControler";
    import { values } from "$lib/projections";
    import { createSceneController } from "$lib/scene/scene";
    import { onMount } from "svelte";
    import { get } from "svelte/store";
    
    let mapIndex = 0;
    let canvas: HTMLCanvasElement;
    const sceneControler = createSceneController();
    const mouseController = createMouseController(0.5, 0.5);

    $: sceneControler.updateShaders(mapIndex);

    onMount(() => {
        console.log("onMount");
        sceneControler.initScene(canvas);

        mouseController.position.subscribe((state) => {
            const cursor = mouseController.getCursorPosition();
            sceneControler.updateMousePosition(cursor.x, cursor.y);
        })
    })

    function onWheel(e: WheelEvent) {
        const direction = e.deltaY > 0 ? 1 : -1;
        get(sceneControler.camera).translateZ(direction * 0.05);
    }

</script>

<select bind:value={mapIndex}>
    {#each values as option, i}
      <option value={i}>{option.name}</option>
    {/each}
</select> {mapIndex} {values[mapIndex].name}

<canvas 
    bind:this={canvas}
    on:mousemove={mouseController.onMouseMove} 
    on:mousedown={mouseController.onMouseDown}
    on:mouseup={mouseController.onMouseUp}
    on:wheel|preventDefault={onWheel}
></canvas>