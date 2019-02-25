import { Key } from '../keys';
import { Rect } from '../rect';
import { Panel } from './panel';
export declare class ButtonSlot extends Panel {
    shortcutKey?: Key;
    constructor(destRect: Rect, shortcutKey?: Key);
    drawContents(): void;
    handleInput(): boolean;
}
