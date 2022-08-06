import { Input } from './input';
import { Terminal } from './terminal';
export declare class Mouse {
    readonly el: HTMLCanvasElement;
    readonly width: number;
    readonly height: number;
    private prevX;
    private prevY;
    x: number;
    y: number;
    dx: number;
    dy: number;
    wheelDeltaX: number;
    wheelDeltaY: number;
    readonly buttons: Input[];
    constructor(terminal: Terminal);
    private handleTouchEvent;
    private handleEvent;
    private handleWheelEvent;
    private updatePosition;
    update(time: number): void;
}
