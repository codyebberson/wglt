import { Message } from '../message';
import { Rect } from '../rect';
import { Panel } from './panel';
export declare class MessagePanel extends Panel {
    readonly message: Message;
    constructor(rect: Rect, message: Message);
    drawContents(): void;
}
