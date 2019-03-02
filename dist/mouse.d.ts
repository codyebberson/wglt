import { App } from './app';
import { Input } from './input';
import { Vec2 } from './vec2';
export declare class Mouse extends Input {
    private readonly app;
    readonly prev: Vec2;
    readonly start: Vec2;
    x: number;
    y: number;
    dx: number;
    dy: number;
    dragDistance: number;
    longPress: boolean;
    constructor(app: App);
    private handleTouchEvent;
    private handleEvent;
    private updatePosition;
    update(): void;
    isClicked(): boolean;
    isDragging(): boolean;
    isLongPress(): boolean;
}
