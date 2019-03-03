import { Actor } from '../actor';
import { Color } from '../color';
import { Game } from '../game';
import { Effect } from './effect';
export declare class FloatingTextEffect extends Effect {
    readonly actor: Actor;
    readonly str: string;
    readonly color: Color;
    constructor(actor: Actor, str: string, color?: Color);
    draw(game: Game): void;
}
