import { Console } from '../console';
import { Point } from '../point';
import { Terminal } from '../terminal';
import { Dialog } from './dialog';
export declare class MessageDialog extends Dialog {
    readonly lines: string[];
    constructor(title: string, message: string);
    drawContents(console: Console, offset: Point): void;
    handleInput(terminal: Terminal, offset: Point): boolean;
}
