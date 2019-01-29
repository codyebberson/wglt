import { GUI } from '../gui';
import { Rect } from '../rect';
export declare abstract class Panel {
    readonly gui: GUI;
    readonly rect: Rect;
    readonly modal: boolean;
    constructor(gui: GUI, rect: Rect, modal?: boolean);
    drawContents(): void;
    handleInput(): boolean;
}
