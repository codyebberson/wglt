import { Font } from './font';
import { Rect } from './rect';
export interface AppOptions {
    canvas: HTMLCanvasElement | null;
    imageUrl: string;
    size: Rect;
    font?: Font;
    fillWindow: boolean;
    scaleFactor?: number;
}
