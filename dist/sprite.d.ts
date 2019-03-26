import { App } from './app';
import { Color } from './color';
import { Rect } from './rect';
export declare class Sprite extends Rect {
    static globalAnimIndex: number;
    readonly frames: number;
    readonly loop: boolean;
    readonly ticksPerFrame: number;
    readonly colorOverride?: Color;
    private animIndex;
    private animDelay;
    constructor(x: number, y: number, width: number, height: number, frames?: number, loop?: boolean, ticksPerFrame?: number, colorOverride?: Color);
    draw(app: App, x: number, y: number, colorOverride?: Color): void;
    clone(): Sprite;
    static updateGlobalAnimations(): void;
}
