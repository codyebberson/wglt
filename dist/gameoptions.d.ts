import { Rect } from './rect';
export interface GameOptions {
    tileSize?: Rect;
    mapSize?: Rect;
    mapLayers?: number;
    viewDistance?: number;
    horizontalViewDistance?: number;
    verticalViewDistance?: number;
}
