<script lang="ts">
    import Scene from "$lib/components/Scene.svelte";
import { transition } from "$lib/scene/state";

</script>

globe - map transition: <input type="range" min="0" max="1" step="0.01" bind:value={$transition} /> {$transition}
<div class="display">
    <Scene mapIndex={1} />
    <Scene />
</div>

<style>
.display {
    display: flex;
    flex-flow: row;
}
</style>