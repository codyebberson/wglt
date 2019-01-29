import { App } from '../app';
import { Rect } from '../rect';
import { Dialog } from './dialog';
export declare class DialogRenderer {
    baseRect: Rect;
    constructor(baseRect: Rect);
    draw(app: App, dialog: Dialog): void;
}
