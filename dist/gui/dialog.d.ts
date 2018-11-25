import { Console } from '../console';
import { Point } from '../point';
import { Rect } from '../rect';
import { Terminal } from '../terminal';
export declare abstract class Dialog {
    readonly contentsRect: Rect;
    readonly title: string;
    constructor(contentsRect: Rect, title: string);
    abstract drawContents(console: Console, offset: Point): void;
    abstract handleInput(terminal: Terminal, offset: Point): object | boolean;
}
