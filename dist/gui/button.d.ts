import { Key } from '../keys';
import { Rect } from '../rect';
import { Panel } from './panel';
export declare class Button extends Panel {
    readonly srcRect: Rect;
    shortcutKey?: Key;
    onClick?: Function;
    constructor(srcRect: Rect, destRect: Rect, shortcutKey?: Key, onClick?: Function);
    drawContents(): void;
    handleInput(): boolean;
    click(): void;
}
