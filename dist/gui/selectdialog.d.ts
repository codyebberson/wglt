import { Console } from '../console';
import { Point } from '../point';
import { Terminal } from '../terminal';
import { Dialog } from './dialog';
export declare class SelectDialog extends Dialog {
    options: string[];
    callback: Function;
    constructor(title: string, options: string[], callback: (choice: number) => void);
    drawContents(console: Console, offset: Point): void;
    handleInput(terminal: Terminal, offset: Point): boolean;
}
