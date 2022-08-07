/**
 * The Input class represents a pysical input.
 * Example: keyboard key or mouse button.
 */
export declare class Input {
    down: boolean;
    downTime: number;
    repeat: boolean;
    repeatTime: number;
    downCount: number;
    upCount: number;
    constructor();
    setDown(down: boolean): void;
    update(time: number): void;
    /**
     * Returns true if the input is "pressed".
     * Pressed is a one time event when the input first goes down.
     * It then repeats on repeat delay.
     */
    isPressed(): boolean;
    /**
     * Returns true if the input is "clicked".
     * Clicked is a one time event when the input first goes up.
     */
    isClicked(): boolean;
}
export declare class InputSet<T> {
    readonly inputs: Map<T, Input>;
    clear(): void;
    get(key: T): Input;
    updateAll(time: number): void;
}
