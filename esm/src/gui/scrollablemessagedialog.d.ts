import { Console } from '../console';
import { Point } from '../point';
import { Rect } from '../rect';
import { Terminal } from '../terminal';
import { Dialog } from './dialog';
import { Message } from './message';
export declare class ScrollableMessageDialog extends Dialog {
    readonly message: Message;
    readonly messagesHeight: number;
    readonly scrollMax: number;
    readonly scrollbarHeight: number;
    scrollY: number;
    constructor(rect: Rect, title: string, message: Message);
    drawContents(console: Console, offset: Point): void;
    handleInput(terminal: Terminal): boolean;
}
