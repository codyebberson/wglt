import { Rect } from '../rect';
import { Panel } from './panel';
export declare class Dialog extends Panel {
    readonly title: string;
    closeButton: boolean;
    constructor(rect: Rect, title: string);
    drawContents(): void;
    handleInput(): boolean;
    close(): void;
}
