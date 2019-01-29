import { App } from './app';
import { Input } from './input';
export declare class Mouse extends Input {
    private readonly app;
    private prevX;
    private prevY;
    x: number;
    y: number;
    dx: number;
    dy: number;
    constructor(app: App);
    private handleTouchEvent;
    private handleEvent;
    private updatePosition;
    update(): void;
}
