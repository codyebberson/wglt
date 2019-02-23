import { GUI } from '../gui';
import { Rect } from '../rect';
import { Panel } from './panel';
import { Message } from '../message';
export declare class MessagePanel extends Panel {
    readonly message: Message;
    constructor(gui: GUI, rect: Rect, message: Message);
    drawContents(): void;
}
