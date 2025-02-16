<script lang="ts">
    import { tRot, tTrans } from "$lib/scene/state";
    import { initTestScene } from "$lib/scene/test";
    import { onMount } from "svelte";

    let canvas: HTMLCanvasElement;

    onMount(() => {
        initTestScene(canvas);
    });

</script>

<canvas width="650" height="500"
    bind:this={canvas}
></canvas>

rotate:    <input type="range" bind:value={$tRot}   min="0" max="1" step="0.01" /> {$tRot}
translate: <input type="range" bind:value={$tTrans} min="0" max="1" step="0.01" /> {$tTrans}