import { Terminal } from './terminal';
import { TerminalOptions } from './terminaloptions';
export declare class Mouse {
    private readonly el;
    private readonly width;
    private readonly height;
    private readonly options;
    readonly buttons: boolean[];
    private prevX;
    private prevY;
    x: number;
    y: number;
    dx: number;
    dy: number;
    constructor(terminal: Terminal, options: TerminalOptions);
    private handleTouchEvent;
    private handleEvent;
    private updatePosition;
    private requestFullscreen;
    update(): void;
}
