import { Console } from '../console';
import { Point } from '../point';
import { Terminal } from '../terminal';
import { Dialog } from './dialog';
export declare class SelectDialog extends Dialog {
    readonly options: string[];
    readonly callback: (i: number) => void;
    private hoverIndex;
    constructor(title: string, options: string[], callback: (i: number) => void);
    drawContents(console: Console, offset: Point): void;
    handleInput(terminal: Terminal, offset: Point): boolean;
    isMouseOverOption(terminal: Terminal, offset: Point, index: number): boolean;
}
