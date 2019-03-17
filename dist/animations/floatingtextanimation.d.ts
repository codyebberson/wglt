import { Actor } from '../actor';
import { Color } from '../color';
import { Game } from '../game';
import { Animation } from './animation';
export declare class FloatingTextAnimation extends Animation {
    readonly actor: Actor;
    readonly str: string;
    readonly color: Color;
    constructor(actor: Actor, str: string, color?: Color);
    draw(game: Game): void;
}
