<script>
    import { values } from "$lib/projections";
    import { mapIndex1, mapIndex2, transition } from "$lib/scene/state";

</script>


map1 - map2 transition: <input type="range" min="0" max="1" step="0.01" bind:value={$transition} /> {$transition}

<select bind:value={$mapIndex1}>
    {#each values as option, i}
      <option value={i}>{option.name}</option>
    {/each}
</select> {$mapIndex1} {values[$mapIndex1].name}

<select bind:value={$mapIndex2}>
    {#each values as option, i}
      <option value={i}>{option.name}</option>
    {/each}
</select> {$mapIndex2} {values[$mapIndex2].name}