import { Key } from '../keys';
import { Rect } from '../rect';
import { Button } from './button';
import { Panel } from './panel';
export declare class ButtonSlot extends Panel {
    shortcutKey?: Key;
    constructor(destRect: Rect, shortcutKey?: Key);
    readonly button: Button | undefined;
    drawContents(): void;
    handleInput(): boolean;
}
