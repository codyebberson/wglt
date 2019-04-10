import { Color } from '../color';
import { Message } from '../message';
import { Rect } from '../rect';
import { Panel } from './panel';
export declare class MessageLog extends Panel {
    private readonly messages;
    readonly maxItems: number;
    constructor(rect: Rect, maxItems?: number);
    add(message: string | Message | Panel, color?: Color): void;
    drawContents(): void;
    handleInput(): boolean;
}
