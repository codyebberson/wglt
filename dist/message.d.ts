import { Color } from './color';
import { App } from './app';
import { Vec2 } from './vec2';
import { Font } from './font';
export declare class Message {
    readonly text: string;
    readonly color: Color;
    constructor(text: string, color: Color);
    draw(app: App, pos: Vec2): void;
    getWidth(font: Font): number;
}
