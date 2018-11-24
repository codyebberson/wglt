import { Point } from './point';
export declare class Rect {
    readonly x: number;
    readonly y: number;
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
    readonly x2: number;
    readonly y2: number;
    constructor(x: number, y: number, width: number, height: number);
    getCenter(): Point;
    intersects(other: Rect): boolean;
}
