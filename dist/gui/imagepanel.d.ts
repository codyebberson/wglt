import { Rect } from '../rect';
import { Panel } from './panel';
export declare class ImagePanel extends Panel {
    readonly srcRect: Rect;
    constructor(srcRect: Rect, destRect: Rect);
    drawContents(): void;
}
