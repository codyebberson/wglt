import { Key } from '../keys';
import { Rect } from '../rect';
import { Sprite } from '../sprite';
import { Panel } from './panel';
export declare class Button extends Panel {
    readonly sprite: Sprite;
    shortcutKey?: Key;
    onClick?: Function;
    constructor(destRect: Rect, sprite: Sprite, shortcutKey?: Key, onClick?: Function);
    drawContents(): void;
    handleInput(): boolean;
    click(): void;
}
