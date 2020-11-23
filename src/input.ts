
/**
 * The delay in frames before input repeating.
 * Assume 60 FPS.
 */
const INPUT_REPEAT_DELAY = 6;

/**
 * The delay between subsequent repeat firing.
 * Assume 60 FPS.
 */
const INPUT_REPEAT_RATE = 1;

/**
 * The Input class represents a pysical input.
 * Example: keyboard key or mouse button.
 */
export class Input {
    down: boolean;
    downCount: number;
    upCount: number;

    constructor() {
        this.down = false;
        this.downCount = 0;
        this.upCount = 0;
    }

    update() {
        if (this.down) {
            this.downCount++;
            this.upCount = 0;
        } else {
            this.downCount = 0;
            this.upCount++;
        }
    }

    /**
     * Returns true if the input is "pressed".
     * Pressed is a one time event when the input first goes down.
     * It then repeats on repeat delay.
     */
    isPressed() {
        const count = this.downCount;
        return count === 1 || (count > INPUT_REPEAT_DELAY && count % INPUT_REPEAT_RATE === 0);
    }

    /**
     * Returns true if the input is "clicked".
     * Clicked is a one time event when the input first goes up.
     */
    isClicked() {
        return this.upCount === 1;
    }
}
