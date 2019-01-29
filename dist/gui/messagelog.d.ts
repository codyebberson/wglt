import { Color } from '../color';
import { GUI } from '../gui';
import { Rect } from '../rect';
import { Panel } from './panel';
export declare class MessageLog extends Panel {
    private readonly messages;
    readonly maxItems: number;
    constructor(gui: GUI, rect: Rect, maxItems?: number);
    add(text: string, color?: Color): void;
    drawContents(): void;
    handleInput(): boolean;
}
