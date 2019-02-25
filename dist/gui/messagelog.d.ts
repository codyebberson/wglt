import { Color } from '../color';
import { Rect } from '../rect';
import { Panel } from './panel';
export declare class MessageLog extends Panel {
    private readonly messages;
    readonly maxItems: number;
    constructor(rect: Rect, maxItems?: number);
    add(text: string | Panel, color?: Color): void;
    drawContents(): void;
    handleInput(): boolean;
}
