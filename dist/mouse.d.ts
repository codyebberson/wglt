export declare class Mouse {
    x: number;
    y: number;
    buttons: boolean[];
    constructor(el: Element);
    update(e: MouseEvent): void;
}
