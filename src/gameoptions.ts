import { Rect } from './rect';
import { Vec2 } from './vec2';

export interface GameOptions {
  tileSize?: Rect;
  mapSize?: Rect;
  mapLayers?: number;
  viewDistance?: number;
  horizontalViewDistance?: number;
  verticalViewDistance?: number;
  focusMargins?: Vec2;
}
