import { Mouse } from './mouse';
import { Vec2 } from './vec2';
export declare class Rect extends Vec2 {
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
    readonly left: number;
    readonly top: number;
    getCenter(): Vec2;
    intersects(other: Rect): boolean;
    contains(point: Vec2 | Mouse): boolean;
}
