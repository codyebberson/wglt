import { Color } from '../color';
import { Game } from '../game';
import { Effect } from './effect';
export declare class FloatingTextEffect extends Effect {
    readonly str: string;
    readonly pixelX: number;
    readonly pixelY: number;
    readonly color: Color;
    constructor(str: string, pixelX: number, pixelY: number, color?: Color);
    draw(game: Game): void;
}
