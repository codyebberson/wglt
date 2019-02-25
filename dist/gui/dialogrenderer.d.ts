import { App } from '../app';
import { Rect } from '../rect';
import { Dialog } from './dialog';
export declare class DialogRenderer {
    baseRect: Rect;
    closeButtonRect?: Rect;
    buttonSlotRect?: Rect;
    constructor(baseRect: Rect, closeButtonRect?: Rect);
    draw(app: App, dialog: Dialog): void;
}
