import { Input } from './input';
export declare class Keyboard {
    private readonly keys;
    /**
     * Creates a new keyboard module.
     *
     * @param el DOM el to attach listeners.
     */
    constructor(el: Element);
    private setKey;
    update(): void;
    getKey(keyCode: number): Input | null;
}
