import { Rect } from '../rect';
import { Panel } from './panel';
export declare class Dialog extends Panel {
    closeButton: boolean;
    constructor(rect: Rect);
    drawContents(): void;
    handleInput(): boolean;
    close(): void;
}
