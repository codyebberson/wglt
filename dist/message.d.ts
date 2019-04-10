import { Color } from './color';
import { App } from './app';
import { Vec2 } from './vec2';
export declare class Message {
    readonly text: string;
    readonly color: Color;
    constructor(text: string, color: Color);
    draw(app: App, pos: Vec2): void;
}
