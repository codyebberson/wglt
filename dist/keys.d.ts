/**
 * Creates a new key instance.
 */
export declare class Key {
    down: boolean;
    downCount: number;
    constructor();
}
export declare class Keys {
    private keys;
    /**
     * Creates a new keyboard module.
     *
     * @param el DOM el to attach listeners.
     */
    constructor(el: Element);
    setKey(e: KeyboardEvent, state: boolean): void;
    updateKeys(): void;
    getKey(keyCode: number): Key | null;
}
export declare const VK_ESCAPE = 27;
export declare const VK_SPACE = 32;
export declare const VK_LEFT = 37;
export declare const VK_UP = 38;
export declare const VK_RIGHT = 39;
export declare const VK_DOWN = 40;
export declare const VK_A = 65;
export declare const VK_D = 68;
export declare const VK_M = 77;
export declare const VK_Q = 81;
export declare const VK_S = 83;
export declare const VK_W = 87;
export declare const VK_Z = 90;
