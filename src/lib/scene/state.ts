import { createMouseController } from "$lib/mouseControler";
import { writable } from "svelte/store";

// values shared by all scenes
export const transition = writable(1);
// export const mapIndex = writable(0);
export const mouse = createMouseController(0.5, 0.5);
export const centralPoint = createMouseController(0.5, 0.5);
export const zoom = writable(1.0);



// helper functions
export const onMouseMove = (e: MouseEvent) => e.shiftKey ? centralPoint.onMouseMove(e) : mouse.onMouseMove(e);
export const onMouseDown = (e: MouseEvent) => e.shiftKey ? centralPoint.onMouseDown(e) : mouse.onMouseDown(e);
export const onMouseUp =   (e: MouseEvent) => e.shiftKey ? centralPoint.onMouseUp(e)   : mouse.onMouseUp(e);