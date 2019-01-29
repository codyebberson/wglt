import { GUI } from '../gui';
import { Rect } from '../rect';
import { Panel } from './panel';
export declare class Dialog extends Panel {
    readonly title: string;
    constructor(gui: GUI, rect: Rect, title: string);
    drawContents(): void;
    handleInput(): boolean;
    close(): void;
}
