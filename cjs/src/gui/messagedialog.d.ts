import { Console } from '../console';
import { Point } from '../point';
import { Terminal } from '../terminal';
import { Dialog } from './dialog';
import { Message } from './message';
export declare class MessageDialog extends Dialog {
    readonly message: string | Message;
    constructor(title: string, message: string | Message);
    drawContents(console: Console, offset: Point): void;
    handleInput(terminal: Terminal): boolean;
}
