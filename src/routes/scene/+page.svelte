<script lang="ts">
    import Scene from "$lib/components/Scene.svelte";
    import SceneNavbar from "$lib/components/SceneNavbar.svelte";
    import { mapIndex1, mapIndex2 } from "$lib/scene/state";

</script>

<SceneNavbar />
<div class="display">
    <Scene mapIndexA={$mapIndex1} mapIndexB={$mapIndex2} />
    <Scene mapIndexA={$mapIndex2} mapIndexB={$mapIndex1} />
</div>

<style>
.display {
    display: flex;
    flex-flow: row;
}
</style>