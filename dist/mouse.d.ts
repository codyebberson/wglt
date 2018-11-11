import { TerminalOptions } from './terminaloptions';
export declare class Mouse {
    private readonly el;
    private readonly options;
    private readonly font;
    readonly buttons: boolean[];
    x: number;
    y: number;
    constructor(el: Element, options: TerminalOptions);
    update(e: MouseEvent): void;
    private requestFullscreen;
}
