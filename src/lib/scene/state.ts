import { createMouseController } from "$lib/mouseControler";
import { writable } from "svelte/store";

// values shared by all scenes
export const transition = writable(0);
export const tRot = writable(1);
export const tTrans = writable(1);
export const mouse = createMouseController(0.5, 0.5);
export const centralPoint = createMouseController(0.5, 0.5);
export const zoom = writable(1.0);
export const mapIndex1 = writable(0);
export const mapIndex2 = writable(0);



// helper functions
export const onMouseMove = (e: MouseEvent) => e.shiftKey ? centralPoint.onMouseMove(e) : mouse.onMouseMove(e);
export const onMouseDown = (e: MouseEvent) => e.shiftKey ? centralPoint.onMouseDown(e) : mouse.onMouseDown(e);
export const onMouseUp =   (e: MouseEvent) => e.shiftKey ? centralPoint.onMouseUp(e)   : mouse.onMouseUp(e);