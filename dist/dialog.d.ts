import { Rect } from './rect';
import { Terminal } from './terminal';
export declare abstract class Dialog {
    readonly terminal: Terminal;
    readonly rect: Rect;
    readonly title: string;
    constructor(terminal: Terminal, rect: Rect, title: string);
    draw(term: Terminal): void;
    abstract drawContents(): void;
    abstract handleInput(): object | boolean;
}
