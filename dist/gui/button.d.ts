import { Key } from '../keys';
import { Message } from '../message';
import { Rect } from '../rect';
import { Sprite } from '../sprite';
import { Panel } from './panel';
import { TooltipDialog } from './tooltipdialog';
export declare class Button extends Panel {
    readonly sprite: Sprite;
    shortcutKey?: Key;
    onClick?: Function;
    tooltipMessages?: Message[];
    constructor(destRect: Rect, sprite: Sprite, shortcutKey?: Key, onClick?: Function);
    drawContents(): void;
    handleInput(): boolean;
    click(): void;
    updateTooltip(tooltip: TooltipDialog): void;
}
