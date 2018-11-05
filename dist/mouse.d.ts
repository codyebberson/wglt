import { Font } from './font';
export declare class Mouse {
    font: Font;
    x: number;
    y: number;
    buttons: boolean[];
    constructor(el: Element, font: Font);
    update(e: MouseEvent): void;
}
