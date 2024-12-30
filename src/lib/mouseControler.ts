import { get, writable } from "svelte/store";

export function createMouseController(x: number, y: number) {

    const mouseState = writable({
        offset: { x: 0, y: 0 },
        isDown: false
    })
    const position = writable({ x, y });

    function getCursorPosition() {
        const { offset } = get(mouseState);
        const { x, y } = get(position);
        return {
            x:      x + offset.x,
            y: 1 - (y + offset.y)
        }
    }

    function onMouseMove(e: MouseEvent) {
        position.update((state) => {
            if(!get(mouseState).isDown) return state;

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
            const { offset } = state;
            const { x, y } = get(position);

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
        position,
        mouseState,
        onMouseMove,
        onMouseDown,
        onMouseUp,
        getCursorPosition
    };
}