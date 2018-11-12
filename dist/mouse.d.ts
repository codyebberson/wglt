import { TerminalOptions } from './terminaloptions';
export declare class Mouse {
    private readonly el;
    private readonly options;
    private readonly font;
    readonly buttons: boolean[];
    private prevX;
    private prevY;
    x: number;
    y: number;
    dx: number;
    dy: number;
    constructor(el: Element, options: TerminalOptions);
    private handleEvent;
    private requestFullscreen;
    update(): void;
}
