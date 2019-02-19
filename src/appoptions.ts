import {Rect} from './rect';

export interface AppOptions {
  canvas: HTMLCanvasElement|null;
  imageUrl: string;
  size: Rect;
  glyphSize?: Rect;
  fillWindow: boolean;
  scaleFactor?: number;
}
