import { GUI } from '../gui';
import { Rect } from '../rect';
import { Panel } from './panel';
export declare class ImagePanel extends Panel {
    readonly srcRect: Rect;
    constructor(gui: GUI, srcRect: Rect, destRect: Rect);
    drawContents(): void;
}
