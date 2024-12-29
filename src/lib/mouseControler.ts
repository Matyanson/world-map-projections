import { get, writable } from "svelte/store";

export function createMouseController(x: number, y: number) {

    const mouseState = writable({
        x,
        y,
        offset: { x: 0, y: 0 },
        isDown: false
    })

    function getCursorPosition() {
        const { x, y, offset } = get(mouseState);
        return {
            x:      x + offset.x,
            y: 1 - (y + offset.y)
        }
    }

    function onMouseMove(e: MouseEvent) {
        mouseState.update((state) => {
            if(!state.isDown) return state;

            return {
                ...state,
                x: -e.clientX / window.innerWidth,
                y: -e.clientY / window.innerHeight
            }
        })
    }

    function onMouseDown(e: MouseEvent) {
        if(e.button != 0) return;

        mouseState.update((state) => {
            const { x, y, offset } = state;

            const currX = -e.clientX / window.innerWidth;
            const currY = -e.clientY / window.innerHeight;

            return {
                ...state,
                // difference between last and curr coords
                offset: {
                    x: offset.x + x - currX,
                    y: offset.y + y - currY
                },
                isDown: true
            }
        })
    }

    function onMouseUp(e: MouseEvent) {
        if(e.button != 0) return;
        mouseState.update((state) => {
            return {
                ...state,
                isDown: false
            }
        })
    }

    return {
        mouseState,
        onMouseMove,
        onMouseDown,
        onMouseUp,
        getCursorPosition
    };
}