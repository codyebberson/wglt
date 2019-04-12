import { App } from './app';
import { Vec2 } from './vec2';
import { Message } from './message';
export declare class CompoundMessage extends Message {
    readonly messages: Message[];
    constructor(...messages: Message[]);
    draw(app: App, pos: Vec2): void;
}
