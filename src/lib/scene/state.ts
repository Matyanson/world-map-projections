import { createMouseController } from "$lib/mouseControler";
import { writable } from "svelte/store";

// values shared by all scenes
export const transition = writable(0);
export const mapIndex = writable(0);
export const mouse = createMouseController(0.5, 0.5);
export const textureOffset = createMouseController(0, 0);
export const zoom = writable(1.0);