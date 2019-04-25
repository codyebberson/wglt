import { App } from './app';
import { Vec2 } from './vec2';
import { Message } from './message';
import { Font } from './font';
export declare class CompoundMessage extends Message {
    readonly messages: Message[];
    constructor(...messages: Message[]);
    draw(app: App, pos: Vec2): void;
    getWidth(font: Font): number;
}
