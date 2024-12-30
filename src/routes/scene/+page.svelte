<script lang="ts">
    import Scene from "$lib/components/Scene.svelte";
import { transition } from "$lib/scene/state";

</script>

<input type="range" min="0" max="1" step="0.01" bind:value={$transition} /> {transition}
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