import { App } from './app';
import { Color } from './color';
export declare class Sprite {
    private static globalAnimIndex;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly frames: number;
    readonly loop: boolean;
    readonly ticksPerFrame: number;
    readonly colorOverride?: Color;
    private animIndex;
    private animDelay;
    constructor(x: number, y: number, width: number, height: number, frames?: number, loop?: boolean, ticksPerFrame?: number, colorOverride?: Color);
    draw(app: App, x: number, y: number): void;
    static updateGlobalAnimations(): void;
}
